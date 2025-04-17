import twilio from 'twilio';

// Check for required environment variables
const hasRequiredVars = process.env.TWILIO_ACCOUNT_SID && 
                       process.env.TWILIO_API_KEY && 
                       process.env.TWILIO_API_SECRET;

if (!hasRequiredVars) {
  console.error('ERROR: Missing required Twilio environment variables. Video conferencing will not work.');
}

// Create a mock implementation for development without Twilio credentials
// This allows the app to start even without proper Twilio setup
let AccessToken: any;
let VideoGrant: any;
let twilioClient: any;

try {
  // Try to use real Twilio implementation
  if (hasRequiredVars) {
    // @ts-ignore - The twilio types may not be accurate
    const { jwt } = twilio as any;
    // @ts-ignore - The twilio types may not be accurate
    AccessToken = jwt.AccessToken;
    // @ts-ignore - The twilio types may not be accurate
    VideoGrant = AccessToken.VideoGrant;
    
    // Only create the client if we have valid credentials
    if (process.env.TWILIO_ACCOUNT_SID?.startsWith('AC')) {
      twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_API_SECRET);
    } else {
      console.error('ERROR: Invalid Twilio Account SID format. Must start with "AC".');
      // Will use mock implementation
    }
  }
} catch (error) {
  console.error('Failed to initialize Twilio client:', error);
  // Will use mock implementation
}

// Fallback mock implementations if Twilio initialization failed
if (!AccessToken) {
  console.warn('Using mock Twilio implementation');
  
  // Mock AccessToken class
  AccessToken = class {
    identity: string;
    constructor(_accountSid: string, _apiKey: string, _apiSecret: string, options: { identity: string }) {
      this.identity = options.identity;
    }
    
    addGrant() {}
    
    toJwt() {
      return 'mock-jwt-token-for-' + this.identity;
    }
  };
  
  // Mock VideoGrant class
  VideoGrant = class {
    constructor(options: { room?: string } = {}) {}
  };
  
  // Mock twilioClient
  twilioClient = {
    video: {
      v1: {
        rooms: function(roomName: string) {
          return {
            fetch: () => Promise.reject(new Error('Room not found (mock)')),
            update: () => Promise.resolve({ status: 'completed' })
          };
        },
        rooms: {
          create: (options: any) => Promise.resolve({ sid: 'mock-room-sid', uniqueName: options.uniqueName }),
          list: () => Promise.resolve([])
        }
      }
    }
  };
}

/**
 * Generate an Access Token for a video room
 * @param identity - The user identity (e.g., user name or ID)
 * @param roomName - The name of the room to join
 */
export function generateVideoToken(identity: string, roomName: string): string {
  try {
    // Create an Access Token
    const token = new AccessToken(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_API_KEY!,
      process.env.TWILIO_API_SECRET!,
      { identity }
    );

    // Create a Video grant and add it to the token
    const videoGrant = new VideoGrant({ room: roomName });
    token.addGrant(videoGrant);

    // Serialize the token to a JWT string
    return token.toJwt();
  } catch (error) {
    console.error('Error generating video token:', error);
    throw error;
  }
}

/**
 * Create a new video room or return an existing one
 * @param roomName - The name of the room to create
 */
export async function createVideoRoom(roomName: string) {
  try {
    // Check if the room already exists
    let room;
    try {
      room = await twilioClient.video.v1.rooms(roomName).fetch();
    } catch (error) {
      // If the room doesn't exist, create a new one
      room = await twilioClient.video.v1.rooms.create({
        uniqueName: roomName,
        type: 'group', // 'group' for small group rooms (up to 50 participants)
        recordParticipantsOnConnect: false,
        statusCallback: process.env.TWILIO_STATUS_CALLBACK_URL // Optional
      });
    }
    return room;
  } catch (error) {
    console.error('Error creating video room:', error);
    throw error;
  }
}

/**
 * End a video room
 * @param roomName - The name of the room to end
 */
export async function endVideoRoom(roomName: string) {
  try {
    return await twilioClient.video.v1.rooms(roomName).update({ status: 'completed' });
  } catch (error) {
    console.error('Error ending video room:', error);
    throw error;
  }
}

/**
 * List active video rooms
 */
export async function listVideoRooms() {
  try {
    return await twilioClient.video.v1.rooms.list({ status: 'in-progress' });
  } catch (error) {
    console.error('Error listing video rooms:', error);
    throw error;
  }
}
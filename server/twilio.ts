import twilio from 'twilio';
import { AccessToken } from 'twilio';
import VideoGrant from 'twilio/lib/jwt/AccessToken/VideoGrant';

// Check for required environment variables
if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_API_KEY || !process.env.TWILIO_API_SECRET) {
  console.error('ERROR: Missing required Twilio environment variables. Video conferencing will not work.');
}

const twilioClient = twilio(process.env.TWILIO_API_KEY, process.env.TWILIO_API_SECRET, {
  accountSid: process.env.TWILIO_ACCOUNT_SID
});

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
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Video, X, Mic, MicOff, Phone, Camera, CameraOff, Users, MessageSquare } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { ScrollArea } from '@/components/ui/scroll-area';

// Type for props
interface VideoConferenceProps {
  currentUser: {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
  };
  interviewId?: number;
  prospectId?: number;
  onClose?: () => void;
}

// Declare global variables for Twilio
declare global {
  interface Window {
    Twilio: any;
    Video: any;
  }
}

// Create Video Conference component
const VideoConference: React.FC<VideoConferenceProps> = ({ 
  currentUser, 
  interviewId, 
  prospectId,
  onClose 
}) => {
  const { toast } = useToast();
  const [identity, setIdentity] = useState(`${currentUser.firstName} ${currentUser.lastName}`);
  const [roomName, setRoomName] = useState(interviewId ? `interview-${interviewId}` : '');
  const [room, setRoom] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [localVideoTrack, setLocalVideoTrack] = useState<any>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<any>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);
  const [messages, setMessages] = useState<{sender: string, content: string, timestamp: Date}[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteContainerRef = useRef<HTMLDivElement>(null);
  
  // Load Twilio script
  useEffect(() => {
    const loadTwilioScript = () => {
      if (!window.Twilio) {
        const script = document.createElement('script');
        script.src = 'https://sdk.twilio.com/js/video/releases/2.26.2/twilio-video.min.js';
        script.async = true;
        script.onload = () => console.log('Twilio Video script loaded');
        document.body.appendChild(script);
      }
    };

    loadTwilioScript();
  }, []);

  // Handler for joining a room
  const handleJoinRoom = useCallback(async () => {
    if (!roomName || !identity) {
      toast({
        title: "Missing information",
        description: "Room name and your name are required.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsJoiningRoom(true);
      
      // Create or get a room
      await apiRequest('POST', '/api/video/room', { roomName });
      
      // Get access token
      const response = await apiRequest('POST', '/api/video/token', { identity, roomName });
      const { token } = await response.json();
      
      if (!token) {
        throw new Error('Failed to get access token');
      }
      
      // Connect to the room with the token
      const Video = window.Twilio.Video;
      
      // Create local tracks (camera and microphone)
      const localTracks = await Video.createLocalTracks({
        audio: true,
        video: { width: 640, height: 480 }
      });
      
      // Connect to the room
      const roomInstance = await Video.connect(token, {
        name: roomName,
        tracks: localTracks
      });
      
      // Set state when connected
      setRoom(roomInstance);
      
      // Save local tracks
      const videoTrack = localTracks.find((track: any) => track.kind === 'video');
      const audioTrack = localTracks.find((track: any) => track.kind === 'audio');
      
      setLocalVideoTrack(videoTrack);
      setLocalAudioTrack(audioTrack);
      
      // Attach local video to the page
      if (videoTrack && localVideoRef.current) {
        videoTrack.attach(localVideoRef.current);
      }
      
      // Set initial participants
      setParticipants(Array.from(roomInstance.participants.values()));
      
      // Listen for participants connecting to the room
      roomInstance.on('participantConnected', (participant: any) => {
        setParticipants(prevParticipants => [...prevParticipants, participant]);
        toast({
          title: "Participant joined",
          description: `${participant.identity} has joined the room.`
        });
      });
      
      // Listen for participants disconnecting
      roomInstance.on('participantDisconnected', (participant: any) => {
        setParticipants(prevParticipants => prevParticipants.filter(p => p !== participant));
        toast({
          title: "Participant left",
          description: `${participant.identity} has left the room.`
        });
      });
      
      // Close dialog after joining
      setIsDialogOpen(false);
      
      toast({
        title: "Connected to room",
        description: `You've joined room: ${roomName}`
      });
    } catch (error) {
      console.error('Error joining room:', error);
      toast({
        title: "Failed to join room",
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: "destructive"
      });
    } finally {
      setIsJoiningRoom(false);
    }
  }, [roomName, identity, toast]);

  // Handle leaving the room
  const handleLeaveRoom = useCallback(() => {
    if (room) {
      room.disconnect();
      setRoom(null);
      
      if (localVideoTrack) {
        localVideoTrack.stop();
        setLocalVideoTrack(null);
      }
      
      if (localAudioTrack) {
        localAudioTrack.stop();
        setLocalAudioTrack(null);
      }
      
      setParticipants([]);
      toast({
        title: "Disconnected",
        description: "You've left the video conference."
      });
      
      if (onClose) {
        onClose();
      }
    }
  }, [room, localVideoTrack, localAudioTrack, onClose, toast]);

  // Toggle audio mute
  const toggleMute = useCallback(() => {
    if (localAudioTrack) {
      if (isMuted) {
        localAudioTrack.enable();
      } else {
        localAudioTrack.disable();
      }
      setIsMuted(!isMuted);
    }
  }, [localAudioTrack, isMuted]);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localVideoTrack) {
      if (isVideoOff) {
        localVideoTrack.enable();
      } else {
        localVideoTrack.disable();
      }
      setIsVideoOff(!isVideoOff);
    }
  }, [localVideoTrack, isVideoOff]);

  // Handle sending messages
  const handleSendMessage = useCallback(() => {
    if (messageInput.trim() && room) {
      // Send message to all participants
      room.localParticipant.publishTrack({
        name: 'chat',
        data: messageInput
      });
      
      // Add message to local state
      const newMessage = {
        sender: identity,
        content: messageInput,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessageInput('');
    }
  }, [messageInput, room, identity]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (room) {
        room.disconnect();
      }
      
      if (localVideoTrack) {
        localVideoTrack.stop();
      }
      
      if (localAudioTrack) {
        localAudioTrack.stop();
      }
    };
  }, [room, localVideoTrack, localAudioTrack]);

  // Set up participant video attachments
  useEffect(() => {
    if (!room) return;

    const attachParticipantTracks = (participant: any) => {
      participant.tracks.forEach((publication: any) => {
        if (publication.track) {
          attachTrack(publication.track, participant.identity);
        }
      });
      
      participant.on('trackSubscribed', (track: any) => {
        attachTrack(track, participant.identity);
      });
      
      participant.on('trackUnsubscribed', (track: any) => {
        detachTrack(track);
      });
    };
    
    const attachTrack = (track: any, identity: string) => {
      if (track.kind === 'video' && remoteContainerRef.current) {
        const container = document.createElement('div');
        container.id = `participant-${identity}`;
        container.className = 'remote-participant';
        
        const nameLabel = document.createElement('div');
        nameLabel.className = 'participant-name';
        nameLabel.innerText = identity;
        
        container.appendChild(nameLabel);
        track.attach(container);
        remoteContainerRef.current.appendChild(container);
      }
    };
    
    const detachTrack = (track: any) => {
      track.detach().forEach((element: HTMLElement) => {
        const container = element.parentElement;
        if (container) {
          container.remove();
        }
      });
    };
    
    participants.forEach(attachParticipantTracks);
    
  }, [participants, room]);

  return (
    <div className="video-conference-container">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="default" 
            onClick={() => setIsDialogOpen(true)}
            disabled={!!room}
          >
            <Video className="mr-2 h-4 w-4" />
            Start Video Conference
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Join Video Conference</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Your Name
              </Label>
              <Input
                id="name"
                value={identity}
                onChange={(e) => setIdentity(e.target.value)}
                className="col-span-3"
                placeholder="Enter your name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="room" className="text-right">
                Room Name
              </Label>
              <Input
                id="room"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="col-span-3"
                placeholder="Enter room name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleJoinRoom} disabled={isJoiningRoom || isCreatingRoom}>
              {isJoiningRoom ? 'Joining...' : 'Join Room'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {room && (
        <Card className="w-full max-w-4xl mx-auto mt-4">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <div>Video Conference: {roomName}</div>
              <Button variant="destructive" size="icon" onClick={handleLeaveRoom}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
            <CardDescription>
              Connected as {identity} with {participants.length} other participants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="video">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="video">Video Call</TabsTrigger>
                <TabsTrigger value="chat">Chat</TabsTrigger>
              </TabsList>
              <TabsContent value="video" className="space-y-4">
                <div className="video-grid">
                  <div className="local-video-container">
                    <div ref={localVideoRef} className="local-video"></div>
                    <div className="participant-name">{identity} (You)</div>
                  </div>
                  <div ref={remoteContainerRef} className="remote-participants"></div>
                </div>
                <div className="video-controls flex justify-center gap-2">
                  <Button 
                    variant={isMuted ? "destructive" : "default"} 
                    size="icon" 
                    onClick={toggleMute}
                  >
                    {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  <Button 
                    variant={isVideoOff ? "destructive" : "default"} 
                    size="icon" 
                    onClick={toggleVideo}
                  >
                    {isVideoOff ? <CameraOff className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    onClick={handleLeaveRoom}
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                  >
                    <Users className="h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="chat">
                <div className="chat-container">
                  <ScrollArea className="h-[300px] mb-4">
                    {messages.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">No messages yet</p>
                    ) : (
                      <div className="space-y-2 p-2">
                        {messages.map((msg, idx) => (
                          <div 
                            key={idx} 
                            className={`flex flex-col ${msg.sender === identity ? 'items-end' : 'items-start'}`}
                          >
                            <div className={`px-3 py-2 rounded-lg ${
                              msg.sender === identity ? 'bg-primary text-primary-foreground' : 'bg-muted'
                            }`}>
                              {msg.content}
                            </div>
                            <span className="text-xs text-muted-foreground mt-1">
                              {msg.sender} • {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                  <div className="flex gap-2">
                    <Input
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type a message..."
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button 
                      variant="default" 
                      size="icon" 
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim()}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              {isVideoOff ? 'Camera is turned off' : 'Camera is on'} • 
              {isMuted ? ' Microphone is muted' : ' Microphone is on'}
            </div>
          </CardFooter>
        </Card>
      )}

      <style>
        {`
        .video-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1rem;
        }`}
        
        .local-video-container {
          position: relative;
          width: 100%;
          aspect-ratio: 16/9;
          background: #1c1c1c;
          border-radius: 0.5rem;
          overflow: hidden;
        }
        
        .local-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .remote-participants {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }
        
        .remote-participant {
          position: relative;
          width: 100%;
          aspect-ratio: 16/9;
          background: #1c1c1c;
          border-radius: 0.5rem;
          overflow: hidden;
        }
        
        .participant-name {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.5);
          color: white;
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
        }
        
        .video-controls {
          margin-top: 1rem;
        }
      `}</style>
    </div>
  );
};

export default VideoConference;
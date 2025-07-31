import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, VideoOff, Mic, MicOff, Phone, MessageSquare, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface VideoCallInterfaceProps {
  appointmentId: string;
  clientId: string;
  therapistId: string;
  userRole: 'client' | 'therapist';
}

export const VideoCallInterface = ({ 
  appointmentId, 
  clientId, 
  therapistId, 
  userRole 
}: VideoCallInterfaceProps) => {
  const [callStatus, setCallStatus] = useState<'waiting' | 'connecting' | 'connected' | 'ended'>('waiting');
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    initializeVideoSession();
  }, [appointmentId]);

  const initializeVideoSession = async () => {
    try {
      // Check if video session already exists
      const { data: existingSession } = await supabase
        .from('video_sessions')
        .select('*')
        .eq('appointment_id', appointmentId)
        .single();

      if (existingSession) {
        setRoomId(existingSession.room_id);
        setCallStatus(existingSession.status === 'active' ? 'connected' : 'waiting');
      } else {
        // Create new video session
        const newRoomId = `room_${appointmentId}_${Date.now()}`;
        
        const { error } = await supabase
          .from('video_sessions')
          .insert({
            appointment_id: appointmentId,
            client_id: clientId,
            therapist_id: therapistId,
            room_id: newRoomId,
            status: 'scheduled'
          });

        if (error) throw error;
        
        setRoomId(newRoomId);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to initialize video session",
        variant: "destructive",
      });
    }
  };

  const startCall = async () => {
    if (!roomId) return;
    
    setCallStatus('connecting');
    
    try {
      // Update video session status to active
      const { error } = await supabase
        .from('video_sessions')
        .update({ 
          status: 'active',
          started_at: new Date().toISOString()
        })
        .eq('room_id', roomId);

      if (error) throw error;

      // Simulate video call connection
      setTimeout(() => {
        setCallStatus('connected');
        toast({
          title: "Call connected",
          description: "You are now connected to the video call",
        });
      }, 2000);
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to start video call",
        variant: "destructive",
      });
      setCallStatus('waiting');
    }
  };

  const endCall = async () => {
    if (!roomId) return;
    
    try {
      // Update video session status to ended
      const { error } = await supabase
        .from('video_sessions')
        .update({ 
          status: 'ended',
          ended_at: new Date().toISOString()
        })
        .eq('room_id', roomId);

      if (error) throw error;

      setCallStatus('ended');
      
      toast({
        title: "Call ended",
        description: "The video call has been ended",
      });
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to end video call",
        variant: "destructive",
      });
    }
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    toast({
      title: isVideoOn ? "Video turned off" : "Video turned on",
      description: `Your video is now ${isVideoOn ? 'off' : 'on'}`,
    });
  };

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
    toast({
      title: isAudioOn ? "Microphone muted" : "Microphone unmuted",
      description: `Your microphone is now ${isAudioOn ? 'muted' : 'unmuted'}`,
    });
  };

  const getStatusBadge = () => {
    switch (callStatus) {
      case 'waiting':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Waiting</Badge>;
      case 'connecting':
        return <Badge variant="outline" className="text-blue-600 border-blue-600">Connecting</Badge>;
      case 'connected':
        return <Badge variant="outline" className="text-green-600 border-green-600">Connected</Badge>;
      case 'ended':
        return <Badge variant="outline" className="text-gray-600 border-gray-600">Ended</Badge>;
      default:
        return <Badge variant="outline">{callStatus}</Badge>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Video Session
            </CardTitle>
            {getStatusBadge()}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Video Area */}
            <div className="bg-black rounded-lg aspect-video flex items-center justify-center relative">
              {callStatus === 'connected' ? (
                <div className="text-white text-center">
                  <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Video call in progress</p>
                  <p className="text-sm opacity-75">
                    Room ID: {roomId?.slice(-8)}
                  </p>
                </div>
              ) : callStatus === 'connecting' ? (
                <div className="text-white text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
                  <p className="text-lg">Connecting...</p>
                </div>
              ) : (
                <div className="text-white text-center">
                  <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">
                    {callStatus === 'ended' ? 'Call ended' : 'Waiting to start call'}
                  </p>
                </div>
              )}
              
              {/* Video Controls */}
              {callStatus === 'connected' && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  <Button
                    size="sm"
                    variant={isAudioOn ? "default" : "destructive"}
                    onClick={toggleAudio}
                  >
                    {isAudioOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant={isVideoOn ? "default" : "destructive"}
                    onClick={toggleVideo}
                  >
                    {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={endCall}
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Call Controls */}
            <div className="flex justify-center gap-4">
              {callStatus === 'waiting' && (
                <Button onClick={startCall} size="lg">
                  <Video className="h-5 w-5 mr-2" />
                  Start Call
                </Button>
              )}
              
              <Button
                variant="outline"
                onClick={() => setShowChat(!showChat)}
                size="lg"
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                {showChat ? 'Hide Chat' : 'Show Chat'}
              </Button>
            </div>

            {/* Chat Interface */}
            {showChat && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Session Chat</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-accent rounded-lg p-4 mb-4 overflow-y-auto">
                    <p className="text-sm text-muted-foreground text-center">
                      Chat messages will appear here
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="flex-1 px-3 py-2 border rounded-md"
                    />
                    <Button size="sm">Send</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
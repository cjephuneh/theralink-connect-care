
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  Phone,
  MessageCircle,
  Clock
} from "lucide-react";

// Mock therapist data
const mockTherapists = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "3",
    name: "Dr. Amara Okafor",
    image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
  },
];

const VideoChat = () => {
  const { therapistId } = useParams<{ therapistId: string }>();
  const [therapist, setTherapist] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [callActive, setCallActive] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [sessionTime, setSessionTime] = useState(0);
  const [waitTime, setWaitTime] = useState(0);
  
  // Mock timing interval for session duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (callActive) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    } else if (connecting) {
      interval = setInterval(() => {
        setWaitTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [callActive, connecting]);
  
  // Format time display (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Load therapist data
  useEffect(() => {
    setLoading(true);
    // In a real app, this would be an API call to get therapist details
    setTimeout(() => {
      const found = mockTherapists.find(t => t.id === therapistId);
      setTherapist(found || null);
      setLoading(false);
    }, 800);
  }, [therapistId]);
  
  // Start video call
  const startCall = () => {
    setConnecting(true);
    
    // In a real app, this would initiate a WebRTC connection
    // For demo, we'll simulate connecting and then a successful call
    setTimeout(() => {
      setConnecting(false);
      setCallActive(true);
    }, 3000);
  };
  
  // End video call
  const endCall = () => {
    setCallActive(false);
    setSessionTime(0);
    setWaitTime(0);
  };
  
  // Toggle video
  const toggleVideo = () => {
    setVideoEnabled(!videoEnabled);
  };
  
  // Toggle audio
  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center">
        <div className="w-full max-w-4xl h-96 flex items-center justify-center">
          <div className="animate-pulse-subtle">
            <p className="text-gray-500">Loading video session...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!therapist) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white p-8 rounded-xl shadow-sm text-center">
          <h2 className="text-2xl font-bold mb-4">Therapist Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find the therapist you're looking for.</p>
          <Button asChild>
            <Link to="/therapists">Back to Therapist Directory</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <Card className="overflow-hidden">
          <div className="bg-thera-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src={therapist.image} 
                alt={therapist.name}
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
              <div>
                <h1 className="font-bold">Video Session with {therapist.name}</h1>
                <p className="text-xs opacity-80">End-to-end encrypted • HIPAA compliant</p>
              </div>
            </div>
            <div className="flex items-center">
              {callActive && (
                <div className="bg-red-500/20 px-3 py-1 rounded-full flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  <span className="text-xs">{formatTime(sessionTime)}</span>
                </div>
              )}
            </div>
          </div>
          
          <CardContent className="p-0">
            <div className="relative bg-gray-900 w-full" style={{ height: '70vh' }}>
              {/* Main video area */}
              <div className="absolute inset-0 flex items-center justify-center">
                {!callActive && !connecting ? (
                  <div className="text-center text-white">
                    <div className="bg-thera-600/20 p-10 rounded-xl backdrop-blur-sm">
                      <h2 className="text-2xl font-bold mb-2">Ready to connect with {therapist.name}?</h2>
                      <p className="text-gray-200 mb-6">
                        Make sure your camera and microphone are working before starting the session.
                      </p>
                      <Button
                        className="bg-thera-600 hover:bg-thera-700 text-white"
                        onClick={startCall}
                      >
                        <Video className="h-5 w-5 mr-2" />
                        Start Video Session
                      </Button>
                    </div>
                  </div>
                ) : connecting ? (
                  <div className="text-center text-white">
                    <div className="bg-thera-600/20 p-10 rounded-xl backdrop-blur-sm animate-pulse-subtle">
                      <h2 className="text-2xl font-bold mb-2">Connecting to {therapist.name}...</h2>
                      <p className="text-gray-200">
                        Wait time: {formatTime(waitTime)}
                      </p>
                    </div>
                  </div>
                ) : (
                  // Therapist video (main)
                  <div className="w-full h-full">
                    <img 
                      src={therapist.image}
                      alt={therapist.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              
              {/* Self-view (smaller) */}
              {callActive && (
                <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-thera-500 shadow-lg">
                  {videoEnabled ? (
                    <div className="bg-gray-700 w-full h-full flex items-center justify-center text-white">
                      <p>Your camera view</p>
                    </div>
                  ) : (
                    <div className="bg-gray-800 w-full h-full flex items-center justify-center text-white">
                      <VideoOff className="h-10 w-10 opacity-50" />
                    </div>
                  )}
                </div>
              )}
              
              {/* Control bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant={audioEnabled ? "outline" : "destructive"}
                    size="icon"
                    onClick={toggleAudio}
                    className={audioEnabled ? "bg-white/10 hover:bg-white/20 border-white/30 text-white" : ""}
                  >
                    {audioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                  </Button>
                  
                  <Button
                    variant={videoEnabled ? "outline" : "destructive"}
                    size="icon"
                    onClick={toggleVideo}
                    className={videoEnabled ? "bg-white/10 hover:bg-white/20 border-white/30 text-white" : ""}
                  >
                    {videoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                  </Button>
                  
                  {callActive && (
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={endCall}
                    >
                      <Phone className="h-5 w-5" />
                    </Button>
                  )}
                  
                  <Button
                    asChild
                    variant="outline"
                    className="bg-white/10 hover:bg-white/20 border-white/30 text-white"
                  >
                    <Link to={`/chat/${therapistId}`}>
                      <MessageCircle className="h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-6 bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold mb-4">Session Information</h2>
          <div className="space-y-2">
            <p className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-thera-600" />
              <span>50-minute session</span>
            </p>
            <p className="text-sm text-gray-600">
              After your session, you can continue the conversation through secure messaging or schedule a follow-up appointment.
            </p>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap gap-3">
            <Button
              asChild
              variant="outline"
            >
              <Link to={`/therapists/${therapistId}`}>
                View Therapist Profile
              </Link>
            </Button>
            <Button
              asChild
            >
              <Link to={`/therapists/${therapistId}/book`}>
                Schedule Follow-up
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoChat;

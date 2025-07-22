import { useState, useEffect, useRef } from 'react';
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
  Clock,
  Shield,
  Calendar,
  Settings,
  HelpCircle,
  Volume2,
  Volume1,
  VolumeX,
  ScreenShare,
  Laptop,
  UserPlus,
  Loader2,
} from "lucide-react";

interface Therapist {
  id: string;
  name: string;
  image: string;
  specialty: string;
}

interface JitsiMeetOptions {
  roomName: string;
  width: string;
  height: string;
  parentNode: HTMLElement;
  userInfo?: {
    displayName?: string;
    email?: string;
  };
  configOverwrite?: Record<string, any>;
  interfaceConfigOverwrite?: Record<string, any>;
}

const VideoChat = () => {
  const { therapistId } = useParams<{ therapistId: string }>();
  const [therapist, setTherapist] = useState<Therapist | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [callActive, setCallActive] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [sessionTime, setSessionTime] = useState(0);
  const [waitTime, setWaitTime] = useState(0);
  const [volume, setVolume] = useState(2); // 0: muted, 1: low, 2: normal
  const [screenShareActive, setScreenShareActive] = useState(false);
  const [networkQuality, setNetworkQuality] = useState(3); // 1-3 scale
  const jitsiContainer = useRef<HTMLDivElement>(null);
  const [jitsi, setJitsi] = useState<any>(null);

  // Load therapist data
  useEffect(() => {
    const fetchTherapist = async () => {
      setLoading(true);
      try {
        // Replace with your actual API call
        // const response = await fetch(`/api/therapists/${therapistId}`);
        // const data = await response.json();
        // setTherapist(data);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('role','therapist')
          .single();
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTherapist();
  }, [therapistId]);

  // Timing interval for session duration
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

  // Load Jitsi Meet API and initialize
  useEffect(() => {
    if (!therapistId || !jitsiContainer.current) return;

    const loadJitsiScript = () => {
      const script = document.createElement('script');
      script.src = 'https://meet.jit.si/external_api.js';
      script.async = true;
      script.onload = initializeJitsi;
      document.body.appendChild(script);
    };

    const initializeJitsi = () => {
      if (!window.JitsiMeetExternalAPI || !jitsiContainer.current) return;
      
      const domain = 'meet.jit.si';
      const options: JitsiMeetOptions = {
        roomName: `thera-session-${therapistId}`,
        width: '100%',
        height: '100%',
        parentNode: jitsiContainer.current,
        configOverwrite: {
          startWithAudioMuted: !audioEnabled,
          startWithVideoMuted: !videoEnabled,
          disableSimulcast: false,
          enableNoAudioDetection: true,
          enableNoisyMicDetection: true,
          enableClosePage: false,
          prejoinPageEnabled: false,
          disableRemoteMute: true,
          toolbarButtons: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
            'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
            'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
            'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
            'tileview', 'select-background', 'download', 'help'
          ],
        },
        interfaceConfigOverwrite: {
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          SHOW_CHROME_EXTENSION_BANNER: false,
          MOBILE_APP_PROMO: false,
          HIDE_INVITE_MORE_HEADER: true,
          DEFAULT_BACKGROUND: '#f3f4f6',
        },
        userInfo: {
          displayName: 'Patient',
        }
      };
      
      const _jitsi = new window.JitsiMeetExternalAPI(domain, options);
      setJitsi(_jitsi);
      
      // Event listeners
      _jitsi.addListener('videoConferenceJoined', () => {
        setCallActive(true);
        setConnecting(false);
      });
      
      _jitsi.addListener('readyToClose', () => {
        endCall();
      });
    };
    
    loadJitsiScript();
    
    return () => {
      if (jitsi) {
        jitsi.dispose();
      }
      const script = document.querySelector('script[src="https://meet.jit.si/external_api.js"]');
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, [therapistId, audioEnabled, videoEnabled]);

  // Update Jitsi when audio/video toggles change
  useEffect(() => {
    if (!jitsi) return;
    
    jitsi.executeCommand('toggleAudio');
  }, [audioEnabled, jitsi]);
  
  useEffect(() => {
    if (!jitsi) return;
    
    jitsi.executeCommand('toggleVideo');
  }, [videoEnabled, jitsi]);

  // Start video call
  const startCall = () => {
    setConnecting(true);
    // The actual connection is handled by Jitsi's videoConferenceJoined event
  };

  // End video call
  const endCall = () => {
    if (jitsi) {
      jitsi.executeCommand('hangup');
    }
    setCallActive(false);
    setConnecting(false);
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

  // Toggle screen share
  const toggleScreenShare = () => {
    if (!jitsi) return;
    
    if (screenShareActive) {
      jitsi.executeCommand('stopScreenSharing');
    } else {
      jitsi.executeCommand('startScreenSharing');
    }
    setScreenShareActive(!screenShareActive);
  };

  // Cycle through volume settings
  const cycleVolume = () => {
    setVolume(prev => (prev + 1) % 3);
  };

  // Get volume icon based on current volume
  const getVolumeIcon = () => {
    switch(volume) {
      case 0: return <VolumeX className="h-5 w-5" />;
      case 1: return <Volume1 className="h-5 w-5" />;
      case 2: return <Volume2 className="h-5 w-5" />;
      default: return <Volume2 className="h-5 w-5" />;
    }
  };

  // Network quality indicator
  const getNetworkIndicator = () => {
    const bars = [];
    for (let i = 1; i <= 3; i++) {
      bars.push(
        <div 
          key={i} 
          className={`h-${i+1} w-1 rounded-full ${i <= networkQuality ? 'bg-secondary' : 'bg-gray-300'}`}
        />
      );
    }
    return (
      <div className="flex items-end gap-0.5">
        {bars}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center animation-fade-in">
        <div className="w-full max-w-4xl h-96 flex items-center justify-center">
          <div className="flex flex-col items-center animate-pulse-subtle">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <Video className="h-8 w-8 text-primary/40" />
            </div>
            <p className="text-muted-foreground">Loading video session...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!therapist) {
    return (
      <div className="container mx-auto px-4 py-12 animation-fade-in">
        <div className="bg-card p-8 rounded-xl shadow-sm text-center">
          <h2 className="text-2xl font-bold mb-4">Therapist Not Found</h2>
          <p className="text-muted-foreground mb-6">We couldn't find the therapist you're looking for.</p>
          <Button asChild>
            <Link to="/therapists">Back to Therapist Directory</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animation-fade-in">
      <div className="max-w-5xl mx-auto">
        <Card className="overflow-hidden rounded-xl card-shadow">
          <div className="bg-primary text-white p-4 flex items-center justify-between backdrop-blur-sm">
            <div className="flex items-center">
              <img 
                src={therapist.image} 
                alt={therapist.name}
                className="w-10 h-10 rounded-full object-cover mr-3 border-2 border-white/20"
              />
              <div>
                <h1 className="font-bold">Video Session with {therapist.name}</h1>
                <div className="flex items-center gap-3 text-xs opacity-80">
                  <span className="flex items-center gap-1">
                    <Shield className="h-3 w-3" /> End-to-end encrypted
                  </span>
                  <span className="flex items-center gap-1">
                    {getNetworkIndicator()} {networkQuality === 3 ? 'Excellent' : networkQuality === 2 ? 'Good' : 'Poor'} connection
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {callActive && (
                <div className="bg-primary-foreground/10 px-3 py-1 rounded-full flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  <span className="text-xs">{formatTime(sessionTime)}</span>
                </div>
              )}
              <Button 
                variant="ghost" 
                size="sm"
                className="hover:bg-white/10 text-white"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <CardContent className="p-0">
            <div className="relative bg-gray-950 w-full" style={{ height: '70vh' }}>
              {/* Jitsi container */}
              <div 
                ref={jitsiContainer} 
                className="w-full h-full bg-black"
                style={{ display: callActive ? 'block' : 'none' }}
              />
              
              {/* Pre-call view */}
              {!callActive && (
                <div className="w-full h-full bg-gray-800 flex flex-col items-center justify-center">
                  <div className="bg-gray-700 rounded-full p-6 mb-6">
                    <Video className="h-12 w-12 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">
                    {connecting ? 'Connecting to session...' : 'Ready to join session'}
                  </h2>
                  <p className="text-gray-300 mb-6">
                    {connecting ? 'Please wait while we connect you' : 'Click below to start your therapy session'}
                  </p>
                  {!connecting && (
                    <Button 
                      size="lg" 
                      onClick={startCall}
                      disabled={connecting}
                    >
                      <Video className="h-5 w-5 mr-2" />
                      Start Video Session
                    </Button>
                  )}
                </div>
              )}
              
              {/* Self-view (smaller) */}
              {callActive && (
                <div className="absolute top-4 right-4 w-52 h-40 bg-gray-800 rounded-lg overflow-hidden border border-primary/50 shadow-lg">
                  {videoEnabled ? (
                    <div className="bg-gray-700 w-full h-full flex items-center justify-center text-white">
                      {/* Self-view would be handled by Jitsi */}
                      <Video className="h-10 w-10 opacity-50" />
                    </div>
                  ) : (
                    <div className="bg-gray-800 w-full h-full flex items-center justify-center text-white">
                      <VideoOff className="h-10 w-10 opacity-50" />
                    </div>
                  )}
                </div>
              )}
              
              {/* Control bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant={audioEnabled ? "outline" : "destructive"}
                    size="icon"
                    className={audioEnabled ? "bg-white/10 hover:bg-white/20 border-white/30 text-white" : ""}
                    onClick={toggleAudio}
                  >
                    {audioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                  </Button>
                  
                  <Button
                    variant={videoEnabled ? "outline" : "destructive"}
                    size="icon"
                    className={videoEnabled ? "bg-white/10 hover:bg-white/20 border-white/30 text-white" : ""}
                    onClick={toggleVideo}
                  >
                    {videoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-white/10 hover:bg-white/20 border-white/30 text-white"
                    onClick={toggleScreenShare}
                  >
                    <ScreenShare className={`h-5 w-5 ${screenShareActive ? 'text-primary' : ''}`} />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-white/10 hover:bg-white/20 border-white/30 text-white"
                    onClick={cycleVolume}
                  >
                    {getVolumeIcon()}
                  </Button>
                  
                  {callActive && (
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={endCall}
                    >
                      <Phone className="h-5 w-5 rotate-225" />
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
                  
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-white/10 hover:bg-white/20 border-white/30 text-white"
                  >
                    <UserPlus className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              {/* Help button */}
              <div className="absolute top-4 left-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/10 hover:bg-white/20 border-white/30 text-white text-xs"
                >
                  <HelpCircle className="h-3 w-3 mr-1" /> Help
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-6 bg-card p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold mb-4">Session Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-5 w-5 text-primary" />
                <span>50-minute session</span>
              </p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-5 w-5 text-primary" />
                <span>May 15, 2025 • 2:00 PM</span>
              </p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <Shield className="h-5 w-5 text-primary" />
                <span>End-to-end encrypted, HIPAA compliant</span>
              </p>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>
                After your session, you can continue the conversation through secure messaging or schedule a follow-up appointment.
              </p>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-border flex flex-wrap gap-3">
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

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Monitor, 
  Users,
  Settings,
  Minimize2,
  Maximize2,
  MessageCircle
} from 'lucide-react';

export default function VideoCallInterface({ 
  contact, 
  isIncoming = false, 
  onAccept, 
  onDecline, 
  onEnd,
  isMinimized = false,
  onToggleMinimize 
}) {
  const [callState, setCallState] = useState(isIncoming ? 'incoming' : 'connecting');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [participants, setParticipants] = useState([contact]);

  useEffect(() => {
    let interval;
    if (callState === 'connected') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAccept = () => {
    setCallState('connected');
    if (onAccept) onAccept();
    toast({
      title: "Call Connected",
      description: `Video call with ${contact.username} started`
    });
  };

  const handleDecline = () => {
    if (onDecline) onDecline();
    toast({
      title: "Call Declined",
      description: "Video call was declined"
    });
  };

  const handleEnd = () => {
    setCallState('ended');
    if (onEnd) onEnd();
    toast({
      title: "Call Ended",
      description: `Call duration: ${formatDuration(callDuration)}`
    });
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    toast({
      title: isMuted ? "Microphone On" : "Microphone Off",
      description: `Your microphone is now ${isMuted ? 'unmuted' : 'muted'}`
    });
  };

  const handleToggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    toast({
      title: isVideoOff ? "Camera On" : "Camera Off",
      description: `Your camera is now ${isVideoOff ? 'on' : 'off'}`
    });
  };

  const handleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    toast({
      title: isScreenSharing ? "Screen Share Stopped" : "Screen Share Started",
      description: isScreenSharing ? "You stopped sharing your screen" : "You are now sharing your screen"
    });
  };

  const handleAddParticipant = () => {
    toast({
      title: "🚧 Add Participants",
      description: "Adding participants isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  // Incoming call interface
  if (callState === 'incoming') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
      >
        <div className="text-center text-white">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center text-6xl mx-auto mb-6"
          >
            {contact.avatar}
          </motion.div>
          <h2 className="text-2xl font-semibold mb-2">{contact.username}</h2>
          <p className="text-gray-300 mb-8">Incoming video call...</p>
          
          <div className="flex items-center justify-center gap-8">
            <Button
              variant="destructive"
              size="icon"
              className="w-16 h-16 rounded-full"
              onClick={handleDecline}
            >
              <PhoneOff className="w-6 h-6" />
            </Button>
            <Button
              variant="default"
              size="icon"
              className="w-16 h-16 rounded-full bg-green-600 hover:bg-green-700"
              onClick={handleAccept}
            >
              <Video className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Minimized call interface
  if (isMinimized) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg min-w-[200px]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm">
                {contact.avatar}
              </div>
              <div>
                <p className="text-sm font-medium">{contact.username}</p>
                <p className="text-xs text-muted-foreground">{formatDuration(callDuration)}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6"
              onClick={onToggleMinimize}
            >
              <Maximize2 className="w-3 h-3" />
            </Button>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant={isMuted ? "destructive" : "secondary"}
              size="icon"
              className="w-8 h-8"
              onClick={handleToggleMute}
            >
              {isMuted ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
            </Button>
            <Button
              variant={isVideoOff ? "destructive" : "secondary"}
              size="icon"
              className="w-8 h-8"
              onClick={handleToggleVideo}
            >
              {isVideoOff ? <VideoOff className="w-3 h-3" /> : <Video className="w-3 h-3" />}
            </Button>
            <Button
              variant="destructive"
              size="icon"
              className="w-8 h-8"
              onClick={handleEnd}
            >
              <PhoneOff className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Full call interface
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50"
    >
      {/* Main video area */}
      <div className="w-full h-full relative">
        <div className="w-full h-full bg-gray-900 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center text-6xl mx-auto mb-4">
              {contact.avatar}
            </div>
            <h3 className="text-2xl font-semibold mb-2">{contact.username}</h3>
            <p className="text-gray-300">
              {callState === 'connecting' ? 'Connecting...' : 'Connected'}
            </p>
          </div>
        </div>

        {/* Self video (Picture-in-Picture) */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg border-2 border-white/20 overflow-hidden"
        >
          <div className="w-full h-full flex items-center justify-center text-white">
            {isVideoOff ? (
              <div className="text-center">
                <VideoOff className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Camera Off</p>
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl">
                👤
              </div>
            )}
          </div>
        </motion.div>

        {/* Call info */}
        <div className="absolute top-4 left-4 text-white">
          <div className="bg-black/50 backdrop-blur-lg rounded-lg p-3">
            <p className="text-sm font-medium">Video Call</p>
            <p className="text-xs text-gray-300">{formatDuration(callDuration)}</p>
            {participants.length > 1 && (
              <p className="text-xs text-gray-300">{participants.length} participants</p>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-black/50 backdrop-blur-lg rounded-full p-4 flex items-center gap-4"
          >
            <Button
              variant={isMuted ? "destructive" : "secondary"}
              size="icon"
              className="w-12 h-12 rounded-full"
              onClick={handleToggleMute}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </Button>

            <Button
              variant={isVideoOff ? "destructive" : "secondary"}
              size="icon"
              className="w-12 h-12 rounded-full"
              onClick={handleToggleVideo}
            >
              {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </Button>

            <Button
              variant={isScreenSharing ? "default" : "secondary"}
              size="icon"
              className="w-12 h-12 rounded-full"
              onClick={handleScreenShare}
            >
              <Monitor className="w-5 h-5" />
            </Button>

            <Button
              variant="secondary"
              size="icon"
              className="w-12 h-12 rounded-full"
              onClick={handleAddParticipant}
            >
              <Users className="w-5 h-5" />
            </Button>

            <Button
              variant="secondary"
              size="icon"
              className="w-12 h-12 rounded-full"
              onClick={() => toast({
                title: "🚧 Chat During Call",
                description: "In-call messaging isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
              })}
            >
              <MessageCircle className="w-5 h-5" />
            </Button>

            <Button
              variant="destructive"
              size="icon"
              className="w-12 h-12 rounded-full"
              onClick={handleEnd}
            >
              <PhoneOff className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>

        {/* Minimize button */}
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-4 right-60 w-10 h-10"
          onClick={onToggleMinimize}
        >
          <Minimize2 className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}

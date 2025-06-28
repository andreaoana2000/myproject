import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Speaker,
  Bluetooth,
  Minimize2,
  Maximize2
} from 'lucide-react';

export default function VoiceCallManager({ 
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
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [connectionQuality, setConnectionQuality] = useState('excellent');
  
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (callState === 'connected') {
      intervalRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
        // Simulate audio level changes
        setAudioLevel(Math.random() * 100);
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [callState]);

  useEffect(() => {
    // Simulate connection quality changes
    const qualityInterval = setInterval(() => {
      const qualities = ['excellent', 'good', 'fair', 'poor'];
      setConnectionQuality(qualities[Math.floor(Math.random() * qualities.length)]);
    }, 10000);

    return () => clearInterval(qualityInterval);
  }, []);

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
      description: `Voice call with ${contact.username} started`
    });
  };

  const handleDecline = () => {
    if (onDecline) onDecline();
    toast({
      title: "Call Declined",
      description: "Voice call was declined"
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

  const handleToggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
    toast({
      title: isSpeakerOn ? "Speaker Off" : "Speaker On",
      description: `Speaker is now ${isSpeakerOn ? 'off' : 'on'}`
    });
  };

  const getConnectionColor = () => {
    switch (connectionQuality) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-blue-500';
      case 'fair': return 'text-yellow-500';
      case 'poor': return 'text-red-500';
      default: return 'text-gray-500';
    }
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
            className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center text-6xl mx-auto mb-6 border-4 border-primary/30"
          >
            {contact.avatar}
          </motion.div>
          
          <h2 className="text-2xl font-semibold mb-2">{contact.username}</h2>
          <p className="text-gray-300 mb-2">Incoming voice call...</p>
          
          {/* Audio level indicator */}
          <div className="flex justify-center gap-1 mb-8">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-primary rounded-full"
                animate={{ height: [4, Math.random() * 20 + 4, 4] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
          </div>
          
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
              <Phone className="w-6 h-6" />
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
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg min-w-[220px]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm">
                {contact.avatar}
              </div>
              <div>
                <p className="text-sm font-medium">{contact.username}</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">{formatDuration(callDuration)}</p>
                  <div className={`w-2 h-2 rounded-full ${getConnectionColor()}`} />
                </div>
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
              variant={isSpeakerOn ? "default" : "secondary"}
              size="icon"
              className="w-8 h-8"
              onClick={handleToggleSpeaker}
            >
              {isSpeakerOn ? <Volume2 className="w-3 h-3" /> : <Speaker className="w-3 h-3" />}
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
      className="fixed inset-0 bg-gradient-to-br from-primary/20 to-background z-50"
    >
      <div className="w-full h-full relative flex flex-col items-center justify-center">
        {/* Connection quality indicator */}
        <div className="absolute top-4 left-4">
          <div className="bg-black/20 backdrop-blur-lg rounded-lg p-3">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getConnectionColor()}`} />
              <span className="text-sm font-medium capitalize">{connectionQuality}</span>
            </div>
          </div>
        </div>

        {/* Call duration */}
        <div className="absolute top-4 right-4">
          <div className="bg-black/20 backdrop-blur-lg rounded-lg p-3">
            <p className="text-sm font-medium">{formatDuration(callDuration)}</p>
          </div>
        </div>

        {/* Contact info */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center text-6xl mx-auto mb-6 border-4 border-primary/30"
          >
            {contact.avatar}
          </motion.div>
          
          <h2 className="text-2xl font-semibold mb-2">{contact.username}</h2>
          <p className="text-muted-foreground">
            {callState === 'connecting' ? 'Connecting...' : 'Connected'}
          </p>
        </div>

        {/* Audio level visualization */}
        <div className="flex justify-center gap-1 mb-8">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 bg-primary rounded-full"
              animate={{ 
                height: isMuted ? 4 : [4, (audioLevel / 10) * (i + 1) + 4, 4] 
              }}
              transition={{ 
                duration: 0.3, 
                repeat: Infinity, 
                delay: i * 0.05 
              }}
            />
          ))}
        </div>

        {/* Call controls */}
        <div className="flex items-center gap-6">
          <Button
            variant={isMuted ? "destructive" : "secondary"}
            size="icon"
            className="w-14 h-14 rounded-full"
            onClick={handleToggleMute}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </Button>

          <Button
            variant={isSpeakerOn ? "default" : "secondary"}
            size="icon"
            className="w-14 h-14 rounded-full"
            onClick={handleToggleSpeaker}
          >
            {isSpeakerOn ? <Volume2 className="w-6 h-6" /> : <Speaker className="w-6 h-6" />}
          </Button>

          <Button
            variant="secondary"
            size="icon"
            className="w-14 h-14 rounded-full"
            onClick={() => toast({
              title: "🚧 Bluetooth",
              description: "Bluetooth audio switching isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
            })}
          >
            <Bluetooth className="w-6 h-6" />
          </Button>

          <Button
            variant="destructive"
            size="icon"
            className="w-16 h-16 rounded-full"
            onClick={handleEnd}
          >
            <PhoneOff className="w-6 h-6" />
          </Button>
        </div>

        {/* Minimize button */}
        <Button
          variant="secondary"
          size="icon"
          className="absolute bottom-4 right-4 w-12 h-12 rounded-full"
          onClick={onToggleMinimize}
        >
          <Minimize2 className="w-5 h-5" />
        </Button>
      </div>
    </motion.div>
  );
}
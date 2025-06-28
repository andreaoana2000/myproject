
import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  Minimize2
} from 'lucide-react';

export default function VideoCall({ onClose }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

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
      title: "🚧 Screen Sharing",
      description: "Screen sharing isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  const handleEndCall = () => {
    toast({
      title: "Call Ended",
      description: "Video call has been ended"
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
    >
      <div className="w-full h-full relative">
        {/* Main Video Area */}
        <div className="w-full h-full bg-gray-900 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center text-6xl mx-auto mb-4">
              👩‍💼
            </div>
            <h3 className="text-2xl font-semibold mb-2">Alice Cooper</h3>
            <p className="text-gray-300">Connected</p>
          </div>
        </div>

        {/* Self Video (Picture-in-Picture) */}
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

        {/* Call Controls */}
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
              variant="secondary"
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
              onClick={() => toast({
                title: "🚧 Add Participants",
                description: "Adding participants isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
              })}
            >
              <Users className="w-5 h-5" />
            </Button>

            <Button
              variant="secondary"
              size="icon"
              className="w-12 h-12 rounded-full"
              onClick={() => toast({
                title: "🚧 Call Settings",
                description: "Call settings aren't implemented yet—but don't worry! You can request them in your next prompt! 🚀"
              })}
            >
              <Settings className="w-5 h-5" />
            </Button>

            <Button
              variant="destructive"
              size="icon"
              className="w-12 h-12 rounded-full"
              onClick={handleEndCall}
            >
              <PhoneOff className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>

        {/* Call Info */}
        <div className="absolute top-4 left-4 text-white">
          <div className="bg-black/50 backdrop-blur-lg rounded-lg p-3">
            <p className="text-sm font-medium">Video Call</p>
            <p className="text-xs text-gray-300">00:02:34</p>
          </div>
        </div>

        {/* Minimize Button */}
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-4 right-60 w-10 h-10"
          onClick={() => toast({
            title: "🚧 Minimize Call",
            description: "Call minimization isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
          })}
        >
          <Minimize2 className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { X, Heart, MessageCircle, Share, Eye, Clock, Send } from 'lucide-react';

export default function PhotoStatusViewer({ status, isOpen, onClose, onReact, onReply }) {
  const [showReactions, setShowReactions] = useState(false);
  const [hasReacted, setHasReacted] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');

  const reactions = ['❤️', '😂', '😮', '😢', '😡', '👍'];

  const getFilterStyle = () => {
    if (!status.filter || status.filter === 'none') return {};
    
    const filterMap = {
      sepia: 'sepia(100%)',
      grayscale: 'grayscale(100%)',
      blur: 'blur(1px)',
      brightness: 'brightness(120%)',
      contrast: 'contrast(120%)'
    };
    
    return { filter: filterMap[status.filter] || 'none' };
  };

  const handleReaction = (emoji) => {
    setHasReacted(!hasReacted);
    setShowReactions(false);
    if (onReact) {
      onReact(status.id, emoji);
    }
  };

  const handleReply = () => {
    if (showReplyInput && replyText.trim()) {
      if (onReply) {
        onReply(status, replyText.trim());
      }
      setReplyText('');
      setShowReplyInput(false);
    } else {
      setShowReplyInput(true);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${status.username}'s Status`,
        text: status.content || 'Check out this photo status!',
        url: window.location.href
      }).then(() => {
        toast({
          title: "Status Shared! 📤",
          description: "Photo status has been shared successfully"
        });
      }).catch(() => {
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied! 📋",
          description: "Status link copied to clipboard"
        });
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied! 📋",
        description: "Status link copied to clipboard"
      });
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  if (!isOpen || !status) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
    >
      {/* Status Content */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Background Image */}
        <div className="relative w-full max-w-md h-full max-h-[80vh] bg-black rounded-lg overflow-hidden">
          <img
            src={status.photoUrl}
            alt="Status"
            className="w-full h-full object-cover"
            style={getFilterStyle()}
          />
          
          {/* Text Overlay */}
          {status.content && (
            <div
              className={`absolute ${status.fontSize} font-bold text-center pointer-events-none`}
              style={{
                color: status.textColor,
                left: `${status.textPosition?.x || 50}%`,
                top: `${status.textPosition?.y || 50}%`,
                transform: 'translate(-50%, -50%)',
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
              }}
            >
              {status.content}
            </div>
          )}

          {/* Header */}
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent p-4 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-lg">
                  {status.avatar || '👤'}
                </div>
                <div>
                  <h3 className="text-white font-semibold">{status.username || 'You'}</h3>
                  <p className="text-white/80 text-sm">{formatTimeAgo(status.timestamp)}</p>
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose} 
                className="text-white hover:bg-white/20 z-20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Bottom Actions - CRITICAL FIX: Proper z-index and pointer events */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-4 z-20">
            {/* Reply Input */}
            <AnimatePresence>
              {showReplyInput && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="mb-4 flex gap-2 z-30"
                  style={{ pointerEvents: 'auto' }}
                >
                  <Input
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                    className="flex-1 bg-black/40 border-white/20 text-white placeholder:text-white/60"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleReply();
                      }
                    }}
                    autoFocus
                  />
                  <Button
                    onClick={handleReply}
                    disabled={!replyText.trim()}
                    className="bg-primary hover:bg-primary/90"
                    style={{ pointerEvents: 'auto' }}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons - FIXED: Proper pointer events and z-index */}
            <div 
              className="flex items-center justify-between z-30" 
              style={{ pointerEvents: 'auto' }}
            >
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReactions(!showReactions)}
                  className={`text-white hover:bg-white/20 transition-all duration-200 ${hasReacted ? 'text-red-400' : ''}`}
                  style={{ pointerEvents: 'auto' }}
                >
                  <Heart className={`w-5 h-5 mr-1 ${hasReacted ? 'fill-current' : ''}`} />
                  {hasReacted ? 'Liked' : 'Like'}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReply}
                  className="text-white hover:bg-white/20 transition-all duration-200"
                  style={{ pointerEvents: 'auto' }}
                >
                  <MessageCircle className="w-5 h-5 mr-1" />
                  Reply
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="text-white hover:bg-white/20 transition-all duration-200"
                  style={{ pointerEvents: 'auto' }}
                >
                  <Share className="w-5 h-5 mr-1" />
                  Share
                </Button>
              </div>

              <div className="flex items-center gap-2 text-white/80 text-sm">
                <Eye className="w-4 h-4" />
                <span>{status.views || 0}</span>
              </div>
            </div>

            {/* Reactions - FIXED: Proper z-index and pointer events */}
            <AnimatePresence>
              {showReactions && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="flex items-center gap-2 mt-3 bg-black/60 rounded-full p-2 z-40"
                  style={{ pointerEvents: 'auto' }}
                >
                  {reactions.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleReaction(emoji)}
                      className="text-2xl hover:scale-125 transition-transform p-1 rounded-full hover:bg-white/10"
                      style={{ 
                        pointerEvents: 'auto',
                        fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Twemoji Mozilla", "EmojiOne Color", "Android Emoji", sans-serif',
                        fontVariantEmoji: 'emoji',
                        textRendering: 'optimizeQuality'
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Progress Bar */}
          <div className="absolute top-16 left-4 right-4 z-10">
            <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 5, ease: 'linear' }}
                className="h-full bg-white rounded-full"
                onAnimationComplete={onClose}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
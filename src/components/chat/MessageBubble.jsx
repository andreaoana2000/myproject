import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';
import VoicePlayer from '@/components/chat/VoicePlayer';
import StyledMessageRenderer from '@/components/chat/StyledMessageRenderer';
import ImageViewer from '@/components/chat/ImageViewer';
import { 
  Reply, 
  MoreHorizontal, 
  Download, 
  Play, 
  Pause,
  MapPin,
  File,
  Image as ImageIcon,
  Video,
  Pin,
  Heart,
  ThumbsUp,
  Laugh,
  Copy,
  Edit,
  Trash2,
  Check,
  X
} from 'lucide-react';

export default function MessageBubble({ 
  message, 
  isOwn, 
  contact, 
  previousMessage, 
  onReply, 
  onReact, 
  onPin, 
  onDelete,
  onShowOptions,
  showPin = false 
}) {
  const { markMessageAsRead, deleteMessage, editMessage } = useChat();
  const { user } = useAuth();
  const [showActions, setShowActions] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [showReactions, setShowReactions] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message?.content || '');

  // Safety checks
  if (!message || !user) {
    return null;
  }

  const isFirstInGroup = !previousMessage || 
    previousMessage.senderId !== message.senderId ||
    new Date(message.timestamp) - new Date(previousMessage.timestamp) > 300000;

  useEffect(() => {
    if (!message.read && !isOwn && markMessageAsRead) {
      markMessageAsRead(message.chatId, message.id);
    }
  }, [message, isOwn, markMessageAsRead]);

  useEffect(() => {
    if (message.autoDelete && !message.read && !isOwn) {
      const timer = setTimeout(() => {
        setTimeLeft(Math.ceil(message.deleteTimer / 1000));
        const countdown = setInterval(() => {
          setTimeLeft(prev => {
            if (prev <= 1) {
              clearInterval(countdown);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [message, isOwn]);

  const formatTime = (timestamp) => {
    try {
      return new Date(timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (error) {
      return 'Invalid time';
    }
  };

  const handleReply = () => {
    if (onReply) {
      onReply(message);
    }
  };

  const handlePin = () => {
    if (onPin) {
      onPin(message.id);
    }
  };

  // CRITICAL FIX: Proper emoji handling without conversion
  const handleReaction = (emoji) => {
    console.log('Reacting with emoji:', emoji, 'Type:', typeof emoji, 'Code:', emoji.charCodeAt ? emoji.charCodeAt(0) : 'N/A');
    
    if (onReact && emoji) {
      onReact(message.id, emoji);
    }
    setShowReactions(false);
  };

  const handleCopy = () => {
    if (message.content) {
      navigator.clipboard.writeText(message.content);
      toast({
        title: "Message Copied",
        description: "Message content copied to clipboard"
      });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(message.content || '');
  };

  const handleSaveEdit = () => {
    if (editContent.trim() && editContent !== message.content && editMessage) {
      editMessage(message.chatId, message.id, editContent.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(message.content || '');
  };

  const handleDelete = () => {
    // Use the onDelete prop if provided (for channels), otherwise use context method
    if (onDelete) {
      onDelete(message.id);
    } else if (deleteMessage) {
      deleteMessage(message.chatId, message.id);
      toast({
        title: "Message Deleted",
        description: "Message has been deleted"
      });
    }
  };

  const handleDownload = () => {
    if (message.metadata?.previewUrl) {
      const link = document.createElement('a');
      link.href = message.metadata.previewUrl;
      link.download = message.metadata.fileName || 'download';
      link.click();
    } else {
      toast({
        title: "Download Started",
        description: "File download has been initiated"
      });
    }
  };

  // CRITICAL FIX: Use actual Unicode emoji characters
  const quickReactions = [
    '\u2764\uFE0F', // ❤️ Red Heart
    '\uD83D\uDC4D', // 👍 Thumbs Up
    '\uD83D\uDE02', // 😂 Face with Tears of Joy
    '\uD83D\uDE2E', // 😮 Face with Open Mouth
    '\uD83D\uDE22', // 😢 Crying Face
    '\uD83D\uDE21'  // 😡 Pouting Face
  ];

  // CRITICAL FIX: Enhanced emoji rendering function
  const renderEmoji = (emoji) => {
    // Return the emoji exactly as provided
    if (!emoji) {
      return '\uD83D\uDC4D'; // 👍 fallback
    }
    
    // If it's a number or invalid, return fallback
    if (typeof emoji === 'number' || /^\d+$/.test(String(emoji))) {
      return '\uD83D\uDC4D'; // 👍 fallback
    }
    
    return String(emoji);
  };

  const renderMessageContent = () => {
    if (isEditing && message.type === 'text') {
      return (
        <div className="space-y-2">
          <Input
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSaveEdit();
              } else if (e.key === 'Escape') {
                handleCancelEdit();
              }
            }}
            className="bg-background/50"
            autoFocus
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSaveEdit}>
              <Check className="w-3 h-3 mr-1" />
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancelEdit}>
              <X className="w-3 h-3 mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      );
    }

    switch (message.type) {
      case 'voice':
        return (
          <VoicePlayer
            audioUrl={message.metadata?.audioUrl}
            duration={message.metadata?.duration || '0:05'}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        );

      case 'file':
        return (
          <div className="flex items-center gap-3 min-w-[200px] p-3 bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg border">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/30 to-primary/10 rounded-lg flex items-center justify-center shadow-lg">
              <File className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">{message.metadata?.fileName || 'File'}</p>
              <p className="text-xs text-muted-foreground font-medium">
                {message.metadata?.fileSize ? `${(message.metadata.fileSize / 1024).toFixed(1)} KB` : 'Unknown size'}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 hover:bg-primary/20"
              onClick={handleDownload}
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        );

      case 'location':
        return (
          <div className="min-w-[250px] p-3 bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">Location</span>
            </div>
            <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
              <p className="text-sm font-medium">{message.metadata?.address || 'Shared Location'}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Lat: {message.metadata?.latitude?.toFixed(6)}, 
                Lng: {message.metadata?.longitude?.toFixed(6)}
              </p>
            </div>
          </div>
        );

      case 'reply':
        return (
          <div className="space-y-3">
            <div className="bg-muted/50 border-l-4 border-primary pl-3 py-2 rounded-r-lg">
              <p className="text-xs text-muted-foreground mb-1 font-medium">Replying to:</p>
              <p className="text-sm opacity-80">{message.metadata?.originalMessage}</p>
            </div>
            <StyledMessageRenderer content={message.content} />
          </div>
        );

      case 'image':
        return (
          <div className="max-w-[300px]">
            {message.metadata?.previewUrl ? (
              <div 
                className="rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-all duration-200 shadow-lg border"
                onClick={() => setShowImageViewer(true)}
              >
                <img 
                  src={message.metadata.previewUrl} 
                  alt="Shared image"
                  className="w-full h-auto max-h-64 object-cover"
                />
              </div>
            ) : (
              <div className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg p-6 flex items-center justify-center border">
                <ImageIcon className="w-16 h-16 text-primary opacity-50" />
              </div>
            )}
            {message.content && (
              <div className="mt-3">
                <StyledMessageRenderer content={message.content} />
              </div>
            )}
          </div>
        );

      case 'video':
        return (
          <div className="max-w-[300px]">
            {message.metadata?.previewUrl ? (
              <div className="rounded-lg overflow-hidden shadow-lg border">
                <video 
                  src={message.metadata.previewUrl}
                  controls
                  className="w-full h-auto max-h-64"
                  preload="metadata"
                >
                  Your browser does not support video playback.
                </video>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg overflow-hidden shadow-lg border">
                <Video className="w-16 h-16 text-primary opacity-50" />
              </div>
            )}
            {message.content && (
              <div className="mt-3">
                <StyledMessageRenderer content={message.content} />
              </div>
            )}
          </div>
        );

      default:
        return <StyledMessageRenderer content={message.content} />;
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
        className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group relative`}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
          {isFirstInGroup && !isOwn && contact && (
            <div className="flex items-center gap-2 mb-2 px-3">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-sm shadow-lg">
                {contact.avatar}
              </div>
              <span className="text-xs font-bold text-muted-foreground">
                {contact.username}
              </span>
            </div>
          )}

          <div
            className={`relative rounded-2xl px-4 py-3 shadow-lg border backdrop-blur-sm ${
              isOwn
                ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-br-md border-primary/20'
                : 'bg-gradient-to-br from-card to-card/80 border-border/50 rounded-bl-md'
            } ${isFirstInGroup ? (isOwn ? 'rounded-tr-2xl' : 'rounded-tl-2xl') : ''}`}
          >
            {renderMessageContent()}

            {/* Message Reactions - CRITICAL FIX: Enhanced emoji rendering */}
            {message.reactions && message.reactions.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {message.reactions.map((reaction, index) => {
                  const displayEmoji = renderEmoji(reaction.emoji);
                  const reactionCount = reaction.count || 1;
                  const isUserReacted = reaction.users && reaction.users.includes(user.id);
                  
                  return (
                    <motion.button
                      key={`reaction-${index}-${reaction.emoji}-${reactionCount}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                        isUserReacted
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'bg-muted/50 text-muted-foreground border border-border/30 hover:bg-muted'
                      }`}
                      onClick={() => handleReaction(reaction.emoji)}
                    >
                      {/* CRITICAL FIX: Direct emoji rendering without conversion */}
                      <span 
                        className="emoji-display"
                        style={{ 
                          fontSize: '14px'
                        }}
                      >
                        {displayEmoji}
                      </span>
                      <span className="text-xs font-bold leading-none">{reactionCount}</span>
                    </motion.button>
                  );
                })}
              </div>
            )}

            <div className={`flex items-center justify-between mt-2 gap-2 text-xs opacity-70`}>
              <div className="flex items-center gap-2">
                <span className="font-medium">{formatTime(message.timestamp)}</span>
                {message.isEdited && (
                  <span className="text-muted-foreground">(edited)</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {timeLeft !== null && (
                  <span className="text-destructive font-bold">
                    Deletes in {timeLeft}s
                  </span>
                )}
                {isOwn && (
                  <span className="font-medium">{message.read ? '✓✓' : '✓'}</span>
                )}
                {message.isPinned && (
                  <Pin className="w-3 h-3 text-yellow-500" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Message Actions */}
        {showActions && !isEditing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`flex items-center gap-1 ${
              isOwn ? 'order-1 mr-2' : 'order-2 ml-2'
            }`}
          >
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="w-7 h-7 opacity-60 hover:opacity-100 hover:bg-primary/20 transition-all duration-200"
                onClick={() => setShowReactions(!showReactions)}
              >
                <Heart className="w-3 h-3" />
              </Button>

              {/* Quick Reactions - CRITICAL FIX: Enhanced emoji rendering */}
              {showReactions && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 10 }}
                  className={`absolute bottom-full mb-2 ${
                    isOwn ? 'right-0' : 'left-0'
                  } bg-card border border-border rounded-lg p-2 shadow-xl backdrop-blur-sm z-20 flex gap-1`}
                >
                  {quickReactions.map((emoji, emojiIndex) => (
                    <Button
                      key={`quick-${emojiIndex}-${emoji}`}
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 hover:bg-primary/20 transition-all duration-200"
                      onClick={() => {
                        console.log('Quick reaction clicked:', emoji);
                        handleReaction(emoji);
                      }}
                    >
                      <span 
                        className="emoji-display"
                        style={{ 
                          fontSize: '16px'
                        }}
                      >
                        {emoji}
                      </span>
                    </Button>
                  ))}
                </motion.div>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="w-7 h-7 opacity-60 hover:opacity-100 hover:bg-primary/20 transition-all duration-200"
              onClick={handleReply}
            >
              <Reply className="w-3 h-3" />
            </Button>
            {message.type === 'text' && (
              <Button
                variant="ghost"
                size="icon"
                className="w-7 h-7 opacity-60 hover:opacity-100 hover:bg-primary/20 transition-all duration-200"
                onClick={handleCopy}
              >
                <Copy className="w-3 h-3" />
              </Button>
            )}
            {showPin && (
              <Button
                variant="ghost"
                size="icon"
                className="w-7 h-7 opacity-60 hover:opacity-100 hover:bg-primary/20 transition-all duration-200"
                onClick={handlePin}
              >
                <Pin className="w-3 h-3" />
              </Button>
            )}
            {isOwn && message.type === 'text' && (
              <Button
                variant="ghost"
                size="icon"
                className="w-7 h-7 opacity-60 hover:opacity-100 hover:bg-primary/20 transition-all duration-200"
                onClick={handleEdit}
              >
                <Edit className="w-3 h-3" />
              </Button>
            )}
            {isOwn && (
              <Button
                variant="ghost"
                size="icon"
                className="w-7 h-7 opacity-60 hover:opacity-100 hover:bg-destructive/20 transition-all duration-200"
                onClick={handleDelete}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
            {/* CRITICAL FIX: Proper menu button with event handling */}
            <Button
              variant="ghost"
              size="icon"
              className="w-7 h-7 opacity-60 hover:opacity-100 hover:bg-primary/20 transition-all duration-200"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onShowOptions) {
                  onShowOptions(message);
                }
              }}
            >
              <MoreHorizontal className="w-3 h-3" />
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* Image Viewer */}
      {message.type === 'image' && message.metadata?.previewUrl && (
        <ImageViewer
          imageUrl={message.metadata.previewUrl}
          isOpen={showImageViewer}
          onClose={() => setShowImageViewer(false)}
        />
      )}
    </>
  );
}
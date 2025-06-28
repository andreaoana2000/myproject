import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { 
  Reply, 
  Forward, 
  Copy, 
  Edit, 
  Trash2, 
  Pin, 
  Star, 
  Download,
  Flag,
  MoreHorizontal,
  Quote,
  Share,
  Bookmark
} from 'lucide-react';

export default function MessageOptionsMenu({ 
  message, 
  isOwn, 
  isOpen, 
  onClose, 
  onReply, 
  onEdit, 
  onDelete, 
  onPin, 
  onStar, 
  onForward,
  onQuote,
  onReport 
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // ✅ Guard clause for safety
  if (!message) return null;

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message?.content || '');
    toast({
      title: "Message Copied! 📋",
      description: "Message content copied to clipboard"
    });
    onClose();
  };

  const handleDownload = () => {
    if (['file', 'image', 'voice'].includes(message?.type)) {
      toast({
        title: "Download Started! 📥",
        description: "File download has been initiated"
      });
    } else {
      toast({
        title: "Nothing to Download",
        description: "This message doesn't contain downloadable content",
        variant: "destructive"
      });
    }
    onClose();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SecureChat Message',
          text: message?.content || '',
          url: window.location.href
        });
        toast({
          title: "Message Shared! 📤",
          description: "Message has been shared successfully"
        });
      } catch (error) {
        // Handle user cancellation or permission denial gracefully
        if (error.name === 'AbortError') {
          // User cancelled the share - no need to show error
          return;
        } else if (error.name === 'NotAllowedError') {
          // Permission denied - fallback to copy
          handleCopyMessage();
          return;
        } else {
          // Other errors - fallback to copy
          console.warn('Share failed:', error);
          handleCopyMessage();
          return;
        }
      }
    } else {
      handleCopyMessage();
    }
    onClose();
  };

  const handleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('securechat-bookmarks') || '[]');
    const bookmark = {
      id: message?.id,
      content: message?.content,
      sender: message?.senderName,
      timestamp: message?.timestamp,
      chatId: message?.chatId
    };
    
    bookmarks.push(bookmark);
    localStorage.setItem('securechat-bookmarks', JSON.stringify(bookmarks));
    
    toast({
      title: "Message Bookmarked! 🔖",
      description: "Message saved to your bookmarks"
    });
    onClose();
  };

  const handleDeleteConfirm = () => {
    onDelete(message?.id);
    toast({
      title: "Message Deleted! 🗑️",
      description: "Message has been deleted"
    });
    setShowDeleteConfirm(false);
    onClose();
  };

  const menuItems = [
    {
      icon: Reply,
      label: 'Reply',
      action: () => { onReply(message); onClose(); },
      show: true
    },
    {
      icon: Quote,
      label: 'Quote',
      action: () => { onQuote(message); onClose(); },
      show: true
    },
    {
      icon: Forward,
      label: 'Forward',
      action: () => { onForward(message); onClose(); },
      show: true
    },
    {
      icon: Copy,
      label: 'Copy Text',
      action: handleCopyMessage,
      show: message?.content && message?.type === 'text'
    },
    {
      icon: Share,
      label: 'Share',
      action: handleShare,
      show: true
    },
    {
      icon: Bookmark,
      label: 'Bookmark',
      action: handleBookmark,
      show: true
    },
    {
      icon: Star,
      label: message?.isStarred ? 'Unstar' : 'Star',
      action: () => { onStar(message?.id); onClose(); },
      show: true
    },
    {
      icon: Pin,
      label: message?.isPinned ? 'Unpin' : 'Pin',
      action: () => { onPin(message?.id); onClose(); },
      show: true
    },
    {
      icon: Download,
      label: 'Download',
      action: handleDownload,
      show: ['file', 'image', 'voice', 'video'].includes(message?.type)
    },
    {
      icon: Edit,
      label: 'Edit',
      action: () => { onEdit(message); onClose(); },
      show: isOwn && message?.type === 'text'
    },
    {
      icon: Trash2,
      label: 'Delete',
      action: () => setShowDeleteConfirm(true),
      show: isOwn,
      destructive: true
    },
    {
      icon: Flag,
      label: 'Report',
      action: () => { onReport(message); onClose(); },
      show: !isOwn,
      destructive: true
    }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-card border border-border rounded-lg shadow-xl min-w-[200px] max-w-sm"
          onClick={(e) => e.stopPropagation()}
        >
          {!showDeleteConfirm ? (
            <>
              {/* Message Preview */}
              <div className="p-3 border-b border-border bg-muted/30">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs">
                    {message?.senderAvatar}
                  </div>
                  <span className="text-sm font-medium">{message?.senderName}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(message?.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                <p className="text-sm text-foreground line-clamp-2">
                  {message?.content || `${message?.type || 'Unknown'} message`}
                </p>
              </div>

              {/* Menu Items */}
              <div className="p-1">
                {menuItems.filter(item => item.show).map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className={`w-full justify-start h-9 ${
                        item.destructive ? 'text-destructive hover:text-destructive' : ''
                      }`}
                      onClick={item.action}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      {item.label}
                    </Button>
                  );
                })}
              </div>
            </>
          ) : (
            /* Delete Confirmation */
            <div className="p-4">
              <div className="text-center mb-4">
                <Trash2 className="w-12 h-12 text-destructive mx-auto mb-2" />
                <h3 className="text-lg font-semibold">Delete Message?</h3>
                <p className="text-sm text-muted-foreground">
                  This action cannot be undone. The message will be permanently deleted.
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={handleDeleteConfirm}
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
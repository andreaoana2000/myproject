import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import StatusCreator from '@/components/status/StatusCreator';
import PhotoStatusCreator from '@/components/status/PhotoStatusCreator';
import StatusViewer from '@/components/status/StatusViewer';
import EnhancedEmojiPicker from '@/components/chat/EnhancedEmojiPicker';
import AdvancedTextStyler from '@/components/chat/AdvancedTextStyler';
import { Plus, Camera, Type, Smile, Eye, Palette, Trash2, MoreVertical } from 'lucide-react';

export default function StatusUpdates() {
  const { user } = useAuth();
  const [statusText, setStatusText] = useState('');
  const [showCreator, setShowCreator] = useState(false);
  const [showPhotoCreator, setShowPhotoCreator] = useState(false);
  const [showStatusViewer, setShowStatusViewer] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [userStatuses, setUserStatuses] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showTextStyler, setShowTextStyler] = useState(false);
  const [showStatusOptions, setShowStatusOptions] = useState(null);
  // NEW: State for status interactions
  const [statusInteractions, setStatusInteractions] = useState({});

  useEffect(() => {
    loadUserStatuses();
    loadStatusInteractions();
  }, []);

  const loadUserStatuses = () => {
    const saved = localStorage.getItem('securechat-statuses');
    if (saved) {
      try {
        const statuses = JSON.parse(saved);
        // Filter out expired statuses and ensure all required properties exist
        const validStatuses = statuses.filter(status => 
          new Date(status.expiresAt) > new Date()
        ).map(status => ({
          ...status,
          views: status.views || 0,
          viewedBy: status.viewedBy || [],
          type: status.type || 'text'
        }));
        setUserStatuses(validStatuses);
        if (validStatuses.length !== statuses.length) {
          localStorage.setItem('securechat-statuses', JSON.stringify(validStatuses));
        }
      } catch (error) {
        console.error('Error loading statuses:', error);
      }
    }
  };

  // NEW: Load status interactions (likes, replies, shares)
  const loadStatusInteractions = () => {
    const saved = localStorage.getItem('securechat-status-interactions');
    if (saved) {
      try {
        setStatusInteractions(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading status interactions:', error);
      }
    }
  };

  const saveUserStatuses = (statuses) => {
    localStorage.setItem('securechat-statuses', JSON.stringify(statuses));
    setUserStatuses(statuses);
  };

  // NEW: Save status interactions
  const saveStatusInteractions = (interactions) => {
    localStorage.setItem('securechat-status-interactions', JSON.stringify(interactions));
    setStatusInteractions(interactions);
  };

  const handleCreateStatus = (statusData) => {
    const newStatus = {
      ...statusData,
      userId: user.id,
      username: user.username,
      avatar: user.avatar,
      views: 0,
      viewedBy: [],
      type: statusData.type || 'text'
    };

    const updatedStatuses = [newStatus, ...userStatuses];
    saveUserStatuses(updatedStatuses);

    toast({
      title: "Status Created! 🎉",
      description: "Your status has been shared and will disappear in 24 hours"
    });
  };

  const handleDeleteStatus = (statusId) => {
    const statusToDelete = userStatuses.find(s => s.id === statusId);
    const updatedStatuses = userStatuses.filter(s => s.id !== statusId);
    saveUserStatuses(updatedStatuses);
    
    // Also remove interactions for this status
    const updatedInteractions = { ...statusInteractions };
    delete updatedInteractions[statusId];
    saveStatusInteractions(updatedInteractions);
    
    setShowStatusOptions(null);
    
    toast({
      title: "Status Deleted! 🗑️",
      description: `Your ${statusToDelete?.type || 'status'} has been deleted`
    });
  };

  const handleQuickStatus = () => {
    if (!statusText.trim()) {
      toast({
        title: "Status Required",
        description: "Please enter some text for your status",
        variant: "destructive"
      });
      return;
    }

    const status = {
      id: Date.now(),
      type: 'text',
      content: statusText,
      backgroundColor: '#1a73e8',
      textColor: '#ffffff',
      fontSize: 'text-lg',
      timestamp: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    handleCreateStatus(status);
    setStatusText('');
  };

  const handleViewStatus = (status) => {
    // Ensure viewedBy is always an array
    const viewedBy = status.viewedBy || [];
    
    // Only increment view count if user hasn't viewed this status before
    if (!viewedBy.includes(user.id)) {
      // For user's own statuses, update the stored data
      if (status.userId === user.id) {
        const updatedStatuses = userStatuses.map(s => {
          if (s.id === status.id) {
            return {
              ...s,
              views: (s.views || 0) + 1,
              viewedBy: [...viewedBy, user.id]
            };
          }
          return s;
        });
        saveUserStatuses(updatedStatuses);
      }
      
      // Update the status object for the viewer
      status.views = (status.views || 0) + 1;
      status.viewedBy = [...viewedBy, user.id];
    }

    setSelectedStatus(status);
    setShowStatusViewer(true);
  };

  const handleEmojiSelect = (emoji) => {
    setStatusText(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleTextStyle = (styleData) => {
    setStatusText(styleData.text);
    setShowTextStyler(false);
  };

  // FIXED: Proper status reply handling with persistence
  const handleStatusReply = (status, replyText) => {
    const statusId = status.id;
    const replyId = `reply-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newReply = {
      id: replyId,
      userId: user.id,
      username: user.username,
      avatar: user.avatar,
      content: replyText,
      timestamp: new Date().toISOString()
    };

    // Update interactions
    const updatedInteractions = {
      ...statusInteractions,
      [statusId]: {
        ...statusInteractions[statusId],
        replies: [
          ...(statusInteractions[statusId]?.replies || []),
          newReply
        ]
      }
    };

    saveStatusInteractions(updatedInteractions);

    toast({
      title: "Reply Sent! 💬",
      description: `Your reply to ${status.username}'s status has been sent`
    });
  };

  // FIXED: Proper status reaction handling with persistence
  const handleStatusReact = (statusId, emoji) => {
    const currentInteractions = statusInteractions[statusId] || {};
    const currentLikes = currentInteractions.likes || [];
    
    // Check if user already liked this status
    const existingLikeIndex = currentLikes.findIndex(like => like.userId === user.id);
    
    let updatedLikes;
    let actionMessage;

    if (existingLikeIndex !== -1) {
      // User already liked, so unlike
      updatedLikes = currentLikes.filter(like => like.userId !== user.id);
      actionMessage = "Reaction removed";
    } else {
      // Add new like
      const newLike = {
        userId: user.id,
        username: user.username,
        avatar: user.avatar,
        emoji: emoji,
        timestamp: new Date().toISOString()
      };
      updatedLikes = [...currentLikes, newLike];
      actionMessage = `Reacted with ${emoji}`;
    }

    // Update interactions
    const updatedInteractions = {
      ...statusInteractions,
      [statusId]: {
        ...currentInteractions,
        likes: updatedLikes
      }
    };

    saveStatusInteractions(updatedInteractions);

    toast({
      title: actionMessage,
      description: "Your reaction has been saved!"
    });
  };

  // FIXED: Proper status share handling with persistence
  const handleStatusShare = (status) => {
    const statusId = status.id;
    const shareId = `share-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newShare = {
      id: shareId,
      userId: user.id,
      username: user.username,
      avatar: user.avatar,
      timestamp: new Date().toISOString()
    };

    // Update interactions
    const updatedInteractions = {
      ...statusInteractions,
      [statusId]: {
        ...statusInteractions[statusId],
        shares: [
          ...(statusInteractions[statusId]?.shares || []),
          newShare
        ]
      }
    };

    saveStatusInteractions(updatedInteractions);

    // Also handle actual sharing
    if (navigator.share) {
      navigator.share({
        title: `${status.username}'s Status`,
        text: status.content || 'Check out this status!',
        url: window.location.href
      }).then(() => {
        toast({
          title: "Status Shared! 📤",
          description: "Status has been shared successfully"
        });
      }).catch(() => {
        // Fallback to copy link
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied! 📋",
          description: "Status link copied to clipboard"
        });
      });
    } else {
      // Fallback to copy link
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied! 📋",
        description: "Status link copied to clipboard"
      });
    }
  };

  // Helper function to get interaction counts for a status
  const getStatusInteractionCounts = (statusId) => {
    const interactions = statusInteractions[statusId] || {};
    return {
      likes: interactions.likes?.length || 0,
      replies: interactions.replies?.length || 0,
      shares: interactions.shares?.length || 0,
      userHasLiked: interactions.likes?.some(like => like.userId === user.id) || false
    };
  };

  const formatTimeRemaining = (expiresAt) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
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

  const demoStatuses = [
    {
      id: 'demo-1',
      userId: 'demo-user-1',
      username: 'Alice Cooper',
      avatar: '👩‍💼',
      type: 'text',
      content: 'Working on something exciting! 🚀',
      backgroundColor: '#1a73e8',
      textColor: '#ffffff',
      fontSize: 'text-lg',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString(),
      views: 12,
      viewedBy: []
    },
    {
      id: 'demo-2',
      userId: 'demo-user-2',
      username: 'Bob Wilson',
      avatar: '👨‍💻',
      type: 'text',
      content: 'Beautiful sunset today 🌅',
      backgroundColor: '#ff5722',
      textColor: '#ffffff',
      fontSize: 'text-xl',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(),
      views: 8,
      viewedBy: []
    },
    {
      id: 'demo-3',
      userId: 'demo-user-3',
      username: 'Carol Smith',
      avatar: '👩‍🎨',
      type: 'text',
      content: 'Just finished a great book! 📚',
      backgroundColor: '#9c27b0',
      textColor: '#ffffff',
      fontSize: 'text-lg',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(),
      views: 15,
      viewedBy: []
    }
  ];

  return (
    <div className="h-full flex flex-col bg-background relative">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-foreground mb-2">Status Updates</h1>
        <p className="text-muted-foreground">Share moments that disappear in 24 hours</p>
      </div>

      {/* Create Status */}
      <div className="p-4 border-b border-border bg-card/50 relative">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-lg">
            {user?.avatar || '👤'}
          </div>
          <div className="flex-1 relative">
            <Input
              placeholder="What's on your mind?"
              value={statusText}
              onChange={(e) => setStatusText(e.target.value)}
              className="border-none bg-transparent text-lg placeholder:text-muted-foreground focus-visible:ring-0"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPhotoCreator(true)}
            >
              <Camera className="w-4 h-4 mr-2" />
              Photo
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTextStyler(true)}
            >
              <Type className="w-4 h-4 mr-2" />
              Style
            </Button>
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <Smile className="w-4 h-4 mr-2" />
                Emoji
              </Button>
              
              {/* FIXED: Proper emoji picker positioning */}
              {showEmojiPicker && (
                <div 
                  className="absolute bottom-full left-0 mb-2 z-[9999]"
                  style={{
                    position: 'absolute',
                    bottom: '100%',
                    left: '0',
                    marginBottom: '8px',
                    zIndex: 9999
                  }}
                >
                  <EnhancedEmojiPicker 
                    onEmojiSelect={handleEmojiSelect}
                    onClose={() => setShowEmojiPicker(false)}
                  />
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCreator(true)}
            >
              <Palette className="w-4 h-4 mr-2" />
              Design
            </Button>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleQuickStatus} disabled={!statusText.trim()}>
              <Plus className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* My Statuses */}
      {userStatuses.length > 0 && (
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">My Status</h3>
          <div className="space-y-3">
            {userStatuses.map((status, index) => {
              const interactionCounts = getStatusInteractionCounts(status.id);
              return (
                <motion.div
                  key={status.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => handleViewStatus(status)}
                >
                  {status.type === 'photo' ? (
                    <div className="w-12 h-12 rounded-lg overflow-hidden">
                      <img 
                        src={status.photoUrl} 
                        alt="Status" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-sm font-medium"
                      style={{ 
                        backgroundColor: status.backgroundColor,
                        color: status.textColor 
                      }}
                    >
                      {status.content.slice(0, 2)}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{status.content || 'Photo Status'}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {status.views} views
                      </span>
                      {interactionCounts.likes > 0 && (
                        <span>❤️ {interactionCounts.likes}</span>
                      )}
                      {interactionCounts.replies > 0 && (
                        <span>💬 {interactionCounts.replies}</span>
                      )}
                      {interactionCounts.shares > 0 && (
                        <span>📤 {interactionCounts.shares}</span>
                      )}
                      <span>Expires in {formatTimeRemaining(status.expiresAt)}</span>
                    </div>
                  </div>
                  
                  {/* Status Options */}
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowStatusOptions(showStatusOptions === status.id ? null : status.id);
                      }}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>

                    {showStatusOptions === status.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg p-1 z-10 min-w-[120px]"
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-destructive"
                          onClick={() => handleDeleteStatus(status.id)}
                        >
                          <Trash2 className="w-3 h-3 mr-2" />
                          Delete
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Status List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Recent Updates</h3>
        {demoStatuses.map((status, index) => {
          const interactionCounts = getStatusInteractionCounts(status.id);
          return (
            <motion.div
              key={status.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer"
              onClick={() => handleViewStatus(status)}
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-xl border-2 border-primary/30">
                  {status.avatar}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-foreground">{status.username}</h3>
                    <span className="text-sm text-muted-foreground">{formatTimeAgo(status.timestamp)}</span>
                  </div>
                  
                  <div className="mb-3">
                    {status.type === 'photo' ? (
                      <div className="w-full h-32 rounded-lg overflow-hidden">
                        <img 
                          src={status.photoUrl} 
                          alt="Status" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div 
                        className="w-full h-24 rounded-lg flex items-center justify-center p-4"
                        style={{ 
                          backgroundColor: status.backgroundColor,
                          color: status.textColor 
                        }}
                      >
                        <p className={`${status.fontSize} font-medium text-center`}>
                          {status.content}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {status.views} views
                      </span>
                      {interactionCounts.likes > 0 && (
                        <span className="flex items-center gap-1">
                          ❤️ {interactionCounts.likes}
                        </span>
                      )}
                      {interactionCounts.replies > 0 && (
                        <span className="flex items-center gap-1">
                          💬 {interactionCounts.replies}
                        </span>
                      )}
                      {interactionCounts.shares > 0 && (
                        <span className="flex items-center gap-1">
                          📤 {interactionCounts.shares}
                        </span>
                      )}
                    </div>
                    <span>Expires in {formatTimeRemaining(status.expiresAt)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Privacy Notice */}
      <div className="p-4 border-t border-border">
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
          <p className="text-sm text-foreground">
            🕐 Status updates automatically disappear after 24 hours
          </p>
        </div>
      </div>

      {/* Status Creator Modal */}
      <StatusCreator
        isOpen={showCreator}
        onClose={() => setShowCreator(false)}
        onCreateStatus={handleCreateStatus}
      />

      {/* Photo Status Creator */}
      <PhotoStatusCreator
        isOpen={showPhotoCreator}
        onClose={() => setShowPhotoCreator(false)}
        onCreateStatus={handleCreateStatus}
      />

      {/* Status Viewer - FIXED: Pass proper handlers */}
      {selectedStatus && (
        <StatusViewer
          status={selectedStatus}
          isOpen={showStatusViewer}
          onClose={() => {
            setShowStatusViewer(false);
            setSelectedStatus(null);
          }}
          onReact={(statusId, emoji) => handleStatusReact(statusId, emoji)}
          onReply={handleStatusReply}
          onShare={handleStatusShare}
        />
      )}

      {/* Text Styler Modal */}
      <AdvancedTextStyler
        isOpen={showTextStyler}
        onClose={() => setShowTextStyler(false)}
        onApplyStyle={handleTextStyle}
        selectedText={statusText}
      />

      {/* Overlay to close emoji picker when clicking outside */}
      {showEmojiPicker && (
        <div 
          className="fixed inset-0 z-[9998]" 
          onClick={() => setShowEmojiPicker(false)}
        />
      )}
    </div>
  );
}
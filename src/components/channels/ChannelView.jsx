import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import MessageBubble from '@/components/chat/MessageBubble';
import FileUpload from '@/components/chat/FileUpload';
import VoiceRecorder from '@/components/chat/VoiceRecorder';
import TypingIndicator from '@/components/chat/TypingIndicator';
import ChannelInput from '@/components/channels/ChannelInput';
import ChannelMembers from '@/components/channels/ChannelMembers';
import ChannelHeader from '@/components/channels/ChannelHeader';
import ChannelInfoPanel from '@/components/channels/ChannelInfoPanel';
import { Pin, ArrowUp, X, Reply, Send, PinOff } from 'lucide-react';

export default function ChannelView({ channel, onBack }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [pinnedMessages, setPinnedMessages] = useState([]);
  const [showMembers, setShowMembers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [channelMuted, setChannelMuted] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [showChannelInfo, setShowChannelInfo] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    loadChannelMessages();
    loadChannelSettings();
    scrollToBottom();
  }, [channel.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle scroll to show/hide scroll-to-top button
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollToTop(!isNearBottom && scrollTop > 200);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const loadChannelMessages = () => {
    const saved = localStorage.getItem(`channel-messages-${channel.id}`);
    if (saved) {
      try {
        const loadedMessages = JSON.parse(saved);
        setMessages(loadedMessages);
        setPinnedMessages(loadedMessages.filter(msg => msg.isPinned));
      } catch (error) {
        console.error('Error loading channel messages:', error);
      }
    } else {
      // Create more demo messages to test scrolling and replies
      const demoMessages = [
        {
          id: 1,
          senderId: 'demo-user-1',
          senderName: 'Alex Chen',
          senderAvatar: '👨‍💻',
          content: `Welcome to #${channel.name}! 🎉`,
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          type: 'text',
          isPinned: true
        },
        {
          id: 2,
          senderId: 'demo-user-2',
          senderName: 'Sarah Wilson',
          senderAvatar: '👩‍🎨',
          content: 'Great to have everyone here! Looking forward to amazing discussions.',
          timestamp: new Date(Date.now() - 6600000).toISOString(),
          type: 'text'
        },
        {
          id: 3,
          senderId: 'demo-user-3',
          senderName: 'Mike Johnson',
          senderAvatar: '🧑‍🚀',
          content: 'This channel is going to be awesome! 🚀',
          timestamp: new Date(Date.now() - 6000000).toISOString(),
          type: 'text',
          reactions: [
            { emoji: '🚀', users: ['demo-user-1', 'demo-user-2'], count: 2 },
            { emoji: '👍', users: ['demo-user-1'], count: 1 }
          ]
        },
        {
          id: 4,
          senderId: 'demo-user-2',
          senderName: 'Sarah Wilson',
          senderAvatar: '👩‍🎨',
          content: 'I totally agree! The possibilities are endless.',
          timestamp: new Date(Date.now() - 5900000).toISOString(),
          type: 'reply',
          replyTo: {
            id: 3,
            senderName: 'Mike Johnson',
            content: 'This channel is going to be awesome! 🚀'
          }
        },
        {
          id: 5,
          senderId: 'demo-user-4',
          senderName: 'Emma Davis',
          senderAvatar: '👩‍💼',
          content: 'Has anyone tried the new features yet? They look incredible!',
          timestamp: new Date(Date.now() - 5400000).toISOString(),
          type: 'text'
        },
        {
          id: 6,
          senderId: 'demo-user-5',
          senderName: 'James Brown',
          senderAvatar: '👨‍🔬',
          content: 'I\'ve been testing them all week. The performance improvements are amazing! 📈',
          timestamp: new Date(Date.now() - 4800000).toISOString(),
          type: 'reply',
          replyTo: {
            id: 5,
            senderName: 'Emma Davis',
            content: 'Has anyone tried the new features yet? They look incredible!'
          },
          reactions: [
            { emoji: '📈', users: ['demo-user-1', 'demo-user-3'], count: 2 }
          ]
        },
        {
          id: 7,
          senderId: 'demo-user-6',
          senderName: 'Lisa Wang',
          senderAvatar: '👩‍🔬',
          content: 'The documentation is really well written too. Makes it easy to get started.',
          timestamp: new Date(Date.now() - 4200000).toISOString(),
          type: 'text'
        },
        {
          id: 8,
          senderId: 'demo-user-1',
          senderName: 'Alex Chen',
          senderAvatar: '👨‍💻',
          content: 'Thanks everyone! We put a lot of effort into making everything user-friendly.',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          type: 'reply',
          replyTo: {
            id: 7,
            senderName: 'Lisa Wang',
            content: 'The documentation is really well written too. Makes it easy to get started.'
          }
        },
        {
          id: 9,
          senderId: 'demo-user-7',
          senderName: 'David Kim',
          senderAvatar: '👨‍🎨',
          content: 'The UI design is absolutely beautiful. Clean and modern! ✨',
          timestamp: new Date(Date.now() - 3000000).toISOString(),
          type: 'text',
          reactions: [
            { emoji: '✨', users: ['demo-user-2', 'demo-user-4'], count: 2 }
          ]
        },
        {
          id: 10,
          senderId: 'demo-user-8',
          senderName: 'Rachel Green',
          senderAvatar: '👩‍🚀',
          content: 'I love how responsive everything is. Works perfectly on mobile too! 📱',
          timestamp: new Date(Date.now() - 2400000).toISOString(),
          type: 'text'
        },
        {
          id: 11,
          senderId: 'demo-user-9',
          senderName: 'Tom Wilson',
          senderAvatar: '👨‍🏫',
          content: 'The security features are top-notch. End-to-end encryption gives me peace of mind. 🔒',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          type: 'text',
          reactions: [
            { emoji: '🔒', users: ['demo-user-1', 'demo-user-5', 'demo-user-7'], count: 3 }
          ]
        },
        {
          id: 12,
          senderId: 'demo-user-10',
          senderName: 'Anna Martinez',
          senderAvatar: '👩‍💻',
          content: 'Absolutely! Privacy should always be the top priority.',
          timestamp: new Date(Date.now() - 1700000).toISOString(),
          type: 'reply',
          replyTo: {
            id: 11,
            senderName: 'Tom Wilson',
            content: 'The security features are top-notch. End-to-end encryption gives me peace of mind. 🔒'
          }
        },
        {
          id: 13,
          senderId: 'demo-user-11',
          senderName: 'Chris Taylor',
          senderAvatar: '👨‍⚕️',
          content: 'The auto-delete feature is brilliant for sensitive conversations. Privacy first! 🛡️',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          type: 'text',
          reactions: [
            { emoji: '🛡️', users: ['demo-user-3', 'demo-user-9'], count: 2 }
          ]
        },
        {
          id: 14,
          senderId: 'demo-user-12',
          senderName: 'Maya Patel',
          senderAvatar: '👩‍🔬',
          content: 'I\'m impressed by how fast everything loads. Great optimization work! ⚡',
          timestamp: new Date(Date.now() - 180000).toISOString(),
          type: 'text'
        },
        {
          id: 15,
          senderId: 'demo-user-13',
          senderName: 'Kevin Lee',
          senderAvatar: '👨‍💼',
          content: 'The channel system makes organizing conversations so much easier. Love it! 📋',
          timestamp: new Date(Date.now() - 120000).toISOString(),
          type: 'text'
        },
        {
          id: 16,
          senderId: 'demo-user-14',
          senderName: 'Sophie Chen',
          senderAvatar: '👩‍🎓',
          content: 'Status updates are a nice touch. Keeps everyone connected! 💫',
          timestamp: new Date(Date.now() - 60000).toISOString(),
          type: 'text',
          reactions: [
            { emoji: '💫', users: ['demo-user-6', 'demo-user-8'], count: 2 }
          ]
        },
        {
          id: 17,
          senderId: 'demo-user-15',
          senderName: 'Ryan Murphy',
          senderAvatar: '👨‍🎤',
          content: 'Can\'t wait to see what new features are coming next! This is just the beginning. 🌟',
          timestamp: new Date(Date.now() - 30000).toISOString(),
          type: 'text'
        }
      ];
      setMessages(demoMessages);
      setPinnedMessages(demoMessages.filter(msg => msg.isPinned));
    }
  };

  const loadChannelSettings = () => {
    const saved = localStorage.getItem(`channel-settings-${channel.id}`);
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        setNotifications(settings.notifications ?? true);
        setChannelMuted(settings.muted ?? false);
      } catch (error) {
        console.error('Error loading channel settings:', error);
      }
    }
  };

  const saveChannelMessages = (updatedMessages) => {
    localStorage.setItem(`channel-messages-${channel.id}`, JSON.stringify(updatedMessages));
  };

  const saveChannelSettings = (settings) => {
    localStorage.setItem(`channel-settings-${channel.id}`, JSON.stringify(settings));
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const applyTextStyle = (style) => {
    const textarea = document.querySelector('input[placeholder*="Message"]');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = newMessage.substring(start, end);
    
    let styledText = '';
    switch (style) {
      case 'bold':
        styledText = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        styledText = `*${selectedText || 'italic text'}*`;
        break;
      case 'underline':
        styledText = `__${selectedText || 'underlined text'}__`;
        break;
      case 'strikethrough':
        styledText = `~~${selectedText || 'strikethrough text'}~~`;
        break;
      case 'code':
        styledText = `\`${selectedText || 'code'}\``;
        break;
      default:
        return;
    }

    const newText = newMessage.substring(0, start) + styledText + newMessage.substring(end);
    setNewMessage(newText);
    
    toast({
      title: `${style.charAt(0).toUpperCase() + style.slice(1)} Applied! ✨`,
      description: `Text styled with ${style} formatting`
    });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      senderId: user.id,
      senderName: user.username,
      senderAvatar: user.avatar,
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: 'text',
      reactions: []
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    saveChannelMessages(updatedMessages);
    setNewMessage('');
    setShowEmojiPicker(false);

    setIsTyping(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    toast({
      title: "Message Sent! 📢",
      description: `Your message was sent to #${channel.name}`
    });
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !replyingTo) return;

    const replyMessage = {
      id: Date.now(),
      senderId: user.id,
      senderName: user.username,
      senderAvatar: user.avatar,
      content: replyText,
      timestamp: new Date().toISOString(),
      type: 'reply',
      replyTo: {
        id: replyingTo.id,
        senderName: replyingTo.senderName,
        content: replyingTo.content
      },
      reactions: []
    };

    const updatedMessages = [...messages, replyMessage];
    setMessages(updatedMessages);
    saveChannelMessages(updatedMessages);
    setReplyText('');
    setReplyingTo(null);

    toast({
      title: "Reply Sent! 💬",
      description: `Your reply to ${replyingTo.senderName} was sent`
    });
  };

  const handleReply = (message) => {
    setReplyingTo(message);
    setReplyText('');
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyText('');
  };

  const handleTyping = (value) => {
    setNewMessage(value);
    
    if (!isTyping && value.trim()) {
      setIsTyping(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  const handleEmojiSelect = (emoji) => {
    if (replyingTo) {
      setReplyText(prev => prev + emoji);
    } else {
      setNewMessage(prev => prev + emoji);
    }
    setShowEmojiPicker(false);
  };

  const handleFileUpload = (file) => {
    const message = {
      id: Date.now(),
      senderId: user.id,
      senderName: user.username,
      senderAvatar: user.avatar,
      content: `Shared a file: ${file.name}`,
      timestamp: new Date().toISOString(),
      type: 'file',
      fileData: {
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file)
      },
      reactions: []
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    saveChannelMessages(updatedMessages);
    setShowFileUpload(false);

    toast({
      title: "File Shared! 📎",
      description: `${file.name} was shared in #${channel.name}`
    });
  };

  const handleVoiceNote = (audioBlob) => {
    const message = {
      id: Date.now(),
      senderId: user.id,
      senderName: user.username,
      senderAvatar: user.avatar,
      content: 'Voice message',
      timestamp: new Date().toISOString(),
      type: 'voice',
      voiceData: {
        url: URL.createObjectURL(audioBlob),
        duration: 0
      },
      reactions: []
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    saveChannelMessages(updatedMessages);
    setIsRecording(false);

    toast({
      title: "Voice Note Sent! 🎤",
      description: `Your voice message was sent to #${channel.name}`
    });
  };

  // CRITICAL FIX: Proper emoji reaction handling
  const handleReaction = (messageId, emoji) => {
    console.log('Channel handleReaction called with:', { messageId, emoji });
    
    const updatedMessages = messages.map(message => {
      if (message.id === messageId) {
        const reactions = message.reactions || [];
        
        // Find existing reaction with the EXACT same emoji
        const existingReactionIndex = reactions.findIndex(r => r.emoji === emoji);
        
        if (existingReactionIndex !== -1) {
          // Reaction exists - toggle user participation
          const existingReaction = reactions[existingReactionIndex];
          const userIndex = existingReaction.users.indexOf(user.id);
          
          if (userIndex !== -1) {
            // User already reacted - remove their reaction
            existingReaction.users.splice(userIndex, 1);
            existingReaction.count = existingReaction.users.length;
            
            // If no users left, remove the entire reaction
            if (existingReaction.count === 0) {
              reactions.splice(existingReactionIndex, 1);
            }
          } else {
            // User hasn't reacted - add their reaction
            existingReaction.users.push(user.id);
            existingReaction.count = existingReaction.users.length;
          }
        } else {
          // New reaction - create it with the exact emoji
          reactions.push({
            emoji: emoji, // Preserve the exact emoji
            users: [user.id],
            count: 1
          });
        }
        
        console.log('Updated reactions:', reactions);
        return { ...message, reactions };
      }
      return message;
    });

    setMessages(updatedMessages);
    saveChannelMessages(updatedMessages);
  };

  const handlePinMessage = (messageId) => {
    const messageToPin = messages.find(msg => msg.id === messageId);
    if (!messageToPin) return;

    const updatedMessages = messages.map(message => {
      if (message.id === messageId) {
        const isPinned = !message.isPinned;
        return { ...message, isPinned };
      }
      return message;
    });

    // Update pinned messages list
    const newPinnedMessages = updatedMessages.filter(msg => msg.isPinned);
    setPinnedMessages(newPinnedMessages);
    
    setMessages(updatedMessages);
    saveChannelMessages(updatedMessages);

    toast({
      title: messageToPin.isPinned ? "Message Unpinned! 📌" : "Message Pinned! 📌",
      description: messageToPin.isPinned ? "Message removed from pinned" : "Message pinned to channel"
    });
  };

  // Fixed delete message function
  const handleDeleteMessage = (messageId) => {
    const updatedMessages = messages.filter(msg => msg.id !== messageId);
    const newPinnedMessages = updatedMessages.filter(msg => msg.isPinned);
    
    setMessages(updatedMessages);
    setPinnedMessages(newPinnedMessages);
    saveChannelMessages(updatedMessages);

    toast({
      title: "Message Deleted! 🗑️",
      description: "Message has been permanently deleted"
    });
  };

  const handleUnpinMessage = (messageId) => {
    const updatedMessages = messages.map(message => {
      if (message.id === messageId) {
        return { ...message, isPinned: false };
      }
      return message;
    });

    const newPinnedMessages = updatedMessages.filter(msg => msg.isPinned);
    setPinnedMessages(newPinnedMessages);
    
    setMessages(updatedMessages);
    saveChannelMessages(updatedMessages);

    toast({
      title: "Message Unpinned! 📌",
      description: "Message removed from pinned messages"
    });
  };

  const toggleNotifications = () => {
    const newNotifications = !notifications;
    setNotifications(newNotifications);
    saveChannelSettings({ notifications: newNotifications, muted: channelMuted });
    
    toast({
      title: newNotifications ? "Notifications Enabled 🔔" : "Notifications Disabled 🔕",
      description: `Channel notifications ${newNotifications ? 'enabled' : 'disabled'}`
    });
  };

  const toggleMute = () => {
    const newMuted = !channelMuted;
    setChannelMuted(newMuted);
    saveChannelSettings({ notifications, muted: newMuted });
    
    toast({
      title: newMuted ? "Channel Muted 🔇" : "Channel Unmuted 🔊",
      description: `#${channel.name} ${newMuted ? 'muted' : 'unmuted'}`
    });
  };

  const filteredMessages = searchQuery 
    ? messages.filter(msg => 
        msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.senderName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  const channelMembers = [
    { id: 'demo-user-1', name: 'Alex Chen', avatar: '👨‍💻', status: 'online', role: 'admin' },
    { id: 'demo-user-2', name: 'Sarah Wilson', avatar: '👩‍🎨', status: 'online', role: 'member' },
    { id: 'demo-user-3', name: 'Mike Johnson', avatar: '🧑‍🚀', status: 'away', role: 'member' },
    { id: 'demo-user-4', name: 'Emma Davis', avatar: '👩‍💼', status: 'online', role: 'member' },
    { id: 'demo-user-5', name: 'James Brown', avatar: '👨‍🔬', status: 'online', role: 'member' },
    { id: 'demo-user-6', name: 'Lisa Wang', avatar: '👩‍🔬', status: 'away', role: 'member' },
    { id: 'demo-user-7', name: 'David Kim', avatar: '👨‍🎨', status: 'online', role: 'member' },
    { id: 'demo-user-8', name: 'Rachel Green', avatar: '👩‍🚀', status: 'online', role: 'member' },
    { id: user.id, name: user.username, avatar: user.avatar, status: 'online', role: 'member' }
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-background via-background to-background/95 relative">
      {/* FIXED: Channel Header with proper Info button */}
      <ChannelHeader
        channel={channel}
        channelMembers={channelMembers}
        pinnedMessages={pinnedMessages}
        channelMuted={channelMuted}
        notifications={notifications}
        showSearch={showSearch}
        onBack={onBack}
        onToggleSearch={() => setShowSearch(!showSearch)}
        onToggleNotifications={toggleNotifications}
        onToggleMute={toggleMute}
        onToggleMembers={() => setShowMembers(!showMembers)}
        onShowChannelInfo={() => setShowChannelInfo(true)}
      />

      {/* Search Bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-border bg-gradient-to-r from-card/40 to-card/20 backdrop-blur-sm p-4 flex-shrink-0"
          >
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background/50 border-border/50 focus:border-primary/50"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pinned Messages */}
      <AnimatePresence>
        {pinnedMessages.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-border bg-gradient-to-r from-accent/30 to-accent/10 backdrop-blur-sm p-3 flex-shrink-0"
          >
            <div className="flex items-center gap-2 mb-2">
              <Pin className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-foreground">Pinned Messages</span>
            </div>
            <div className="space-y-2">
              {pinnedMessages.slice(0, 2).map((message) => (
                <div key={message.id} className="text-sm text-muted-foreground bg-card/50 rounded-lg p-3 border border-border/30 flex items-start justify-between">
                  <div className="flex-1">
                    <span className="font-semibold">{message.senderName}:</span> {message.content}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-6 h-6 ml-2 opacity-60 hover:opacity-100 hover:bg-destructive/20"
                    onClick={() => handleUnpinMessage(message.id)}
                    title="Unpin message"
                  >
                    <PinOff className="w-3 h-3" />
                  </Button>
                </div>
              ))}
              {pinnedMessages.length > 2 && (
                <div className="text-xs text-muted-foreground font-medium">
                  +{pinnedMessages.length - 2} more pinned messages
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area with Proper Height */}
      <div className="flex-1 flex overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Messages Container with Fixed Height and Scrolling */}
          <div 
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-transparent to-background/50 scroll-smooth"
            style={{ 
              height: '100%',
              maxHeight: '100%'
            }}
          >
            <AnimatePresence>
              {filteredMessages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.02 }}
                >
                  {/* Reply Context */}
                  {message.type === 'reply' && message.replyTo && (
                    <div className="mb-2 ml-4">
                      <div className="bg-muted/30 border-l-4 border-primary/50 pl-3 py-2 rounded-r-lg max-w-md">
                        <div className="flex items-center gap-2 mb-1">
                          <Reply className="w-3 h-3 text-primary" />
                          <span className="text-xs font-medium text-primary">
                            Replying to {message.replyTo.senderName}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {message.replyTo.content}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <MessageBubble
                    message={message}
                    isOwn={message.senderId === user.id}
                    onReact={(emoji) => handleReaction(message.id, emoji)}
                    onReply={() => handleReply(message)}
                    onPin={() => handlePinMessage(message.id)}
                    onDelete={() => handleDeleteMessage(message.id)}
                    showPin={true}
                    onShowOptions={(msg) => {
                      console.log('Message options requested for:', msg.id);
                      toast({
                        title: "Message Options",
                        description: "Message options menu opened"
                      });
                    }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Typing Indicator */}
            {typingUsers.length > 0 && (
              <TypingIndicator users={typingUsers} />
            )}
            
            {/* Scroll anchor */}
            <div ref={messagesEndRef} className="h-1" />
          </div>

          {/* Scroll to Top Button */}
          <AnimatePresence>
            {showScrollToTop && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute bottom-20 right-6 z-10"
              >
                <Button
                  onClick={scrollToTop}
                  size="icon"
                  className="rounded-full shadow-lg bg-primary/90 hover:bg-primary backdrop-blur-sm"
                >
                  <ArrowUp className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Reply Section */}
          <AnimatePresence>
            {replyingTo && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="border-t border-border bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-sm p-4 flex-shrink-0"
              >
                <div className="flex items-start gap-3 mb-3">
                  <Reply className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-primary">
                        Replying to {replyingTo.senderName}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-5 h-5 hover:bg-destructive/20"
                        onClick={handleCancelReply}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="bg-muted/50 border-l-4 border-primary pl-3 py-2 rounded-r-lg">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {replyingTo.content}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Input
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Reply to ${replyingTo.senderName}...`}
                    className="flex-1 bg-background/50 border-border/50 focus:border-primary/50"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendReply();
                      } else if (e.key === 'Escape') {
                        handleCancelReply();
                      }
                    }}
                    autoFocus
                  />
                  <Button
                    onClick={handleSendReply}
                    disabled={!replyText.trim()}
                    size="icon"
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Message Input - Fixed at bottom */}
          {!replyingTo && (
            <div className="flex-shrink-0">
              <ChannelInput
                newMessage={newMessage}
                showEmojiPicker={showEmojiPicker}
                channelName={channel.name}
                onMessageChange={handleTyping}
                onSendMessage={handleSendMessage}
                onToggleEmojiPicker={() => setShowEmojiPicker(!showEmojiPicker)}
                onEmojiSelect={handleEmojiSelect}
                onFileUpload={() => setShowFileUpload(true)}
                onVoiceRecord={() => setIsRecording(true)}
                onApplyStyle={applyTextStyle}
              />
            </div>
          )}
        </div>

        {/* Members Sidebar */}
        <AnimatePresence>
          <ChannelMembers 
            members={channelMembers}
            showMembers={showMembers}
          />
        </AnimatePresence>
      </div>

      {/* File Upload Modal */}
      <FileUpload
        isOpen={showFileUpload}
        onClose={() => setShowFileUpload(false)}
        onFileSelect={handleFileUpload}
      />

      {/* Voice Recorder */}
      <VoiceRecorder
        isRecording={isRecording}
        onStop={handleVoiceNote}
        onCancel={() => setIsRecording(false)}
      />

      {/* FIXED: Channel Information Panel */}
      <ChannelInfoPanel
        channel={channel}
        isOpen={showChannelInfo}
        onClose={() => setShowChannelInfo(false)}
        onUpdateChannel={(channelId, updates) => {
          toast({
            title: "Channel Updated! ⚙️",
            description: "Channel information has been updated"
          });
        }}
        onLeaveChannel={() => {
          toast({
            title: "Left Channel",
            description: `You have left #${channel.name}`
          });
          onBack();
        }}
        onInviteMembers={() => {
          toast({
            title: "Invite Link Generated! 🔗",
            description: "Share the invite link to add new members to this channel"
          });
        }}
        onManageMembers={() => {
          toast({
            title: "Member Management",
            description: "Opening member management panel..."
          });
        }}
      />
    </div>
  );
}
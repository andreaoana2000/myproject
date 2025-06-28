import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ChatArea from '@/components/chat/ChatArea';
import ContactList from '@/components/contacts/ContactList';
import StatusUpdates from '@/components/status/StatusUpdates';
import Channels from '@/components/channels/Channels';
import Settings from '@/components/settings/Settings';
import VideoCallInterface from '@/components/video/VideoCallInterface';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/hooks/useAuth';
import { 
  MessageCircle, 
  Users, 
  Radio, 
  Settings as SettingsIcon, 
  LogOut,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const tabs = [
  { id: 'chats', icon: MessageCircle, label: 'Chats' },
  { id: 'status', icon: Radio, label: 'Status' },
  { id: 'channels', icon: Users, label: 'Channels' },
  { id: 'settings', icon: SettingsIcon, label: 'Settings' }
];

export default function MainLayout() {
  const [activeTab, setActiveTab] = useState('chats');
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [videoCallContact, setVideoCallContact] = useState(null);
  const [isVideoCallMinimized, setIsVideoCallMinimized] = useState(false);
  const { activeChat, chats } = useChat();
  const { user, logout } = useAuth();

  // Safety check for user and chats
  const unreadCount = (user && chats && Array.isArray(chats)) ? chats.reduce((count, chat) => {
    if (!chat.messages || !Array.isArray(chat.messages)) {
      return count;
    }
    return count + chat.messages.filter(msg => 
      msg && !msg.read && msg.senderId !== user.id
    ).length;
  }, 0) : 0;

  const renderContent = () => {
    switch (activeTab) {
      case 'chats':
        return activeChat ? <ChatArea /> : <ContactList />;
      case 'status':
        return <StatusUpdates />;
      case 'channels':
        return <Channels />;
      case 'settings':
        return <Settings />;
      default:
        return <ContactList />;
    }
  };

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">Loading...</h3>
          <p className="text-muted-foreground">Please wait while we load your account</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Navigation */}
      <div className="h-16 bg-card border-b border-border flex items-center justify-between px-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">SecureChat</h1>
            <p className="text-xs text-muted-foreground">End-to-end encrypted</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1">
          {tabs.map((tab) => (
            <motion.div key={tab.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                size="sm"
                className="relative px-4 py-2"
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
                {tab.id === 'chats' && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Button>
            </motion.div>
          ))}
        </nav>

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm">
              {user.avatar || '👤'}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-foreground">{user.username || 'User'}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.status || 'online'}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="w-8 h-8"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          {renderContent()}
        </motion.div>
      </div>

      {/* Video Call Interface */}
      {showVideoCall && videoCallContact && (
        <VideoCallInterface
          contact={videoCallContact}
          onEnd={() => {
            setShowVideoCall(false);
            setVideoCallContact(null);
            setIsVideoCallMinimized(false);
          }}
          isMinimized={isVideoCallMinimized}
          onToggleMinimize={() => setIsVideoCallMinimized(!isVideoCallMinimized)}
        />
      )}
    </div>
  );
}
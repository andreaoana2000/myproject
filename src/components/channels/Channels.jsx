import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import ChannelCreator from '@/components/channels/ChannelCreator';
import ChannelView from '@/components/channels/ChannelView';
import ChannelSubscriptionManager from '@/components/channels/ChannelSubscriptionManager';
import AdvancedChannelSettings from '@/components/channels/AdvancedChannelSettings';
import NotificationSettings from '@/components/notifications/NotificationSettings';
import { Search, Plus, Hash, Users, Bell, BellOff, Settings, ArrowLeft } from 'lucide-react';

export default function Channels() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreator, setShowCreator] = useState(false);
  const [userChannels, setUserChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [showSubscriptionManager, setShowSubscriptionManager] = useState(null);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(null);
  const [notificationSettings, setNotificationSettings] = useState({});

  useEffect(() => {
    loadUserChannels();
    loadNotificationSettings();
  }, []);

  const loadUserChannels = () => {
    const saved = localStorage.getItem('securechat-channels');
    if (saved) {
      try {
        setUserChannels(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading channels:', error);
      }
    }
  };

  const loadNotificationSettings = () => {
    const saved = localStorage.getItem('securechat-notification-settings');
    if (saved) {
      try {
        setNotificationSettings(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading notification settings:', error);
      }
    }
  };

  const saveUserChannels = (channels) => {
    localStorage.setItem('securechat-channels', JSON.stringify(channels));
    setUserChannels(channels);
  };

  const saveNotificationSettings = (settings) => {
    setNotificationSettings(settings);
    localStorage.setItem('securechat-notification-settings', JSON.stringify(settings));
  };

  const demoChannels = [
    {
      id: 1,
      name: 'Tech News',
      description: 'Latest technology updates and discussions',
      members: 1234,
      icon: '💻',
      subscribed: true,
      unreadCount: 5,
      notifications: true,
      soundEnabled: true,
      mentionOnly: false,
      isFavorite: false,
      isPrivate: false,
      category: 'Technology',
      tags: ['tech', 'news', 'updates']
    },
    {
      id: 2,
      name: 'Crypto Updates',
      description: 'Cryptocurrency news and market analysis',
      members: 856,
      icon: '₿',
      subscribed: true,
      unreadCount: 0,
      notifications: true,
      soundEnabled: false,
      mentionOnly: true,
      isFavorite: true,
      isPrivate: false,
      category: 'Finance',
      tags: ['crypto', 'bitcoin', 'finance']
    },
    {
      id: 3,
      name: 'Design Inspiration',
      description: 'UI/UX design trends and inspiration',
      members: 2341,
      icon: '🎨',
      subscribed: false,
      unreadCount: 0,
      notifications: false,
      soundEnabled: false,
      mentionOnly: false,
      isFavorite: false,
      isPrivate: false,
      category: 'Design',
      tags: ['design', 'ui', 'ux']
    },
    {
      id: 4,
      name: 'Startup News',
      description: 'Entrepreneurship and startup ecosystem',
      members: 567,
      icon: '🚀',
      subscribed: true,
      unreadCount: 2,
      notifications: true,
      soundEnabled: true,
      mentionOnly: false,
      isFavorite: false,
      isPrivate: false,
      category: 'Business',
      tags: ['startup', 'business', 'entrepreneur']
    },
    {
      id: 5,
      name: 'Science Daily',
      description: 'Latest scientific discoveries and research',
      members: 1789,
      icon: '🔬',
      subscribed: false,
      unreadCount: 0,
      notifications: false,
      soundEnabled: false,
      mentionOnly: false,
      isFavorite: false,
      isPrivate: false,
      category: 'Science',
      tags: ['science', 'research', 'discovery']
    }
  ];

  const allChannels = [...userChannels, ...demoChannels];
  const filteredChannels = allChannels.filter(channel =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    channel.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    channel.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    channel.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const subscribedChannels = filteredChannels.filter(channel => channel.subscribed);
  const availableChannels = filteredChannels.filter(channel => !channel.subscribed);

  const handleSubscribe = (channelId) => {
    const channel = allChannels.find(c => c.id === channelId);
    if (channel) {
      if (channel.subscribed) {
        setShowSubscriptionManager(channel);
      } else {
        // Subscribe to channel
        const updatedChannels = allChannels.map(c =>
          c.id === channelId ? { ...c, subscribed: true, notifications: true } : c
        );
        
        const userChannelUpdates = updatedChannels.filter(c => 
          userChannels.some(uc => uc.id === c.id)
        );
        saveUserChannels(userChannelUpdates);

        toast({
          title: "Subscribed! 🎉",
          description: `You're now subscribed to #${channel.name}`
        });
      }
    }
  };

  const handleUpdateSubscription = (channelId, settings) => {
    // Update channel subscription settings
    const updatedChannels = allChannels.map(channel =>
      channel.id === channelId ? { ...channel, ...settings } : channel
    );
    
    // Save user channels
    const userChannelUpdates = updatedChannels.filter(c => 
      userChannels.some(uc => uc.id === c.id)
    );
    saveUserChannels(userChannelUpdates);
  };

  const handleCreateChannel = (channelData) => {
    const updatedChannels = [channelData, ...userChannels];
    saveUserChannels(updatedChannels);

    toast({
      title: "Channel Created! 🎉",
      description: `#${channelData.name} has been created successfully`
    });
  };

  const handleUpdateChannel = (channelId, updates) => {
    const updatedChannels = userChannels.map(c =>
      c.id === channelId ? { ...c, ...updates } : c
    );
    saveUserChannels(updatedChannels);
    
    toast({
      title: "Channel Updated! ⚙️",
      description: "Channel settings have been saved"
    });
  };

  const handleDeleteChannel = (channelId) => {
    // Find the channel to get its name for the toast
    const channelToDelete = userChannels.find(c => c.id === channelId);
    
    if (!channelToDelete) {
      toast({
        title: "Error",
        description: "Channel not found or cannot be deleted",
        variant: "destructive"
      });
      return;
    }

    // Remove the channel from userChannels
    const updatedChannels = userChannels.filter(c => c.id !== channelId);
    
    // Save the updated channels to localStorage and state
    localStorage.setItem('securechat-channels', JSON.stringify(updatedChannels));
    setUserChannels(updatedChannels);
    
    // Close any open modals
    setShowAdvancedSettings(null);
    setSelectedChannel(null);
    
    toast({
      title: "Channel Deleted! 🗑️",
      description: `#${channelToDelete.name} has been permanently deleted`
    });
  };

  const handleChannelClick = (channel) => {
    setSelectedChannel(channel);
  };

  const handleBackToChannels = () => {
    setSelectedChannel(null);
  };

  // Show channel view if a channel is selected
  if (selectedChannel) {
    return (
      <div className="h-full flex flex-col overflow-hidden">
        {/* Fixed Back Navigation Header - Always Visible */}
        <div className="h-16 border-b border-border bg-card/80 backdrop-blur-sm flex items-center px-4 flex-shrink-0 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackToChannels}
            className="mr-3 hover:bg-primary/20 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-lg shadow-lg">
              {selectedChannel.icon}
            </div>
            <div>
              <h2 className="font-semibold text-foreground">#{selectedChannel.name}</h2>
              <p className="text-xs text-muted-foreground">{selectedChannel.members} members</p>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toast({
                title: "🚧 Channel Info",
                description: "Channel information panel isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
              })}
              className="text-xs"
            >
              Info
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToChannels}
              className="text-xs"
            >
              Exit
            </Button>
          </div>
        </div>
        
        {/* Channel View - Takes remaining space */}
        <div className="flex-1 overflow-hidden">
          <ChannelView
            channel={selectedChannel}
            onBack={handleBackToChannels}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Channels</h1>
            <p className="text-muted-foreground">Follow topics and communities</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowNotificationSettings(true)}
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button onClick={() => setShowCreator(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search channels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Channel Lists - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {/* Subscribed Channels */}
        {subscribedChannels.length > 0 && (
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4">My Channels ({subscribedChannels.length})</h2>
            <div className="space-y-3">
              {subscribedChannels.map((channel, index) => (
                <motion.div
                  key={channel.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => handleChannelClick(channel)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-xl">
                        {channel.icon}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Hash className="w-4 h-4 text-muted-foreground" />
                          <h3 className="font-semibold text-foreground">{channel.name}</h3>
                          {channel.isFavorite && (
                            <span className="text-yellow-500">⭐</span>
                          )}
                          {channel.unreadCount > 0 && (
                            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                              {channel.unreadCount}
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">{channel.description}</p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{channel.members.toLocaleString()} members</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {channel.notifications ? (
                              <Bell className="w-3 h-3 text-primary" />
                            ) : (
                              <BellOff className="w-3 h-3 text-muted-foreground" />
                            )}
                            <span>
                              {channel.mentionOnly ? 'Mentions only' : 'All notifications'}
                            </span>
                          </div>
                          {channel.category && (
                            <span className="bg-muted px-2 py-1 rounded text-xs">
                              {channel.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Only show advanced settings for user-created channels */}
                      {userChannels.some(uc => uc.id === channel.id) && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowAdvancedSettings(channel);
                          }}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                      )}
                      
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowSubscriptionManager(channel);
                        }}
                      >
                        ✅ Subscribed
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Available Channels */}
        <div className="p-4">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Discover Channels ({availableChannels.length})
          </h2>
          <div className="space-y-3">
            {availableChannels.map((channel, index) => (
              <motion.div
                key={channel.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => handleChannelClick(channel)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-xl">
                      {channel.icon}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Hash className="w-4 h-4 text-muted-foreground" />
                        <h3 className="font-semibold text-foreground">{channel.name}</h3>
                        {channel.isPrivate && (
                          <span className="text-xs bg-yellow-500/20 text-yellow-600 px-2 py-1 rounded">
                            Private
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">{channel.description}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{channel.members.toLocaleString()} members</span>
                        </div>
                        {channel.category && (
                          <span className="bg-muted px-2 py-1 rounded text-xs">
                            {channel.category}
                          </span>
                        )}
                        {channel.tags && channel.tags.length > 0 && (
                          <div className="flex gap-1">
                            {channel.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="text-xs text-primary">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSubscribe(channel.id);
                      }}
                    >
                      Subscribe
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredChannels.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Hash className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Channels Found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search or create a new channel</p>
            <Button onClick={() => setShowCreator(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Channel
            </Button>
          </div>
        </div>
      )}

      {/* Channel Creator Modal */}
      <ChannelCreator
        isOpen={showCreator}
        onClose={() => setShowCreator(false)}
        onCreateChannel={handleCreateChannel}
      />

      {/* Channel Subscription Manager */}
      <ChannelSubscriptionManager
        channel={showSubscriptionManager}
        isOpen={!!showSubscriptionManager}
        onClose={() => setShowSubscriptionManager(null)}
        onUpdateSubscription={handleUpdateSubscription}
      />

      {/* Advanced Channel Settings - Only for user-created channels */}
      <AdvancedChannelSettings
        channel={showAdvancedSettings}
        isOpen={!!showAdvancedSettings}
        onClose={() => setShowAdvancedSettings(null)}
        onUpdateChannel={handleUpdateChannel}
        onDeleteChannel={handleDeleteChannel}
      />

      {/* Notification Settings */}
      <NotificationSettings
        isOpen={showNotificationSettings}
        onClose={() => setShowNotificationSettings(false)}
        settings={notificationSettings}
        onUpdateSettings={saveNotificationSettings}
      />
    </div>
  );
}
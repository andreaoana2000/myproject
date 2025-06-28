import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { 
  Bell, 
  BellOff, 
  Volume2, 
  VolumeX, 
  Star, 
  Hash, 
  Users,
  Settings,
  X
} from 'lucide-react';

export default function ChannelSubscriptionManager({ 
  channel, 
  isOpen, 
  onClose, 
  onUpdateSubscription 
}) {
  const [subscriptionSettings, setSubscriptionSettings] = useState({
    isSubscribed: channel?.subscribed || false,
    notifications: channel?.notifications || true,
    soundEnabled: channel?.soundEnabled || true,
    mentionOnly: channel?.mentionOnly || false,
    isFavorite: channel?.isFavorite || false,
    autoJoin: channel?.autoJoin || false,
    showInSidebar: channel?.showInSidebar || true
  });

  const handleSettingChange = (key, value) => {
    const newSettings = { ...subscriptionSettings, [key]: value };
    setSubscriptionSettings(newSettings);
    onUpdateSubscription(channel.id, newSettings);
    
    let message = '';
    switch (key) {
      case 'isSubscribed':
        message = value ? `Subscribed to #${channel.name}` : `Unsubscribed from #${channel.name}`;
        break;
      case 'notifications':
        message = value ? 'Notifications enabled' : 'Notifications disabled';
        break;
      case 'soundEnabled':
        message = value ? 'Sound notifications enabled' : 'Sound notifications disabled';
        break;
      case 'mentionOnly':
        message = value ? 'Only mention notifications' : 'All message notifications';
        break;
      case 'isFavorite':
        message = value ? 'Added to favorites' : 'Removed from favorites';
        break;
      case 'autoJoin':
        message = value ? 'Auto-join enabled' : 'Auto-join disabled';
        break;
      case 'showInSidebar':
        message = value ? 'Show in sidebar' : 'Hide from sidebar';
        break;
    }
    
    toast({
      title: "Subscription Updated",
      description: message
    });
  };

  const handleSubscribe = () => {
    const newSubscribed = !subscriptionSettings.isSubscribed;
    handleSettingChange('isSubscribed', newSubscribed);
    
    if (newSubscribed) {
      toast({
        title: "Subscribed! 🎉",
        description: `You're now subscribed to #${channel.name}`,
      });
    } else {
      toast({
        title: "Unsubscribed",
        description: `You've unsubscribed from #${channel.name}`,
      });
    }
  };

  if (!isOpen || !channel) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-card border border-border rounded-lg w-full max-w-md"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-lg">
              {channel.icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Hash className="w-4 h-4" />
                {channel.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {channel.members?.toLocaleString() || 0} members
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-4 space-y-6">
          {/* Channel Description */}
          {channel.description && (
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">{channel.description}</p>
            </div>
          )}

          {/* Main Subscription Toggle */}
          <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
            <div>
              <Label className="text-base font-medium">Channel Subscription</Label>
              <p className="text-sm text-muted-foreground">
                {subscriptionSettings.isSubscribed 
                  ? 'You are subscribed to this channel' 
                  : 'Subscribe to receive updates'}
              </p>
            </div>
            <Button
              variant={subscriptionSettings.isSubscribed ? "default" : "outline"}
              onClick={handleSubscribe}
            >
              {subscriptionSettings.isSubscribed ? '✅ Subscribed' : 'Subscribe'}
            </Button>
          </div>

          {/* Subscription Settings */}
          {subscriptionSettings.isSubscribed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-4"
            >
              <h4 className="font-medium text-foreground">Notification Settings</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <Label className="text-sm">Push Notifications</Label>
                      <p className="text-xs text-muted-foreground">Get notified of new messages</p>
                    </div>
                  </div>
                  <Switch
                    checked={subscriptionSettings.notifications}
                    onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
                  />
                </div>

                {subscriptionSettings.notifications && (
                  <>
                    <div className="flex items-center justify-between pl-6">
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <Label className="text-sm">Sound Notifications</Label>
                          <p className="text-xs text-muted-foreground">Play sound for notifications</p>
                        </div>
                      </div>
                      <Switch
                        checked={subscriptionSettings.soundEnabled}
                        onCheckedChange={(checked) => handleSettingChange('soundEnabled', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between pl-6">
                      <div>
                        <Label className="text-sm">Mentions Only</Label>
                        <p className="text-xs text-muted-foreground">Only notify when mentioned</p>
                      </div>
                      <Switch
                        checked={subscriptionSettings.mentionOnly}
                        onCheckedChange={(checked) => handleSettingChange('mentionOnly', checked)}
                      />
                    </div>
                  </>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <Label className="text-sm">Add to Favorites</Label>
                      <p className="text-xs text-muted-foreground">Pin to top of channel list</p>
                    </div>
                  </div>
                  <Switch
                    checked={subscriptionSettings.isFavorite}
                    onCheckedChange={(checked) => handleSettingChange('isFavorite', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm">Auto-join Voice Chats</Label>
                    <p className="text-xs text-muted-foreground">Automatically join voice discussions</p>
                  </div>
                  <Switch
                    checked={subscriptionSettings.autoJoin}
                    onCheckedChange={(checked) => handleSettingChange('autoJoin', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm">Show in Sidebar</Label>
                    <p className="text-xs text-muted-foreground">Display in main channel list</p>
                  </div>
                  <Switch
                    checked={subscriptionSettings.showInSidebar}
                    onCheckedChange={(checked) => handleSettingChange('showInSidebar', checked)}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Channel Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{channel.members?.toLocaleString() || 0}</div>
              <div className="text-xs text-muted-foreground">Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{channel.unreadCount || 0}</div>
              <div className="text-xs text-muted-foreground">Unread</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Close
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => toast({
                title: "🚧 Channel Settings",
                description: "Advanced channel settings aren't implemented yet—but don't worry! You can request them in your next prompt! 🚀"
              })}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
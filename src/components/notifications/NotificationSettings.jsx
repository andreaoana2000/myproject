import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/components/ui/use-toast';
import { 
  Bell, 
  BellOff, 
  Volume2, 
  VolumeX, 
  Moon, 
  Sun, 
  Smartphone,
  Monitor,
  X,
  Clock,
  MessageCircle,
  Users,
  Radio
} from 'lucide-react';

export default function NotificationSettings({ 
  isOpen, 
  onClose, 
  settings, 
  onUpdateSettings 
}) {
  const [notificationSettings, setNotificationSettings] = useState({
    enabled: settings?.enabled ?? true,
    soundEnabled: settings?.soundEnabled ?? true,
    vibrationEnabled: settings?.vibrationEnabled ?? true,
    showPreviews: settings?.showPreviews ?? true,
    quietHours: settings?.quietHours ?? false,
    quietStart: settings?.quietStart ?? 22,
    quietEnd: settings?.quietEnd ?? 8,
    desktopNotifications: settings?.desktopNotifications ?? true,
    mobileNotifications: settings?.mobileNotifications ?? true,
    emailNotifications: settings?.emailNotifications ?? false,
    
    // Per-type settings
    directMessages: settings?.directMessages ?? true,
    groupMessages: settings?.groupMessages ?? true,
    channelMessages: settings?.channelMessages ?? false,
    statusUpdates: settings?.statusUpdates ?? true,
    mentions: settings?.mentions ?? true,
    reactions: settings?.reactions ?? false,
    
    // Sound settings
    notificationSound: settings?.notificationSound ?? 'default',
    volume: settings?.volume ?? 80
  });

  const soundOptions = [
    { id: 'default', name: 'Default', description: 'System default sound' },
    { id: 'chime', name: 'Chime', description: 'Gentle chime sound' },
    { id: 'ping', name: 'Ping', description: 'Quick ping sound' },
    { id: 'bell', name: 'Bell', description: 'Classic bell sound' },
    { id: 'none', name: 'None', description: 'Silent notifications' }
  ];

  const handleSettingChange = (key, value) => {
    const newSettings = { ...notificationSettings, [key]: value };
    setNotificationSettings(newSettings);
    onUpdateSettings(newSettings);
    
    toast({
      title: "Notification Settings Updated",
      description: `${key.replace(/([A-Z])/g, ' $1').toLowerCase()} has been ${value ? 'enabled' : 'disabled'}`
    });
  };

  const handleTimeChange = (key, value) => {
    const newSettings = { ...notificationSettings, [key]: value[0] };
    setNotificationSettings(newSettings);
    onUpdateSettings(newSettings);
  };

  const formatTime = (hour) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${period}`;
  };

  const testNotification = () => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('SecureChat Test', {
          body: 'This is a test notification from SecureChat',
          icon: '/favicon.ico'
        });
        toast({
          title: "Test Notification Sent",
          description: "Check your system notifications"
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('SecureChat Test', {
              body: 'This is a test notification from SecureChat',
              icon: '/favicon.ico'
            });
          }
        });
      }
    } else {
      toast({
        title: "Notifications Not Supported",
        description: "Your browser doesn't support notifications",
        variant: "destructive"
      });
    }
  };

  if (!isOpen) return null;

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
        className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Settings
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-4 space-y-6">
          {/* Master Toggle */}
          <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg border border-primary/20">
            <div>
              <Label className="text-base font-medium">Enable Notifications</Label>
              <p className="text-sm text-muted-foreground">Master switch for all notifications</p>
            </div>
            <Switch
              checked={notificationSettings.enabled}
              onCheckedChange={(checked) => handleSettingChange('enabled', checked)}
            />
          </div>

          {notificationSettings.enabled && (
            <>
              {/* Platform Settings */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Monitor className="w-4 h-4" />
                  Platform Settings
                </h4>
                
                <div className="space-y-3 pl-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <Label className="text-sm">Desktop Notifications</Label>
                        <p className="text-xs text-muted-foreground">Show notifications on desktop</p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.desktopNotifications}
                      onCheckedChange={(checked) => handleSettingChange('desktopNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <Label className="text-sm">Mobile Notifications</Label>
                        <p className="text-xs text-muted-foreground">Push notifications on mobile</p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.mobileNotifications}
                      onCheckedChange={(checked) => handleSettingChange('mobileNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">Email Notifications</Label>
                      <p className="text-xs text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                    />
                  </div>
                </div>
              </div>

              {/* Notification Types */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Notification Types
                </h4>
                
                <div className="space-y-3 pl-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">Direct Messages</Label>
                      <p className="text-xs text-muted-foreground">One-on-one conversations</p>
                    </div>
                    <Switch
                      checked={notificationSettings.directMessages}
                      onCheckedChange={(checked) => handleSettingChange('directMessages', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">Group Messages</Label>
                      <p className="text-xs text-muted-foreground">Group chat messages</p>
                    </div>
                    <Switch
                      checked={notificationSettings.groupMessages}
                      onCheckedChange={(checked) => handleSettingChange('groupMessages', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">Channel Messages</Label>
                      <p className="text-xs text-muted-foreground">Public channel updates</p>
                    </div>
                    <Switch
                      checked={notificationSettings.channelMessages}
                      onCheckedChange={(checked) => handleSettingChange('channelMessages', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">Status Updates</Label>
                      <p className="text-xs text-muted-foreground">Friend status changes</p>
                    </div>
                    <Switch
                      checked={notificationSettings.statusUpdates}
                      onCheckedChange={(checked) => handleSettingChange('statusUpdates', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">Mentions & Replies</Label>
                      <p className="text-xs text-muted-foreground">When someone mentions you</p>
                    </div>
                    <Switch
                      checked={notificationSettings.mentions}
                      onCheckedChange={(checked) => handleSettingChange('mentions', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">Reactions</Label>
                      <p className="text-xs text-muted-foreground">Message reactions and likes</p>
                    </div>
                    <Switch
                      checked={notificationSettings.reactions}
                      onCheckedChange={(checked) => handleSettingChange('reactions', checked)}
                    />
                  </div>
                </div>
              </div>

              {/* Sound & Vibration */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  Sound & Vibration
                </h4>
                
                <div className="space-y-3 pl-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">Sound Notifications</Label>
                      <p className="text-xs text-muted-foreground">Play sound for notifications</p>
                    </div>
                    <Switch
                      checked={notificationSettings.soundEnabled}
                      onCheckedChange={(checked) => handleSettingChange('soundEnabled', checked)}
                    />
                  </div>

                  {notificationSettings.soundEnabled && (
                    <>
                      <div className="space-y-2">
                        <Label className="text-sm">Notification Sound</Label>
                        <div className="grid grid-cols-1 gap-2">
                          {soundOptions.map((sound) => (
                            <Button
                              key={sound.id}
                              variant={notificationSettings.notificationSound === sound.id ? "default" : "outline"}
                              size="sm"
                              className="justify-start"
                              onClick={() => handleSettingChange('notificationSound', sound.id)}
                            >
                              <div className="text-left">
                                <div className="font-medium">{sound.name}</div>
                                <div className="text-xs text-muted-foreground">{sound.description}</div>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">Volume: {notificationSettings.volume}%</Label>
                        <Slider
                          value={[notificationSettings.volume]}
                          onValueChange={(value) => handleSettingChange('volume', value[0])}
                          max={100}
                          min={0}
                          step={5}
                          className="w-full"
                        />
                      </div>
                    </>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">Vibration</Label>
                      <p className="text-xs text-muted-foreground">Vibrate on mobile devices</p>
                    </div>
                    <Switch
                      checked={notificationSettings.vibrationEnabled}
                      onCheckedChange={(checked) => handleSettingChange('vibrationEnabled', checked)}
                    />
                  </div>
                </div>
              </div>

              {/* Privacy */}
              <div className="space-y-4">
                <h4 className="font-medium">Privacy</h4>
                
                <div className="space-y-3 pl-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">Show Message Previews</Label>
                      <p className="text-xs text-muted-foreground">Display message content in notifications</p>
                    </div>
                    <Switch
                      checked={notificationSettings.showPreviews}
                      onCheckedChange={(checked) => handleSettingChange('showPreviews', checked)}
                    />
                  </div>
                </div>
              </div>

              {/* Quiet Hours */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Moon className="w-4 h-4" />
                  Quiet Hours
                </h4>
                
                <div className="space-y-3 pl-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">Enable Quiet Hours</Label>
                      <p className="text-xs text-muted-foreground">Disable notifications during specific hours</p>
                    </div>
                    <Switch
                      checked={notificationSettings.quietHours}
                      onCheckedChange={(checked) => handleSettingChange('quietHours', checked)}
                    />
                  </div>

                  {notificationSettings.quietHours && (
                    <>
                      <div className="space-y-2">
                        <Label className="text-sm">Start Time: {formatTime(notificationSettings.quietStart)}</Label>
                        <Slider
                          value={[notificationSettings.quietStart]}
                          onValueChange={(value) => handleTimeChange('quietStart', value)}
                          max={23}
                          min={0}
                          step={1}
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">End Time: {formatTime(notificationSettings.quietEnd)}</Label>
                        <Slider
                          value={[notificationSettings.quietEnd]}
                          onValueChange={(value) => handleTimeChange('quietEnd', value)}
                          max={23}
                          min={0}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Test Notification */}
              <div className="pt-4 border-t border-border">
                <Button onClick={testNotification} className="w-full">
                  <Bell className="w-4 h-4 mr-2" />
                  Send Test Notification
                </Button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
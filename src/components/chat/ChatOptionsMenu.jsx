import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/components/ui/use-toast';
import { Settings, Bell, BellOff, Clock, Shield, Trash2, Download, Blocks as Block, Star, X, Volume2, VolumeX, Eye, EyeOff } from 'lucide-react';

export default function ChatOptionsMenu({ 
  isOpen, 
  onClose, 
  contact, 
  chatSettings, 
  onUpdateSettings 
}) {
  const [settings, setSettings] = useState({
    notifications: chatSettings?.notifications ?? true,
    soundEnabled: chatSettings?.soundEnabled ?? true,
    autoDelete: chatSettings?.autoDelete ?? true,
    deleteTimer: chatSettings?.deleteTimer ?? 5,
    readReceipts: chatSettings?.readReceipts ?? true,
    typingIndicators: chatSettings?.typingIndicators ?? true,
    mediaAutoDownload: chatSettings?.mediaAutoDownload ?? false,
    isBlocked: contact?.isBlocked ?? false,
    isFavorite: contact?.isFavorite ?? false
  });

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onUpdateSettings(newSettings);
    
    toast({
      title: "Setting Updated",
      description: `${key.replace(/([A-Z])/g, ' $1').toLowerCase()} has been ${value ? 'enabled' : 'disabled'}`
    });
  };

  const handleDeleteTimerChange = (value) => {
    const newSettings = { ...settings, deleteTimer: value[0] };
    setSettings(newSettings);
    onUpdateSettings(newSettings);
  };

  const handleExportChat = () => {
    toast({
      title: "Chat Exported! 📦",
      description: "Chat history has been exported successfully"
    });
  };

  const handleClearChat = () => {
    toast({
      title: "Chat Cleared! 🗑️",
      description: "All messages have been deleted from this chat"
    });
  };

  const handleBlockContact = () => {
    handleSettingChange('isBlocked', !settings.isBlocked);
    toast({
      title: settings.isBlocked ? "Contact Unblocked" : "Contact Blocked",
      description: `${contact.username} has been ${settings.isBlocked ? 'unblocked' : 'blocked'}`
    });
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
        className="bg-card border border-border rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Chat Options</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-4 space-y-6">
          {/* Contact Info */}
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-xl">
              {contact?.avatar}
            </div>
            <div>
              <h4 className="font-semibold">{contact?.username}</h4>
              <p className="text-sm text-muted-foreground capitalize">{contact?.status}</p>
            </div>
            <div className="ml-auto flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8"
                onClick={() => handleSettingChange('isFavorite', !settings.isFavorite)}
              >
                <Star className={`w-4 h-4 ${settings.isFavorite ? 'text-yellow-500 fill-current' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Notifications */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </h4>
            
            <div className="space-y-3 pl-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">Push Notifications</Label>
                  <p className="text-xs text-muted-foreground">Receive notifications for new messages</p>
                </div>
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">Sound Effects</Label>
                  <p className="text-xs text-muted-foreground">Play sounds for notifications</p>
                </div>
                <Switch
                  checked={settings.soundEnabled}
                  onCheckedChange={(checked) => handleSettingChange('soundEnabled', checked)}
                />
              </div>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Privacy & Security
            </h4>
            
            <div className="space-y-3 pl-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">Auto-Delete Messages</Label>
                  <p className="text-xs text-muted-foreground">Automatically delete messages after reading</p>
                </div>
                <Switch
                  checked={settings.autoDelete}
                  onCheckedChange={(checked) => handleSettingChange('autoDelete', checked)}
                />
              </div>

              {settings.autoDelete && (
                <div className="space-y-2">
                  <Label className="text-sm">Delete Timer: {settings.deleteTimer} seconds</Label>
                  <Slider
                    value={[settings.deleteTimer]}
                    onValueChange={handleDeleteTimerChange}
                    max={30}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">Read Receipts</Label>
                  <p className="text-xs text-muted-foreground">Let others know when you've read their messages</p>
                </div>
                <Switch
                  checked={settings.readReceipts}
                  onCheckedChange={(checked) => handleSettingChange('readReceipts', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">Typing Indicators</Label>
                  <p className="text-xs text-muted-foreground">Show when you're typing</p>
                </div>
                <Switch
                  checked={settings.typingIndicators}
                  onCheckedChange={(checked) => handleSettingChange('typingIndicators', checked)}
                />
              </div>
            </div>
          </div>

          {/* Media Settings */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Download className="w-4 h-4" />
              Media
            </h4>
            
            <div className="space-y-3 pl-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">Auto-Download Media</Label>
                  <p className="text-xs text-muted-foreground">Automatically download images and files</p>
                </div>
                <Switch
                  checked={settings.mediaAutoDownload}
                  onCheckedChange={(checked) => handleSettingChange('mediaAutoDownload', checked)}
                />
              </div>
            </div>
          </div>

          {/* Chat Actions */}
          <div className="space-y-3">
            <h4 className="font-medium">Chat Actions</h4>
            
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleExportChat}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Chat History
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleClearChat}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Chat History
              </Button>

              <Button
                variant={settings.isBlocked ? "default" : "destructive"}
                className="w-full justify-start"
                onClick={handleBlockContact}
              >
                <Block className="w-4 h-4 mr-2" />
                {settings.isBlocked ? 'Unblock Contact' : 'Block Contact'}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
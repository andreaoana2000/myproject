import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/components/ui/use-toast';
import { 
  Settings, 
  Hash, 
  Users, 
  Shield, 
  Bell, 
  Volume2, 
  Eye, 
  Lock, 
  Trash2,
  Edit,
  X,
  Crown,
  UserPlus,
  Ban,
  MessageSquare,
  Image,
  FileText,
  Link,
  AlertTriangle,
  Clock,
  Archive,
  Filter,
  Zap
} from 'lucide-react';

export default function AdvancedChannelSettings({ 
  channel, 
  isOpen, 
  onClose, 
  onUpdateChannel,
  onDeleteChannel 
}) {
  const [settings, setSettings] = useState({
    name: channel?.name || '',
    description: channel?.description || '',
    icon: channel?.icon || '📢',
    category: channel?.category || '',
    tags: channel?.tags || [],
    isPrivate: channel?.isPrivate || false,
    requireApproval: channel?.requireApproval || false,
    allowFileSharing: channel?.allowFileSharing ?? true,
    allowImageSharing: channel?.allowImageSharing ?? true,
    allowLinkSharing: channel?.allowLinkSharing ?? true,
    allowVoiceMessages: channel?.allowVoiceMessages ?? true,
    slowMode: channel?.slowMode || false,
    slowModeDelay: channel?.slowModeDelay || 5,
    maxMembers: channel?.maxMembers || 1000,
    autoModeration: channel?.autoModeration || false,
    profanityFilter: channel?.profanityFilter || false,
    spamProtection: channel?.spamProtection || true,
    linkPreview: channel?.linkPreview ?? true,
    readOnlyMode: channel?.readOnlyMode || false,
    archiveOldMessages: channel?.archiveOldMessages || false,
    archiveAfterDays: channel?.archiveAfterDays || 30,
    welcomeMessage: channel?.welcomeMessage || '',
    channelRules: channel?.channelRules || '',
    autoDeleteMessages: channel?.autoDeleteMessages || false,
    autoDeleteAfterHours: channel?.autoDeleteAfterHours || 24,
    requireVerification: channel?.requireVerification || false,
    allowReactions: channel?.allowReactions ?? true,
    allowReplies: channel?.allowReplies ?? true,
    allowThreads: channel?.allowThreads ?? true,
    maxMessageLength: channel?.maxMessageLength || 2000,
    rateLimitMessages: channel?.rateLimitMessages || false,
    messagesPerMinute: channel?.messagesPerMinute || 10
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [newTag, setNewTag] = useState('');

  const channelIcons = ['📢', '💻', '🎨', '🚀', '🔬', '💰', '🎵', '🎮', '📚', '🍕', '⚽', '🎬', '🏠', '🌟', '🔥', '💡', '🎯', '🌈', '⭐', '🎪'];
  const categories = ['General', 'Technology', 'Design', 'Business', 'Science', 'Entertainment', 'Sports', 'News', 'Education', 'Gaming', 'Art', 'Music', 'Food', 'Travel', 'Health'];

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !settings.tags.includes(newTag.trim())) {
      setSettings(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setSettings(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSave = () => {
    if (!settings.name.trim()) {
      toast({
        title: "Channel Name Required",
        description: "Please enter a name for the channel",
        variant: "destructive"
      });
      return;
    }

    if (settings.maxMessageLength < 1 || settings.maxMessageLength > 4000) {
      toast({
        title: "Invalid Message Length",
        description: "Message length must be between 1 and 4000 characters",
        variant: "destructive"
      });
      return;
    }

    onUpdateChannel(channel.id, settings);
    
    toast({
      title: "Channel Updated! ⚙️",
      description: `Advanced settings for #${settings.name} have been saved`
    });
    
    onClose();
  };

  const handleDeleteChannel = () => {
    if (onDeleteChannel) {
      onDeleteChannel(channel.id);
    }
    onClose();
  };

  const resetToDefaults = () => {
    setSettings({
      ...settings,
      allowFileSharing: true,
      allowImageSharing: true,
      allowLinkSharing: true,
      allowVoiceMessages: true,
      slowMode: false,
      slowModeDelay: 5,
      maxMembers: 1000,
      autoModeration: false,
      profanityFilter: false,
      spamProtection: true,
      linkPreview: true,
      readOnlyMode: false,
      archiveOldMessages: false,
      archiveAfterDays: 30,
      autoDeleteMessages: false,
      autoDeleteAfterHours: 24,
      requireVerification: false,
      allowReactions: true,
      allowReplies: true,
      allowThreads: true,
      maxMessageLength: 2000,
      rateLimitMessages: false,
      messagesPerMinute: 10
    });
    
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to defaults"
    });
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
        className="bg-card border border-border rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card z-10">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Advanced Channel Settings</h3>
            <span className="text-sm text-muted-foreground">#{channel.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={resetToDefaults}>
              Reset to Defaults
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Basic Information
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="channelName">Channel Name</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="channelName"
                    value={settings.name}
                    onChange={(e) => handleSettingChange('name', e.target.value)}
                    className="pl-10"
                    placeholder="awesome-channel"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={settings.category}
                  onChange={(e) => handleSettingChange('category', e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={settings.description}
                onChange={(e) => handleSettingChange('description', e.target.value)}
                placeholder="What's this channel about?"
              />
            </div>

            <div>
              <Label>Channel Icon</Label>
              <div className="grid grid-cols-10 gap-2 mt-2">
                {channelIcons.map((icon) => (
                  <button
                    key={icon}
                    className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-lg transition-colors ${
                      settings.icon === icon ? 'border-primary bg-primary/20' : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handleSettingChange('icon', icon)}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mt-2 mb-2">
                {settings.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-primary/20 text-primary px-2 py-1 rounded-full text-xs flex items-center gap-1"
                  >
                    #{tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:bg-primary/30 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button onClick={handleAddTag} disabled={!newTag.trim()}>
                  Add
                </Button>
              </div>
            </div>
          </div>

          {/* Privacy & Access Control */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Privacy & Access Control
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Private Channel</Label>
                    <p className="text-sm text-muted-foreground">Only invited members can join</p>
                  </div>
                  <Switch
                    checked={settings.isPrivate}
                    onCheckedChange={(checked) => handleSettingChange('isPrivate', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Require Approval</Label>
                    <p className="text-sm text-muted-foreground">New members need approval</p>
                  </div>
                  <Switch
                    checked={settings.requireApproval}
                    onCheckedChange={(checked) => handleSettingChange('requireApproval', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Require Verification</Label>
                    <p className="text-sm text-muted-foreground">Members must verify identity</p>
                  </div>
                  <Switch
                    checked={settings.requireVerification}
                    onCheckedChange={(checked) => handleSettingChange('requireVerification', checked)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Read-Only Mode</Label>
                    <p className="text-sm text-muted-foreground">Only admins can post</p>
                  </div>
                  <Switch
                    checked={settings.readOnlyMode}
                    onCheckedChange={(checked) => handleSettingChange('readOnlyMode', checked)}
                  />
                </div>

                <div>
                  <Label className="text-base mb-3 block">Maximum Members: {settings.maxMembers}</Label>
                  <Slider
                    value={[settings.maxMembers]}
                    onValueChange={(value) => handleSettingChange('maxMembers', value[0])}
                    max={10000}
                    min={10}
                    step={10}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Message Settings */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Message Settings
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Allow Reactions</Label>
                    <p className="text-sm text-muted-foreground">Members can react to messages</p>
                  </div>
                  <Switch
                    checked={settings.allowReactions}
                    onCheckedChange={(checked) => handleSettingChange('allowReactions', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Allow Replies</Label>
                    <p className="text-sm text-muted-foreground">Members can reply to messages</p>
                  </div>
                  <Switch
                    checked={settings.allowReplies}
                    onCheckedChange={(checked) => handleSettingChange('allowReplies', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Allow Threads</Label>
                    <p className="text-sm text-muted-foreground">Enable threaded conversations</p>
                  </div>
                  <Switch
                    checked={settings.allowThreads}
                    onCheckedChange={(checked) => handleSettingChange('allowThreads', checked)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-base mb-3 block">Max Message Length: {settings.maxMessageLength} chars</Label>
                  <Slider
                    value={[settings.maxMessageLength]}
                    onValueChange={(value) => handleSettingChange('maxMessageLength', value[0])}
                    max={4000}
                    min={50}
                    step={50}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Rate Limit Messages</Label>
                    <p className="text-sm text-muted-foreground">Limit messages per minute</p>
                  </div>
                  <Switch
                    checked={settings.rateLimitMessages}
                    onCheckedChange={(checked) => handleSettingChange('rateLimitMessages', checked)}
                  />
                </div>

                {settings.rateLimitMessages && (
                  <div>
                    <Label className="text-base mb-3 block">Messages per minute: {settings.messagesPerMinute}</Label>
                    <Slider
                      value={[settings.messagesPerMinute]}
                      onValueChange={(value) => handleSettingChange('messagesPerMinute', value[0])}
                      max={60}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content Sharing */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Content Sharing
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Image className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <Label className="text-base">Allow Images</Label>
                      <p className="text-sm text-muted-foreground">Members can share images</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.allowImageSharing}
                    onCheckedChange={(checked) => handleSettingChange('allowImageSharing', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <Label className="text-base">Allow Files</Label>
                      <p className="text-sm text-muted-foreground">Members can share documents</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.allowFileSharing}
                    onCheckedChange={(checked) => handleSettingChange('allowFileSharing', checked)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Link className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <Label className="text-base">Allow Links</Label>
                      <p className="text-sm text-muted-foreground">Members can share links</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.allowLinkSharing}
                    onCheckedChange={(checked) => handleSettingChange('allowLinkSharing', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <Label className="text-base">Allow Voice Messages</Label>
                      <p className="text-sm text-muted-foreground">Members can send voice notes</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.allowVoiceMessages}
                    onCheckedChange={(checked) => handleSettingChange('allowVoiceMessages', checked)}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Link Previews</Label>
                <p className="text-sm text-muted-foreground">Show previews for shared links</p>
              </div>
              <Switch
                checked={settings.linkPreview}
                onCheckedChange={(checked) => handleSettingChange('linkPreview', checked)}
              />
            </div>
          </div>

          {/* Moderation & Safety */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Ban className="w-4 h-4" />
              Moderation & Safety
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Auto Moderation</Label>
                    <p className="text-sm text-muted-foreground">AI-powered content moderation</p>
                  </div>
                  <Switch
                    checked={settings.autoModeration}
                    onCheckedChange={(checked) => handleSettingChange('autoModeration', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Profanity Filter</Label>
                    <p className="text-sm text-muted-foreground">Filter inappropriate language</p>
                  </div>
                  <Switch
                    checked={settings.profanityFilter}
                    onCheckedChange={(checked) => handleSettingChange('profanityFilter', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Spam Protection</Label>
                    <p className="text-sm text-muted-foreground">Prevent spam messages</p>
                  </div>
                  <Switch
                    checked={settings.spamProtection}
                    onCheckedChange={(checked) => handleSettingChange('spamProtection', checked)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Slow Mode</Label>
                    <p className="text-sm text-muted-foreground">Limit message frequency</p>
                  </div>
                  <Switch
                    checked={settings.slowMode}
                    onCheckedChange={(checked) => handleSettingChange('slowMode', checked)}
                  />
                </div>

                {settings.slowMode && (
                  <div>
                    <Label className="text-base mb-3 block">Slow Mode Delay: {settings.slowModeDelay} seconds</Label>
                    <Slider
                      value={[settings.slowModeDelay]}
                      onValueChange={(value) => handleSettingChange('slowModeDelay', value[0])}
                      max={300}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Auto-Management */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Auto-Management
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Auto-Delete Messages</Label>
                    <p className="text-sm text-muted-foreground">Automatically delete old messages</p>
                  </div>
                  <Switch
                    checked={settings.autoDeleteMessages}
                    onCheckedChange={(checked) => handleSettingChange('autoDeleteMessages', checked)}
                  />
                </div>

                {settings.autoDeleteMessages && (
                  <div>
                    <Label className="text-base mb-3 block">Delete After: {settings.autoDeleteAfterHours} hours</Label>
                    <Slider
                      value={[settings.autoDeleteAfterHours]}
                      onValueChange={(value) => handleSettingChange('autoDeleteAfterHours', value[0])}
                      max={8760}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Archive Old Messages</Label>
                    <p className="text-sm text-muted-foreground">Archive messages instead of deleting</p>
                  </div>
                  <Switch
                    checked={settings.archiveOldMessages}
                    onCheckedChange={(checked) => handleSettingChange('archiveOldMessages', checked)}
                  />
                </div>

                {settings.archiveOldMessages && (
                  <div>
                    <Label className="text-base mb-3 block">Archive After: {settings.archiveAfterDays} days</Label>
                    <Slider
                      value={[settings.archiveAfterDays]}
                      onValueChange={(value) => handleSettingChange('archiveAfterDays', value[0])}
                      max={365}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Welcome & Rules */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Welcome & Rules
            </h4>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="welcomeMessage">Welcome Message</Label>
                <Input
                  id="welcomeMessage"
                  value={settings.welcomeMessage}
                  onChange={(e) => handleSettingChange('welcomeMessage', e.target.value)}
                  placeholder="Welcome new members with a custom message..."
                />
              </div>

              <div>
                <Label htmlFor="channelRules">Channel Rules</Label>
                <textarea
                  id="channelRules"
                  value={settings.channelRules}
                  onChange={(e) => handleSettingChange('channelRules', e.target.value)}
                  placeholder="Set clear rules for your channel..."
                  className="w-full h-24 px-3 py-2 rounded-md border border-input bg-background text-sm resize-none"
                />
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="space-y-4 border-t border-destructive/20 pt-6">
            <h4 className="font-medium flex items-center gap-2 text-destructive">
              <Trash2 className="w-4 h-4" />
              Danger Zone
            </h4>
            
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              {!showDeleteConfirm ? (
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base text-destructive">Delete Channel</Label>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete this channel and all its messages
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Channel
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-destructive" />
                    <div>
                      <Label className="text-base text-destructive">Are you absolutely sure?</Label>
                      <p className="text-sm text-muted-foreground">
                        This action cannot be undone. This will permanently delete the channel 
                        <strong> #{channel.name}</strong> and all its messages, settings, and member data.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowDeleteConfirm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteChannel}
                    >
                      Yes, permanently delete channel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-border sticky bottom-0 bg-card">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSave}>
              <Settings className="w-4 h-4 mr-2" />
              Save All Settings
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
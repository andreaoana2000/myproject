import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/components/ui/use-toast';
import { 
  X, 
  Hash, 
  Users, 
  Settings, 
  Bell, 
  BellOff, 
  Volume2, 
  VolumeX, 
  Pin, 
  Star, 
  Shield, 
  Crown, 
  UserPlus, 
  UserMinus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Copy, 
  Share, 
  Calendar, 
  Clock, 
  Eye, 
  MessageSquare, 
  Image, 
  FileText, 
  Mic, 
  Video,
  Link,
  Download,
  Upload,
  Archive,
  Flag,
  Lock,
  Unlock,
  Info,
  Activity,
  TrendingUp,
  BarChart3
} from 'lucide-react';

export default function ChannelInfoPanel({ 
  channel, 
  isOpen, 
  onClose, 
  onUpdateChannel,
  onLeaveChannel,
  onInviteMembers,
  onManageMembers 
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [channelSettings, setChannelSettings] = useState({
    notifications: true,
    soundEnabled: true,
    showPreviews: true,
    autoJoin: false,
    pinned: false,
    muted: false
  });
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteLink, setInviteLink] = useState('');

  // Mock data - in a real app this would come from props or API
  const channelStats = {
    totalMessages: 1247,
    totalMembers: 23,
    createdDate: '2024-01-15',
    lastActivity: '2 minutes ago',
    pinnedMessages: 3,
    sharedFiles: 45,
    sharedImages: 128,
    voiceMinutes: 340
  };

  const recentActivity = [
    { id: 1, type: 'join', user: 'Alice Cooper', time: '2 hours ago', avatar: '👩‍💼' },
    { id: 2, type: 'message', user: 'Bob Wilson', time: '3 hours ago', avatar: '👨‍💻' },
    { id: 3, type: 'file', user: 'Carol Smith', time: '5 hours ago', avatar: '👩‍🎨' },
    { id: 4, type: 'pin', user: 'David Kim', time: '1 day ago', avatar: '👨‍🎨' }
  ];

  const pinnedMessages = [
    {
      id: 1,
      content: `Welcome to #${channel.name}! Please read the channel guidelines.`,
      author: 'Alex Chen',
      avatar: '👨‍💻',
      timestamp: '2024-01-15T10:00:00Z'
    },
    {
      id: 2,
      content: 'Important: New project deadline is next Friday!',
      author: 'Sarah Wilson',
      avatar: '👩‍🎨',
      timestamp: '2024-01-20T14:30:00Z'
    },
    {
      id: 3,
      content: 'Meeting notes from today\'s standup are now available.',
      author: 'Mike Johnson',
      avatar: '🧑‍🚀',
      timestamp: '2024-01-22T09:15:00Z'
    }
  ];

  const channelMembers = [
    { id: 1, name: 'Alex Chen', avatar: '👨‍💻', role: 'admin', status: 'online', joinDate: '2024-01-15' },
    { id: 2, name: 'Sarah Wilson', avatar: '👩‍🎨', role: 'moderator', status: 'online', joinDate: '2024-01-16' },
    { id: 3, name: 'Mike Johnson', avatar: '🧑‍🚀', role: 'member', status: 'away', joinDate: '2024-01-17' },
    { id: 4, name: 'Emma Davis', avatar: '👩‍💼', role: 'member', status: 'online', joinDate: '2024-01-18' },
    { id: 5, name: 'James Brown', avatar: '👨‍🔬', role: 'member', status: 'offline', joinDate: '2024-01-19' },
    { id: 6, name: 'Lisa Wang', avatar: '👩‍🔬', role: 'member', status: 'online', joinDate: '2024-01-20' }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'activity', label: 'Activity', icon: Activity }
  ];

  const handleSettingChange = (key, value) => {
    setChannelSettings(prev => ({ ...prev, [key]: value }));
    
    toast({
      title: "Setting Updated",
      description: `${key.replace(/([A-Z])/g, ' $1').toLowerCase()} has been ${value ? 'enabled' : 'disabled'}`
    });
  };

  const generateInviteLink = () => {
    const link = `https://securechat.app/invite/${channel.id}/${Math.random().toString(36).substr(2, 9)}`;
    setInviteLink(link);
    setShowInviteModal(true);
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast({
      title: "Invite Link Copied! 📋",
      description: "Share this link to invite people to the channel"
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <Crown className="w-3 h-3 text-yellow-500" />;
      case 'moderator': return <Shield className="w-3 h-3 text-blue-500" />;
      default: return null;
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'join': return <UserPlus className="w-4 h-4 text-green-500" />;
      case 'message': return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'file': return <FileText className="w-4 h-4 text-purple-500" />;
      case 'pin': return <Pin className="w-4 h-4 text-yellow-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Channel Header */}
      <div className="text-center pb-6 border-b border-border">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-4xl mx-auto mb-4 shadow-lg">
          {channel.icon}
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">#{channel.name}</h2>
        <p className="text-muted-foreground mb-4">{channel.description || 'No description available'}</p>
        
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{channelStats.totalMembers} members</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Created {formatDate(channelStats.createdDate)}</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted/30 rounded-lg p-4 text-center">
          <MessageSquare className="w-8 h-8 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">{channelStats.totalMessages.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Messages</div>
        </div>
        <div className="bg-muted/30 rounded-lg p-4 text-center">
          <Pin className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">{channelStats.pinnedMessages}</div>
          <div className="text-sm text-muted-foreground">Pinned</div>
        </div>
        <div className="bg-muted/30 rounded-lg p-4 text-center">
          <Image className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">{channelStats.sharedImages}</div>
          <div className="text-sm text-muted-foreground">Images</div>
        </div>
        <div className="bg-muted/30 rounded-lg p-4 text-center">
          <FileText className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">{channelStats.sharedFiles}</div>
          <div className="text-sm text-muted-foreground">Files</div>
        </div>
      </div>

      {/* Pinned Messages */}
      {pinnedMessages.length > 0 && (
        <div>
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Pin className="w-4 h-4 text-yellow-500" />
            Pinned Messages
          </h3>
          <div className="space-y-3">
            {pinnedMessages.map((message) => (
              <div key={message.id} className="bg-muted/30 rounded-lg p-3 border border-border/50">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm">
                    {message.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground text-sm">{message.author}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(message.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={generateInviteLink}
        >
          <UserPlus className="w-4 h-4" />
          Invite People
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => {
            navigator.clipboard.writeText(`#${channel.name}`);
            toast({
              title: "Channel Name Copied! 📋",
              description: "Channel name copied to clipboard"
            });
          }}
        >
          <Copy className="w-4 h-4" />
          Copy Name
        </Button>
      </div>
    </div>
  );

  const renderMembersTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Members ({channelMembers.length})</h3>
        <Button size="sm" onClick={generateInviteLink}>
          <UserPlus className="w-4 h-4 mr-2" />
          Invite
        </Button>
      </div>

      <div className="space-y-2">
        {channelMembers.map((member) => (
          <div key={member.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-lg">
                  {member.avatar}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-card ${getStatusColor(member.status)}`} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{member.name}</span>
                  {getRoleIcon(member.role)}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="capitalize">{member.role}</span>
                  <span>•</span>
                  <span>Joined {formatDate(member.joinDate)}</span>
                </div>
              </div>
            </div>
            
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <h3 className="font-semibold text-foreground">Channel Settings</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">Notifications</Label>
            <p className="text-sm text-muted-foreground">Receive notifications for new messages</p>
          </div>
          <Switch
            checked={channelSettings.notifications}
            onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">Sound Notifications</Label>
            <p className="text-sm text-muted-foreground">Play sound for notifications</p>
          </div>
          <Switch
            checked={channelSettings.soundEnabled}
            onCheckedChange={(checked) => handleSettingChange('soundEnabled', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">Message Previews</Label>
            <p className="text-sm text-muted-foreground">Show message content in notifications</p>
          </div>
          <Switch
            checked={channelSettings.showPreviews}
            onCheckedChange={(checked) => handleSettingChange('showPreviews', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">Auto-join Voice Chats</Label>
            <p className="text-sm text-muted-foreground">Automatically join voice discussions</p>
          </div>
          <Switch
            checked={channelSettings.autoJoin}
            onCheckedChange={(checked) => handleSettingChange('autoJoin', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">Pin to Sidebar</Label>
            <p className="text-sm text-muted-foreground">Keep this channel at the top</p>
          </div>
          <Switch
            checked={channelSettings.pinned}
            onCheckedChange={(checked) => handleSettingChange('pinned', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">Mute Channel</Label>
            <p className="text-sm text-muted-foreground">Disable all notifications</p>
          </div>
          <Switch
            checked={channelSettings.muted}
            onCheckedChange={(checked) => handleSettingChange('muted', checked)}
          />
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <h4 className="font-medium text-foreground mb-3">Channel Actions</h4>
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start">
            <Download className="w-4 h-4 mr-2" />
            Export Chat History
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Archive className="w-4 h-4 mr-2" />
            Archive Channel
          </Button>
          <Button variant="outline" className="w-full justify-start text-destructive">
            <Flag className="w-4 h-4 mr-2" />
            Report Channel
          </Button>
          <Button variant="destructive" className="w-full justify-start">
            <UserMinus className="w-4 h-4 mr-2" />
            Leave Channel
          </Button>
        </div>
      </div>
    </div>
  );

  const renderActivityTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Recent Activity</h3>
        <div className="text-sm text-muted-foreground">Last updated: {channelStats.lastActivity}</div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-muted/30 rounded-lg p-3 text-center">
          <TrendingUp className="w-6 h-6 text-green-500 mx-auto mb-1" />
          <div className="text-lg font-bold text-foreground">+12</div>
          <div className="text-xs text-muted-foreground">Messages today</div>
        </div>
        <div className="bg-muted/30 rounded-lg p-3 text-center">
          <BarChart3 className="w-6 h-6 text-blue-500 mx-auto mb-1" />
          <div className="text-lg font-bold text-foreground">85%</div>
          <div className="text-xs text-muted-foreground">Active members</div>
        </div>
      </div>

      <div className="space-y-3">
        {recentActivity.map((activity) => (
          <div key={activity.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm">
              {activity.avatar}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                {getActivityIcon(activity.type)}
                <span className="text-sm font-medium text-foreground">{activity.user}</span>
                <span className="text-sm text-muted-foreground">
                  {activity.type === 'join' && 'joined the channel'}
                  {activity.type === 'message' && 'sent a message'}
                  {activity.type === 'file' && 'shared a file'}
                  {activity.type === 'pin' && 'pinned a message'}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">{activity.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, x: 300 }}
          animate={{ scale: 1, opacity: 1, x: 0 }}
          exit={{ scale: 0.9, opacity: 0, x: 300 }}
          className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-lg">
                {channel.icon}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">#{channel.name}</h2>
                <p className="text-sm text-muted-foreground">Channel Information</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border bg-muted/20">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-primary border-b-2 border-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'overview' && renderOverviewTab()}
                {activeTab === 'members' && renderMembersTab()}
                {activeTab === 'settings' && renderSettingsTab()}
                {activeTab === 'activity' && renderActivityTab()}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-border rounded-lg w-full max-w-md"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="text-lg font-semibold">Invite to #{channel.name}</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowInviteModal(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="p-4 space-y-4">
                <div>
                  <Label>Invite Link</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={inviteLink}
                      readOnly
                      className="flex-1"
                    />
                    <Button onClick={copyInviteLink}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Share this link to invite people to the channel. The link expires in 7 days.
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setShowInviteModal(false)}>
                    Close
                  </Button>
                  <Button className="flex-1" onClick={() => {
                    copyInviteLink();
                    setShowInviteModal(false);
                  }}>
                    <Share className="w-4 h-4 mr-2" />
                    Share Link
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
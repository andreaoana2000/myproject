import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from '@/components/ui/use-toast';
import ProfileEditor from '@/components/settings/ProfileEditor';
import { 
  Shield, 
  Bell, 
  Palette, 
  Clock, 
  Eye, 
  Lock, 
  Trash2,
  Download,
  Upload,
  LogOut,
  Edit,
  AlertTriangle
} from 'lucide-react';

export default function Settings() {
  const { user, logout, updateUser } = useAuth();
  const { currentTheme, themes, switchTheme } = useTheme();
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [settings, setSettings] = useState({
    autoDelete: true,
    deleteTimer: 5,
    readReceipts: true,
    typingIndicators: true,
    locationSharing: false,
    notifications: true,
    soundEnabled: true,
    encryptionEnabled: true
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast({
      title: "Setting Updated",
      description: `${key} has been ${value ? 'enabled' : 'disabled'}`
    });
  };

  const handleDeleteTimerChange = (value) => {
    setSettings(prev => ({ ...prev, deleteTimer: value[0] }));
  };

  const handleExportData = () => {
    try {
      const data = {
        user: user,
        chats: JSON.parse(localStorage.getItem('securechat-chats') || '[]'),
        contacts: JSON.parse(localStorage.getItem('securechat-contacts') || '[]'),
        statuses: JSON.parse(localStorage.getItem('securechat-statuses') || '[]'),
        channels: JSON.parse(localStorage.getItem('securechat-channels') || '[]'),
        settings: settings,
        exportDate: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `securechat-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Data Exported! 📦",
        description: "Your SecureChat data has been exported successfully"
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          
          // Validate data structure
          if (!data.user || !data.exportDate) {
            throw new Error('Invalid backup file');
          }

          // Import data
          if (data.chats) localStorage.setItem('securechat-chats', JSON.stringify(data.chats));
          if (data.contacts) localStorage.setItem('securechat-contacts', JSON.stringify(data.contacts));
          if (data.statuses) localStorage.setItem('securechat-statuses', JSON.stringify(data.statuses));
          if (data.channels) localStorage.setItem('securechat-channels', JSON.stringify(data.channels));
          
          toast({
            title: "Data Imported! 📥",
            description: "Your SecureChat data has been imported successfully. Please refresh the page."
          });
        } catch (error) {
          toast({
            title: "Import Failed",
            description: "Invalid backup file or corrupted data",
            variant: "destructive"
          });
        }
      };
      reader.readAsText(file);
    };

    input.click();
  };

  const handleDeleteAccount = () => {
    // Clear all user data
    localStorage.removeItem('securechat-user');
    localStorage.removeItem('securechat-chats');
    localStorage.removeItem('securechat-contacts');
    localStorage.removeItem('securechat-statuses');
    localStorage.removeItem('securechat-channels');
    localStorage.removeItem('securechat-notification-settings');
    
    // Clear any other app-specific data
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('securechat-')) {
        localStorage.removeItem(key);
      }
    });

    toast({
      title: "Account Deleted! 🗑️",
      description: "Your account and all data have been permanently deleted"
    });

    // Log out the user
    logout();
  };

  return (
    <div className="h-full overflow-y-auto bg-background">
      <div className="max-w-2xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your privacy and preferences</p>
        </div>

        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Profile
          </h2>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl">
              {user?.avatar}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{user?.username}</h3>
              <p className="text-sm text-muted-foreground">ID: {user?.id}</p>
              {user?.bio && (
                <p className="text-sm text-muted-foreground mt-1">{user.bio}</p>
              )}
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-2 h-2 rounded-full ${
                  user?.status === 'online' ? 'bg-green-500' :
                  user?.status === 'away' ? 'bg-yellow-500' :
                  user?.status === 'busy' ? 'bg-red-500' : 'bg-gray-500'
                }`} />
                <span className="text-xs text-muted-foreground capitalize">
                  {user?.status || 'online'}
                </span>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => setShowProfileEditor(true)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </motion.div>

        {/* Privacy & Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Privacy & Security
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">End-to-End Encryption</Label>
                <p className="text-sm text-muted-foreground">Encrypt all messages and files</p>
              </div>
              <Switch
                checked={settings.encryptionEnabled}
                onCheckedChange={(checked) => handleSettingChange('encryptionEnabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Auto-Delete Messages</Label>
                <p className="text-sm text-muted-foreground">Automatically delete messages after reading</p>
              </div>
              <Switch
                checked={settings.autoDelete}
                onCheckedChange={(checked) => handleSettingChange('autoDelete', checked)}
              />
            </div>

            {settings.autoDelete && (
              <div>
                <Label className="text-base mb-3 block">Delete Timer: {settings.deleteTimer} seconds</Label>
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
                <Label className="text-base">Read Receipts</Label>
                <p className="text-sm text-muted-foreground">Let others know when you've read their messages</p>
              </div>
              <Switch
                checked={settings.readReceipts}
                onCheckedChange={(checked) => handleSettingChange('readReceipts', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Typing Indicators</Label>
                <p className="text-sm text-muted-foreground">Show when you're typing</p>
              </div>
              <Switch
                checked={settings.typingIndicators}
                onCheckedChange={(checked) => handleSettingChange('typingIndicators', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Location Sharing</Label>
                <p className="text-sm text-muted-foreground">Allow sharing your location</p>
              </div>
              <Switch
                checked={settings.locationSharing}
                onCheckedChange={(checked) => handleSettingChange('locationSharing', checked)}
              />
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications for new messages</p>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Sound Effects</Label>
                <p className="text-sm text-muted-foreground">Play sounds for notifications</p>
              </div>
              <Switch
                checked={settings.soundEnabled}
                onCheckedChange={(checked) => handleSettingChange('soundEnabled', checked)}
              />
            </div>
          </div>
        </motion.div>

        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Appearance
          </h2>
          
          <div className="space-y-4">
            <div>
              <Label className="text-base mb-3 block">Theme</Label>
              <div className="grid grid-cols-1 gap-3">
                {Object.entries(themes).map(([key, theme]) => (
                  <Button
                    key={key}
                    variant={currentTheme === key ? "default" : "outline"}
                    className="justify-start h-auto p-3"
                    onClick={() => switchTheme(key)}
                  >
                    <span className="text-lg mr-3">{theme.icon}</span>
                    <span>{theme.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Data Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Data Management
          </h2>
          
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start" onClick={handleExportData}>
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            
            <Button variant="outline" className="w-full justify-start" onClick={handleImportData}>
              <Upload className="w-4 h-4 mr-2" />
              Import Data
            </Button>
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-destructive/20 rounded-lg p-6"
        >
          <h2 className="text-lg font-semibold text-destructive mb-4 flex items-center gap-2">
            <Trash2 className="w-5 h-5" />
            Danger Zone
          </h2>
          
          <div className="space-y-4">
            <Button variant="outline" className="w-full justify-start" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
            
            {!showDeleteConfirm ? (
              <Button 
                variant="destructive" 
                className="w-full justify-start" 
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            ) : (
              <div className="space-y-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                  <div>
                    <Label className="text-base text-destructive">Are you absolutely sure?</Label>
                    <p className="text-sm text-muted-foreground">
                      This action cannot be undone. This will permanently delete your account 
                      and all your data including messages, contacts, and settings.
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
                    onClick={handleDeleteAccount}
                  >
                    Yes, delete my account
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Profile Editor Modal */}
        <ProfileEditor
          isOpen={showProfileEditor}
          onClose={() => setShowProfileEditor(false)}
        />
      </div>
    </div>
  );
}
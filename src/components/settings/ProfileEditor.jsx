
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';
import { X, Camera, Save } from 'lucide-react';

const avatarOptions = ['👤', '👩‍💼', '👨‍💻', '👩‍🎨', '👨‍🔬', '👩‍⚕️', '👨‍🎓', '👩‍🚀', '🦸‍♂️', '🦸‍♀️', '👨‍🎤', '👩‍🎤', '👨‍🍳', '👩‍🍳', '👨‍🌾', '👩‍🌾'];

export default function ProfileEditor({ isOpen, onClose }) {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    username: user?.username || '',
    avatar: user?.avatar || '👤',
    bio: user?.bio || '',
    status: user?.status || 'online'
  });

  const statusOptions = [
    { value: 'online', label: 'Online', color: 'bg-green-500' },
    { value: 'away', label: 'Away', color: 'bg-yellow-500' },
    { value: 'busy', label: 'Busy', color: 'bg-red-500' },
    { value: 'offline', label: 'Offline', color: 'bg-gray-500' }
  ];

  const handleSave = () => {
    if (!formData.username.trim()) {
      toast({
        title: "Username Required",
        description: "Please enter a username",
        variant: "destructive"
      });
      return;
    }

    updateUser(formData);
    toast({
      title: "Profile Updated! 🎉",
      description: "Your profile has been saved successfully"
    });
    onClose();
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
        className="bg-card border border-border rounded-lg w-full max-w-md"
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-semibold">Edit Profile</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-4 space-y-4">
          {/* Avatar Selection */}
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-3xl mx-auto mb-3">
              {formData.avatar}
            </div>
            <Label>Choose Avatar</Label>
            <div className="grid grid-cols-8 gap-2 mt-2">
              {avatarOptions.map((avatar) => (
                <button
                  key={avatar}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm transition-colors ${
                    formData.avatar === avatar ? 'border-primary bg-primary/20' : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, avatar }))}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          {/* Username */}
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              placeholder="Enter your username"
            />
          </div>

          {/* Bio */}
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Input
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell us about yourself..."
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formData.bio.length}/100 characters
            </p>
          </div>

          {/* Status */}
          <div>
            <Label>Status</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {statusOptions.map((status) => (
                <Button
                  key={status.value}
                  variant={formData.status === status.value ? "default" : "outline"}
                  size="sm"
                  className="justify-start"
                  onClick={() => setFormData(prev => ({ ...prev, status: status.value }))}
                >
                  <div className={`w-2 h-2 rounded-full ${status.color} mr-2`} />
                  {status.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}


import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { X, Hash } from 'lucide-react';

export default function ChannelCreator({ isOpen, onClose, onCreateChannel }) {
  const [channelData, setChannelData] = useState({
    name: '',
    description: '',
    icon: '📢',
    isPrivate: false
  });

  const channelIcons = ['📢', '💻', '🎨', '🚀', '🔬', '💰', '🎵', '🎮', '📚', '🍕'];

  const handleCreate = () => {
    if (!channelData.name.trim()) {
      toast({
        title: "Channel Name Required",
        description: "Please enter a name for your channel",
        variant: "destructive"
      });
      return;
    }

    const newChannel = {
      id: Date.now(),
      ...channelData,
      members: 1,
      createdAt: new Date().toISOString(),
      subscribed: true,
      unreadCount: 0
    };

    onCreateChannel(newChannel);
    setChannelData({ name: '', description: '', icon: '📢', isPrivate: false });
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
          <h3 className="text-lg font-semibold">Create Channel</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <Label htmlFor="channelName">Channel Name</Label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="channelName"
                placeholder="awesome-channel"
                value={channelData.name}
                onChange={(e) => setChannelData(prev => ({ ...prev, name: e.target.value }))}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="channelDescription">Description</Label>
            <Input
              id="channelDescription"
              placeholder="What's this channel about?"
              value={channelData.description}
              onChange={(e) => setChannelData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div>
            <Label>Channel Icon</Label>
            <div className="grid grid-cols-5 gap-2 mt-2">
              {channelIcons.map((icon) => (
                <button
                  key={icon}
                  className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-lg transition-colors ${
                    channelData.icon === icon ? 'border-primary bg-primary/20' : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setChannelData(prev => ({ ...prev, icon }))}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleCreate}>
              Create Channel
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

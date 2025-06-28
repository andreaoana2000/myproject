
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { 
  ArrowLeft, 
  Hash, 
  Users, 
  Settings, 
  Pin, 
  Search,
  Bell,
  BellOff,
  Volume2,
  VolumeX
} from 'lucide-react';

export default function ChannelHeader({ 
  channel, 
  channelMembers, 
  pinnedMessages, 
  channelMuted, 
  notifications,
  showSearch,
  onBack,
  onToggleSearch,
  onToggleNotifications,
  onToggleMute,
  onToggleMembers
}) {
  return (
    <div className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-lg shadow-lg">
          {channel.icon}
        </div>
        
        <div>
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {channel.name}
            </h2>
            {channelMuted && <VolumeX className="w-4 h-4 text-muted-foreground" />}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-3 h-3" />
            <span className="font-medium">{channelMembers.length} members</span>
            {pinnedMessages.length > 0 && (
              <>
                <span>•</span>
                <Pin className="w-3 h-3" />
                <span className="font-medium">{pinnedMessages.length} pinned</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSearch}
          className={`transition-all duration-200 ${showSearch ? 'bg-primary/20 text-primary' : 'hover:bg-accent'}`}
        >
          <Search className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleNotifications}
          className={`transition-all duration-200 ${notifications ? 'text-primary' : 'text-muted-foreground'}`}
        >
          {notifications ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleMute}
          className={`transition-all duration-200 ${channelMuted ? 'text-destructive' : 'text-foreground'}`}
        >
          {channelMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleMembers}
          className="transition-all duration-200 hover:bg-accent"
        >
          <Users className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => toast({
            title: "🚧 Channel Settings",
            description: "Channel settings aren't implemented yet—but don't worry! You can request them in your next prompt! 🚀"
          })}
          className="transition-all duration-200 hover:bg-accent"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

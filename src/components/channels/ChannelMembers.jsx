
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { UserPlus, MoreVertical, Star } from 'lucide-react';

export default function ChannelMembers({ members, showMembers }) {
  if (!showMembers) return null;

  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 280, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      className="border-l border-border bg-gradient-to-b from-card/40 to-card/20 backdrop-blur-sm overflow-hidden"
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-foreground bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Members ({members.length})
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toast({
              title: "🚧 Invite Members",
              description: "Member invitations aren't implemented yet—but don't worry! You can request them in your next prompt! 🚀"
            })}
            className="hover:bg-primary/20 transition-all duration-200"
          >
            <UserPlus className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {members.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-all duration-200 cursor-pointer group"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-sm shadow-lg">
                  {member.avatar}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-card shadow-sm ${
                  member.status === 'online' ? 'bg-green-500' :
                  member.status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'
                }`} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {member.name}
                  </span>
                  {member.role === 'admin' && (
                    <Star className="w-3 h-3 text-yellow-500" />
                  )}
                </div>
                <span className="text-xs text-muted-foreground capitalize font-medium">
                  {member.status}
                </span>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-all duration-200"
                onClick={() => toast({
                  title: "🚧 Member Options",
                  description: "Member management isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
                })}
              >
                <MoreVertical className="w-3 h-3" />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

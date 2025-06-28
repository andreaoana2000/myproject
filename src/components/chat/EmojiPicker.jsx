
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const emojiCategories = {
  'Smileys': ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩'],
  'Gestures': ['👍', '👎', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👋', '🤚', '🖐️', '✋', '🖖', '👏', '🙌', '🤲', '🤝', '🙏'],
  'Hearts': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟'],
  'Objects': ['🎉', '🎊', '🎈', '🎁', '🏆', '🥇', '🥈', '🥉', '⭐', '🌟', '💫', '✨', '🔥', '💯', '💢', '💥', '💨', '💦', '💤']
};

export default function EmojiPicker({ onEmojiSelect }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-card border border-border rounded-lg shadow-lg p-3 w-80 max-h-64 overflow-y-auto"
    >
      {Object.entries(emojiCategories).map(([category, emojis]) => (
        <div key={category} className="mb-3">
          <h4 className="text-xs font-medium text-muted-foreground mb-2">{category}</h4>
          <div className="grid grid-cols-8 gap-1">
            {emojis.map((emoji, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-8 h-8 p-0 text-lg hover:bg-accent"
                onClick={() => onEmojiSelect(emoji)}
              >
                {emoji}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
}

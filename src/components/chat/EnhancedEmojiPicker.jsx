import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Clock, Heart, Smile, Users, Car, Book as Food, Activity, Flag } from 'lucide-react';

const emojiCategories = {
  recent: {
    name: 'Recently Used',
    icon: Clock,
    emojis: []
  },
  smileys: {
    name: 'Smileys & People',
    icon: Smile,
    emojis: [
      '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', 
      '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏',
      '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠',
      '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥',
      '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐'
    ]
  },
  gestures: {
    name: 'Gestures',
    icon: Users,
    emojis: [
      '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆',
      '🖕', '👇', '☝️', '👍', '👎', '👊', '✊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️',
      '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀'
    ]
  },
  hearts: {
    name: 'Hearts & Love',
    icon: Heart,
    emojis: [
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖',
      '💘', '💝', '💟', '♥️', '💌', '💋', '💍', '💎', '👑', '🌹', '🌺', '🌸', '🌼', '🌻', '🌷', '💐'
    ]
  },
  activities: {
    name: 'Activities',
    icon: Activity,
    emojis: [
      '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍',
      '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛷', '⛸️', '🥌', '🎿',
      '⛷️', '🏂', '🪂', '🏋️', '🤼', '🤸', '⛹️', '🤺', '🤾', '🏌️', '🏇', '🧘', '🏄', '🏊', '🤽', '🚣'
    ]
  },
  food: {
    name: 'Food & Drink',
    icon: Food,
    emojis: [
      '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝',
      '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐',
      '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭'
    ]
  },
  travel: {
    name: 'Travel & Places',
    icon: Car,
    emojis: [
      '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🏍️', '🛵',
      '🚲', '🛴', '🛹', '🛼', '🚁', '🛸', '🚀', '✈️', '🛩️', '🛫', '🛬', '🪂', '⛵', '🚤', '🛥️', '🛳️',
      '⛴️', '🚢', '⚓', '⛽', '🚧', '🚦', '🚥', '🗺️', '🗿', '🗽', '🗼', '🏰', '🏯', '🏟️', '🎡', '🎢'
    ]
  },
  flags: {
    name: 'Flags',
    icon: Flag,
    emojis: [
      '🏁', '🚩', '🎌', '🏴', '🏳️', '🏳️‍🌈', '🏳️‍⚧️', '🏴‍☠️', '🇦🇫', '🇦🇱', '🇩🇿', '🇦🇸', '🇦🇩', '🇦🇴', '🇦🇮', '🇦🇶',
      '🇦🇬', '🇦🇷', '🇦🇲', '🇦🇼', '🇦🇺', '🇦🇹', '🇦🇿', '🇧🇸', '🇧🇭', '🇧🇩', '🇧🇧', '🇧🇾', '🇧🇪', '🇧🇿', '🇧🇯', '🇧🇲'
    ]
  }
};

export default function EnhancedEmojiPicker({ onEmojiSelect, onClose }) {
  const [activeCategory, setActiveCategory] = useState('smileys');
  const [searchQuery, setSearchQuery] = useState('');
  const [recentEmojis, setRecentEmojis] = useState(() => {
    const saved = localStorage.getItem('securechat-recent-emojis');
    return saved ? JSON.parse(saved) : [];
  });

  const filteredEmojis = useMemo(() => {
    if (!searchQuery) {
      return activeCategory === 'recent' 
        ? recentEmojis 
        : emojiCategories[activeCategory]?.emojis || [];
    }

    // Search across all categories
    const allEmojis = Object.values(emojiCategories)
      .flatMap(category => category.emojis || []);
    
    return allEmojis.filter(emoji => {
      // Simple emoji search - in a real app, you'd have emoji names/keywords
      return emoji.includes(searchQuery);
    });
  }, [activeCategory, searchQuery, recentEmojis]);

  const handleEmojiClick = (emoji) => {
    // Add to recent emojis
    const newRecent = [emoji, ...recentEmojis.filter(e => e !== emoji)].slice(0, 24);
    setRecentEmojis(newRecent);
    localStorage.setItem('securechat-recent-emojis', JSON.stringify(newRecent));
    
    onEmojiSelect(emoji);
  };

  const skinToneVariants = ['🏻', '🏼', '🏽', '🏾', '🏿'];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      className="bg-card border border-border rounded-lg shadow-xl w-80 h-96 flex flex-col overflow-hidden z-[9999] relative"
      style={{
        position: 'fixed',
        zIndex: 9999
      }}
    >
      {/* Header with search */}
      <div className="p-3 border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search emojis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-8 bg-background/50"
          />
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex border-b border-border bg-muted/30">
        {Object.entries(emojiCategories).map(([key, category]) => {
          const Icon = category.icon;
          return (
            <Button
              key={key}
              variant={activeCategory === key ? "default" : "ghost"}
              size="sm"
              className="flex-1 rounded-none h-10"
              onClick={() => setActiveCategory(key)}
              disabled={key === 'recent' && recentEmojis.length === 0}
            >
              <Icon className="w-4 h-4" />
            </Button>
          );
        })}
      </div>

      {/* Emoji grid */}
      <div className="flex-1 overflow-y-auto p-2">
        {searchQuery && (
          <div className="mb-2">
            <p className="text-xs text-muted-foreground px-2">
              Search results for "{searchQuery}"
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-8 gap-1">
          {filteredEmojis.map((emoji, index) => (
            <motion.button
              key={`${emoji}-${index}`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 flex items-center justify-center text-lg hover:bg-accent rounded transition-colors"
              onClick={() => handleEmojiClick(emoji)}
              style={{
                fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Twemoji Mozilla", "EmojiOne Color", "Android Emoji", sans-serif',
                fontVariantEmoji: 'emoji',
                textRendering: 'optimizeQuality'
              }}
            >
              {emoji}
            </motion.button>
          ))}
        </div>

        {filteredEmojis.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-sm">
              {searchQuery ? 'No emojis found' : 'No recent emojis'}
            </p>
          </div>
        )}
      </div>

      {/* Skin tone selector for applicable emojis */}
      <div className="p-2 border-t border-border bg-muted/30">
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground mr-2">Skin tone:</span>
          <Button
            variant="ghost"
            size="sm"
            className="w-6 h-6 p-0 text-lg"
            onClick={() => handleEmojiClick('👋')}
            style={{
              fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Twemoji Mozilla", "EmojiOne Color", "Android Emoji", sans-serif',
              fontVariantEmoji: 'emoji',
              textRendering: 'optimizeQuality'
            }}
          >
            👋
          </Button>
          {skinToneVariants.map((tone, index) => (
            <Button
              key={tone}
              variant="ghost"
              size="sm"
              className="w-6 h-6 p-0 text-lg"
              onClick={() => handleEmojiClick(`👋${tone}`)}
              style={{
                fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Twemoji Mozilla", "EmojiOne Color", "Android Emoji", sans-serif',
                fontVariantEmoji: 'emoji',
                textRendering: 'optimizeQuality'
              }}
            >
              👋{tone}
            </Button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
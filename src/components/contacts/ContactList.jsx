import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';
import ContactManager from '@/components/contacts/ContactManager';
import VoiceCallManager from '@/components/voice/VoiceCallManager';
import { 
  MessageCircle, 
  Phone, 
  Video, 
  MoreHorizontal, 
  Search,
  UserPlus,
  Settings
} from 'lucide-react';

export default function ContactList() {
  const { contacts, createChat, chats, addContact, updateContact, deleteContact, favoriteContact } = useChat();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showContactManager, setShowContactManager] = useState(false);
  const [showVoiceCall, setShowVoiceCall] = useState(false);
  const [voiceCallContact, setVoiceCallContact] = useState(null);
  const [isVoiceCallMinimized, setIsVoiceCallMinimized] = useState(false);

  const filteredContacts = contacts.filter(contact =>
    contact.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartChat = (contactId) => {
    const existingChat = chats.find(chat => 
      chat.participants.includes(contactId) && chat.participants.includes(user.id)
    );
    
    if (existingChat) {
      createChat(contactId);
    } else {
      createChat(contactId);
    }
  };

  const handleVoiceCall = (contact) => {
    setVoiceCallContact(contact);
    setShowVoiceCall(true);
    setIsVoiceCallMinimized(false);
  };

  const handleVideoCall = (contact) => {
    toast({
      title: "Video Call Started",
      description: `Starting video call with ${contact.username}...`
    });
  };

  const handleAddContact = (contact) => {
    return addContact(contact);
  };

  const handleEditContact = (contactId, updates) => {
    updateContact(contactId, updates);
  };

  const handleDeleteContact = (contactId) => {
    deleteContact(contactId);
  };

  const handleBlockContact = (contactId) => {
    const contact = contacts.find(c => c.id === contactId);
    if (contact) {
      updateContact(contactId, { isBlocked: !contact.isBlocked });
    }
  };

  const handleFavoriteContact = (contactId) => {
    favoriteContact(contactId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatLastSeen = (lastSeen) => {
    const now = new Date();
    const lastSeenDate = new Date(lastSeen);
    const diffMs = now - lastSeenDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Contacts</h1>
            <p className="text-muted-foreground">Start a secure conversation</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowContactManager(true)}
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button onClick={() => setShowContactManager(true)}>
              <UserPlus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredContacts.map((contact, index) => (
          <motion.div
            key={contact.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-card border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors ${
              contact.isBlocked ? 'opacity-50' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-xl">
                    {contact.avatar}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card ${getStatusColor(contact.status)}`} />
                  {contact.isFavorite && (
                    <div className="absolute -top-1 -left-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                      ⭐
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    {contact.username}
                    {contact.isBlocked && (
                      <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">Blocked</span>
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {contact.status === 'online' ? 'Online' : formatLastSeen(contact.lastSeen)}
                  </p>
                  {contact.email && (
                    <p className="text-xs text-muted-foreground">{contact.email}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-8 h-8" 
                  onClick={() => handleStartChat(contact.id)}
                  disabled={contact.isBlocked}
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-8 h-8" 
                  onClick={() => handleVoiceCall(contact)}
                  disabled={contact.isBlocked}
                >
                  <Phone className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-8 h-8" 
                  onClick={() => handleVideoCall(contact)}
                  disabled={contact.isBlocked}
                >
                  <Video className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-8 h-8" 
                  onClick={() => setShowContactManager(true)}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredContacts.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <UserPlus className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Contacts Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'Try adjusting your search' : 'Add some contacts to get started'}
            </p>
            <Button onClick={() => setShowContactManager(true)}>
              <UserPlus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className="p-4 border-t border-border">
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
          <p className="text-sm text-foreground">
            🔒 All conversations are protected with end-to-end encryption
          </p>
        </div>
      </div>

      {/* Contact Manager Modal */}
      {showContactManager && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-semibold">Contact Management</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowContactManager(false)}>
                ✕
              </Button>
            </div>
            <div className="p-4">
              <ContactManager
                contacts={contacts}
                onAddContact={handleAddContact}
                onEditContact={handleEditContact}
                onDeleteContact={handleDeleteContact}
                onBlockContact={handleBlockContact}
                onFavoriteContact={handleFavoriteContact}
              />
            </div>
          </div>
        </div>
      )}

      {/* Voice Call Interface */}
      {showVoiceCall && voiceCallContact && (
        <VoiceCallManager
          contact={voiceCallContact}
          onEnd={() => {
            setShowVoiceCall(false);
            setVoiceCallContact(null);
            setIsVoiceCallMinimized(false);
          }}
          isMinimized={isVoiceCallMinimized}
          onToggleMinimize={() => setIsVoiceCallMinimized(!isVoiceCallMinimized)}
        />
      )}
    </div>
  );
}
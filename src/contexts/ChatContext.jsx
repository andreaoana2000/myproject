import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { encryptMessage, decryptMessage } from '@/lib/encryption';
import { toast } from '@/components/ui/use-toast';

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const [deletingMessages, setDeletingMessages] = useState(new Set());
  const deleteTimeoutsRef = useRef(new Map()); // Track deletion timeouts
  const savingRef = useRef(false); // Prevent concurrent saves

  useEffect(() => {
    if (user) {
      loadChats();
      loadContacts();
    }
  }, [user]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      deleteTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      deleteTimeoutsRef.current.clear();
    };
  }, []);

  const loadChats = () => {
    try {
      const savedChats = localStorage.getItem('securechat-chats');
      if (savedChats) {
        const parsedChats = JSON.parse(savedChats);
        setChats(Array.isArray(parsedChats) ? parsedChats : []);
      }
    } catch (error) {
      console.error('Error loading chats:', error);
      setChats([]);
    }
  };

  const loadContacts = () => {
    try {
      const savedContacts = localStorage.getItem('securechat-contacts');
      if (savedContacts) {
        const parsedContacts = JSON.parse(savedContacts);
        setContacts(Array.isArray(parsedContacts) ? parsedContacts : []);
      } else {
        // Initialize with some demo contacts
        const demoContacts = [
          {
            id: 'demo-1',
            username: 'Alice Cooper',
            avatar: '👩‍💼',
            status: 'online',
            lastSeen: new Date().toISOString(),
            publicKey: 'demo-key-1',
            email: 'alice@example.com',
            phone: '+1234567890',
            isFavorite: false,
            isBlocked: false
          },
          {
            id: 'demo-2',
            username: 'Bob Wilson',
            avatar: '👨‍💻',
            status: 'away',
            lastSeen: new Date(Date.now() - 300000).toISOString(),
            publicKey: 'demo-key-2',
            email: 'bob@example.com',
            phone: '+1234567891',
            isFavorite: true,
            isBlocked: false
          },
          {
            id: 'demo-3',
            username: 'Carol Smith',
            avatar: '👩‍🎨',
            status: 'offline',
            lastSeen: new Date(Date.now() - 3600000).toISOString(),
            publicKey: 'demo-key-3',
            email: 'carol@example.com',
            phone: '+1234567892',
            isFavorite: false,
            isBlocked: false
          }
        ];
        setContacts(demoContacts);
        localStorage.setItem('securechat-contacts', JSON.stringify(demoContacts));
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
      setContacts([]);
    }
  };

  const saveChats = (updatedChats) => {
    try {
      // Prevent concurrent saves that could cause race conditions
      if (savingRef.current) return;
      savingRef.current = true;
      
      localStorage.setItem('securechat-chats', JSON.stringify(updatedChats));
      
      // Small delay to prevent rapid successive saves
      setTimeout(() => {
        savingRef.current = false;
      }, 50);
    } catch (error) {
      console.error('Error saving chats:', error);
      savingRef.current = false;
    }
  };

  const saveContacts = (updatedContacts) => {
    try {
      localStorage.setItem('securechat-contacts', JSON.stringify(updatedContacts));
      setContacts(updatedContacts);
    } catch (error) {
      console.error('Error saving contacts:', error);
    }
  };

  const createChat = (contactId, type = 'private') => {
    if (!user) return null;

    const contact = contacts.find(c => c.id === contactId);
    if (!contact) return null;

    // Check if chat already exists
    const existingChat = chats.find(chat => 
      chat.participants && chat.participants.includes(contactId) && chat.participants.includes(user.id)
    );

    if (existingChat) {
      setActiveChat(existingChat);
      return existingChat;
    }

    const chatId = `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newChat = {
      id: chatId,
      type,
      participants: [user.id, contactId],
      messages: [],
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      settings: {
        autoDelete: true,
        deleteTimer: 5000,
        encryption: true
      }
    };

    const updatedChats = [...chats, newChat];
    setChats(updatedChats);
    saveChats(updatedChats);
    setActiveChat(newChat);
    
    return newChat;
  };

  const sendMessage = async (chatId, content, type = 'text', metadata = {}) => {
    if (!user || !chatId || !content) return;

    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;

    try {
      const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const message = {
        id: messageId,
        chatId,
        senderId: user.id,
        senderName: user.username,
        senderAvatar: user.avatar,
        content,
        type,
        metadata: metadata || {},
        timestamp: new Date().toISOString(),
        encrypted: true,
        read: false,
        autoDelete: chat.settings?.autoDelete || false,
        deleteTimer: chat.settings?.deleteTimer || 5000,
        reactions: [],
        isEdited: false,
        editHistory: []
      };

      // Update chats state immediately
      const updatedChats = chats.map(c => {
        if (c.id === chatId) {
          return {
            ...c,
            messages: [...(c.messages || []), message],
            lastActivity: new Date().toISOString()
          };
        }
        return c;
      });

      setChats(updatedChats);
      saveChats(updatedChats);

      // Update activeChat immediately
      const updatedActiveChat = updatedChats.find(c => c.id === chatId);
      setActiveChat(updatedActiveChat);

      // FIXED: Improved auto-delete mechanism
      if (message.autoDelete) {
        // Clear any existing timeout for this message
        if (deleteTimeoutsRef.current.has(messageId)) {
          clearTimeout(deleteTimeoutsRef.current.get(messageId));
        }

        // Mark message as being deleted to prevent UI flicker
        const deleteTimeout = setTimeout(() => {
          // Mark as deleting first
          setDeletingMessages(prev => new Set(prev).add(messageId));
          
          // Small delay to allow UI to show deletion state
          setTimeout(() => {
            // Actually delete the message
            setChats(currentChats => {
              const newChats = currentChats.map(c => {
                if (c.id === chatId) {
                  return {
                    ...c,
                    messages: (c.messages || []).filter(m => m.id !== messageId)
                  };
                }
                return c;
              });
              
              // Save to localStorage immediately
              saveChats(newChats);
              
              // Update activeChat if it's the current chat
              if (activeChat && activeChat.id === chatId) {
                setActiveChat(newChats.find(c => c.id === chatId));
              }
              
              return newChats;
            });
            
            // Clean up deletion tracking
            setDeletingMessages(prev => {
              const newSet = new Set(prev);
              newSet.delete(messageId);
              return newSet;
            });
            
            // Clean up timeout reference
            deleteTimeoutsRef.current.delete(messageId);
          }, 200); // Small delay for smooth UI transition
        }, message.deleteTimer);

        // Store timeout reference
        deleteTimeoutsRef.current.set(messageId, deleteTimeout);
      }

      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  const editMessage = (chatId, messageId, newContent) => {
    if (!chatId || !messageId || !newContent) return;

    // Clear any pending deletion for this message
    if (deleteTimeoutsRef.current.has(messageId)) {
      clearTimeout(deleteTimeoutsRef.current.get(messageId));
      deleteTimeoutsRef.current.delete(messageId);
    }

    const updatedChats = chats.map(c => {
      if (c.id === chatId) {
        return {
          ...c,
          messages: (c.messages || []).map(m => {
            if (m.id === messageId) {
              return {
                ...m,
                content: newContent,
                isEdited: true,
                editHistory: [...(m.editHistory || []), {
                  content: m.content,
                  timestamp: new Date().toISOString()
                }],
                editedAt: new Date().toISOString()
              };
            }
            return m;
          })
        };
      }
      return c;
    });

    setChats(updatedChats);
    saveChats(updatedChats);

    // Update activeChat if it's the current chat
    if (activeChat && activeChat.id === chatId) {
      setActiveChat(updatedChats.find(c => c.id === chatId));
    }

    toast({
      title: "Message Edited",
      description: "Your message has been updated"
    });
  };

  const deleteMessage = (chatId, messageId) => {
    if (!chatId || !messageId) return;

    // Clear any pending deletion timeout
    if (deleteTimeoutsRef.current.has(messageId)) {
      clearTimeout(deleteTimeoutsRef.current.get(messageId));
      deleteTimeoutsRef.current.delete(messageId);
    }

    // Remove from deleting set
    setDeletingMessages(prev => {
      const newSet = new Set(prev);
      newSet.delete(messageId);
      return newSet;
    });

    const updatedChats = chats.map(c => {
      if (c.id === chatId) {
        return {
          ...c,
          messages: (c.messages || []).filter(m => m.id !== messageId)
        };
      }
      return c;
    });

    setChats(updatedChats);
    saveChats(updatedChats);

    // Update activeChat if it's the current chat
    if (activeChat && activeChat.id === chatId) {
      setActiveChat(updatedChats.find(c => c.id === chatId));
    }
  };

  const markMessageAsRead = (chatId, messageId) => {
    if (!chatId || !messageId) return;

    const updatedChats = chats.map(c => {
      if (c.id === chatId) {
        return {
          ...c,
          messages: (c.messages || []).map(m => {
            if (m.id === messageId && !m.read) {
              return { ...m, read: true };
            }
            return m;
          })
        };
      }
      return c;
    });

    setChats(updatedChats);
    saveChats(updatedChats);

    // Update activeChat if it's the current chat
    if (activeChat && activeChat.id === chatId) {
      setActiveChat(updatedChats.find(c => c.id === chatId));
    }
  };

  const setTyping = (chatId, isTyping) => {
    if (!user || !chatId) return;

    setTypingUsers(prev => ({
      ...prev,
      [chatId]: isTyping ? user.id : null
    }));

    // Clear typing indicator after 3 seconds
    if (isTyping) {
      setTimeout(() => {
        setTypingUsers(prev => ({
          ...prev,
          [chatId]: null
        }));
      }, 3000);
    }
  };

  const addContact = (contactData) => {
    if (!contactData || !contactData.username) return null;

    const newContact = {
      ...contactData,
      id: `contact-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isFavorite: false,
      isBlocked: false,
      status: 'offline',
      lastSeen: new Date().toISOString(),
      publicKey: `key-${Date.now()}`
    };
    
    const updatedContacts = [...contacts, newContact];
    saveContacts(updatedContacts);
    return newContact;
  };

  const updateContact = (contactId, updates) => {
    if (!contactId || !updates) return;

    const updatedContacts = contacts.map(contact =>
      contact.id === contactId ? { ...contact, ...updates } : contact
    );
    saveContacts(updatedContacts);
  };

  const deleteContact = (contactId) => {
    if (!contactId) return;

    // Clear any timeouts for chats with this contact
    chats.forEach(chat => {
      if (chat.participants && chat.participants.includes(contactId)) {
        chat.messages?.forEach(message => {
          if (deleteTimeoutsRef.current.has(message.id)) {
            clearTimeout(deleteTimeoutsRef.current.get(message.id));
            deleteTimeoutsRef.current.delete(message.id);
          }
        });
      }
    });

    const updatedContacts = contacts.filter(contact => contact.id !== contactId);
    saveContacts(updatedContacts);
    
    // Also remove any chats with this contact
    const updatedChats = chats.filter(chat => 
      !chat.participants || !chat.participants.includes(contactId)
    );
    setChats(updatedChats);
    saveChats(updatedChats);
    
    // Clear active chat if it was with this contact
    if (activeChat && activeChat.participants && activeChat.participants.includes(contactId)) {
      setActiveChat(null);
    }
  };

  const blockContact = (contactId) => {
    updateContact(contactId, { isBlocked: true });
  };

  const unblockContact = (contactId) => {
    updateContact(contactId, { isBlocked: false });
  };

  const favoriteContact = (contactId) => {
    const contact = contacts.find(c => c.id === contactId);
    if (contact) {
      updateContact(contactId, { isFavorite: !contact.isFavorite });
    }
  };

  return (
    <ChatContext.Provider value={{
      chats,
      activeChat,
      contacts,
      typingUsers,
      deletingMessages,
      setActiveChat,
      setContacts: saveContacts,
      createChat,
      sendMessage,
      editMessage,
      deleteMessage,
      markMessageAsRead,
      setTyping,
      addContact,
      updateContact,
      deleteContact,
      blockContact,
      unblockContact,
      favoriteContact
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
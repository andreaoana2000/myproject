import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/contexts/ChatContext';
import { 
  MessageCircle, 
  Users, 
  Radio, 
  Settings, 
  LogOut,
  Shield
} from 'lucide-react';

// This component is no longer used since we moved navigation to the top
// Keeping it for potential future use or reference
export default function Sidebar({ activeTab, onTabChange }) {
  return null;
}
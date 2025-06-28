import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';
import { Shield, Lock, Eye, EyeOff } from 'lucide-react';
const avatarOptions = ['👤', '👩‍💼', '👨‍💻', '👩‍🎨', '👨‍🔬', '👩‍⚕️', '👨‍🎓', '👩‍🚀', '🦸‍♂️', '🦸‍♀️'];
export default function AuthScreen() {
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0]);
  const [loading, setLoading] = useState(false);
  const {
    login
  } = useAuth();
  const handleLogin = async e => {
    e.preventDefault();
    if (!username.trim()) {
      toast({
        title: "Username Required",
        description: "Please enter a username to continue",
        variant: "destructive"
      });
      return;
    }
    setLoading(true);
    try {
      await login(username.trim(), selectedAvatar);
      toast({
        title: "Welcome to SecureChat! 🎉",
        description: "Your account has been created with end-to-end encryption"
      });
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Failed to create your account. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  return <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/20 via-background to-secondary/20">
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.6
    }} className="w-full max-w-md">
        <div className="bg-card/80 backdrop-blur-lg border border-border/50 rounded-2xl p-8 shadow-2xl">
          <motion.div initial={{
          scale: 0.8
        }} animate={{
          scale: 1
        }} transition={{
          delay: 0.2,
          duration: 0.5
        }} className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Free Secure Chat</h1>
            <p className="text-muted-foreground">All messages are encrypted end-to-end
And auto-delete after being read.
No-One can't Save any Archive</p>
          </motion.div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Choose Username</Label>
              <Input id="username" type="text" placeholder="Enter your username" value={username} onChange={e => setUsername(e.target.value)} className="h-12" disabled={loading} />
            </div>

            <div className="space-y-3">
              <Label>Select Avatar</Label>
              <div className="grid grid-cols-5 gap-2">
                {avatarOptions.map((avatar, index) => <motion.button key={index} type="button" whileHover={{
                scale: 1.1
              }} whileTap={{
                scale: 0.95
              }} onClick={() => setSelectedAvatar(avatar)} className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl transition-colors ${selectedAvatar === avatar ? 'border-primary bg-primary/20' : 'border-border hover:border-primary/50'}`}>
                    {avatar}
                  </motion.button>)}
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
              {loading ? <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Creating Account...
                </div> : <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Enter SecureChat
                </div>}
            </Button>
          </form>

          <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          delay: 0.8
        }} className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-foreground mb-1">🔒 Your Privacy is Protected</p>
                <p className="text-muted-foreground">All messages are encrypted end-to-end
And auto-delete after being read.
No-One can't Save any Archive</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>;
}
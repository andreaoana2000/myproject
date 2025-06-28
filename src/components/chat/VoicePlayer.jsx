import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2 } from 'lucide-react';

export default function VoicePlayer({ audioUrl, duration = '0:05', onPlay, onPause }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      if (audio.currentTime !== undefined && !isNaN(audio.currentTime)) {
        setCurrentTime(audio.currentTime);
      }
    };
    
    const updateDuration = () => {
      if (audio.duration !== undefined && !isNaN(audio.duration)) {
        setTotalDuration(audio.duration);
      } else {
        setTotalDuration(5); // Default 5 seconds
      }
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (onPause) onPause();
    };

    const handleError = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      setTotalDuration(5);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [onPause]);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      if (onPause) onPause();
    } else {
      audio.play().catch((error) => {
        console.warn('Audio play failed:', error);
        setIsPlaying(false);
      });
      setIsPlaying(true);
      if (onPlay) onPlay();
    }
  };

  const formatTime = (time) => {
    if (isNaN(time) || time === undefined) return duration;
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  return (
    <div className="flex items-center gap-3 min-w-[200px]">
      {audioUrl && (
        <audio ref={audioRef} src={audioUrl} preload="metadata" />
      )}
      
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8"
        onClick={togglePlayback}
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </Button>

      <div className="flex-1 flex items-center gap-2">
        <div className="flex-1 relative">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Volume2 className="w-3 h-3 opacity-60" />
          <span className="text-xs opacity-70">
            {totalDuration > 0 ? formatTime(currentTime) : duration}
          </span>
        </div>
      </div>
    </div>
  );
}
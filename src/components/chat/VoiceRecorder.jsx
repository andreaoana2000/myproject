import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Mic, Square, Send, X, Pause, Play } from 'lucide-react';

export default function VoiceRecorder({ isRecording, onStartRecording, onStopRecording }) {
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [microphoneAvailable, setMicrophoneAvailable] = useState(true);
  
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const audioRef = useRef(null);

  // Check microphone availability on component mount
  useEffect(() => {
    checkMicrophoneAvailability();
  }, []);

  // CRITICAL FIX: Reset timer when recording starts
  useEffect(() => {
    if (isRecording && !recordedBlob && microphoneAvailable) {
      setRecordingTime(0);
      startRecording();
    }
  }, [isRecording, microphoneAvailable]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const checkMicrophoneAvailability = async () => {
    try {
      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setMicrophoneAvailable(false);
        return;
      }

      // Check if any audio input devices are available
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputDevices = devices.filter(device => device.kind === 'audioinput');
      
      if (audioInputDevices.length === 0) {
        setMicrophoneAvailable(false);
        return;
      }

      // Test microphone access
      try {
        const testStream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
        
        // If we get here, microphone is available
        testStream.getTracks().forEach(track => track.stop());
        setMicrophoneAvailable(true);
      } catch (testError) {
        console.warn('Microphone test failed:', testError);
        setMicrophoneAvailable(false);
      }
    } catch (error) {
      console.warn('Error checking microphone availability:', error);
      setMicrophoneAvailable(false);
    }
  };

  const startRecording = async () => {
    try {
      // Double-check microphone availability before starting
      if (!microphoneAvailable) {
        throw new Error('No microphone available');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      streamRef.current = stream;
      chunksRef.current = [];

      // Set up audio analysis for level visualization
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateAudioLevel = () => {
        if (analyserRef.current && !isPaused && isRecording) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / bufferLength;
          setAudioLevel(average);
        }
        if (isRecording && !isPaused) {
          requestAnimationFrame(updateAudioLevel);
        }
      };

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setRecordedBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
        setAudioLevel(0);
        
        // Stop timer when recording stops
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };

      mediaRecorderRef.current.start(100); // Collect data every 100ms
      updateAudioLevel();

      // CRITICAL FIX: Start timer immediately and ensure it runs
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;
          console.log('Recording time:', newTime); // Debug log
          return newTime;
        });
      }, 1000);

      console.log('Recording started, timer started'); // Debug log

    } catch (error) {
      console.error('Recording start error:', error);
      
      // Provide specific error messages based on the error type
      let errorMessage = "Unable to start recording";
      let errorDescription = "Please check your microphone settings";

      if (error.name === 'NotFoundError' || error.message.includes('Requested device not found')) {
        errorMessage = "Microphone Not Found";
        errorDescription = "No microphone device was detected. Please connect a microphone and try again.";
        setMicrophoneAvailable(false);
      } else if (error.name === 'NotAllowedError') {
        errorMessage = "Microphone Access Denied";
        errorDescription = "Please allow microphone access in your browser settings and try again.";
      } else if (error.name === 'NotReadableError') {
        errorMessage = "Microphone In Use";
        errorDescription = "Your microphone is being used by another application. Please close other apps and try again.";
      } else if (error.message.includes('No microphone available')) {
        errorMessage = "No Microphone Available";
        errorDescription = "Please connect a microphone device to record voice messages.";
        setMicrophoneAvailable(false);
      }

      toast({
        title: errorMessage,
        description: errorDescription,
        variant: "destructive"
      });

      // Reset recording state on error
      if (onStopRecording) {
        onStopRecording(null);
      }
    }
  };

  const stopRecording = () => {
    console.log('Stopping recording'); // Debug log
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      
      // Resume timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
  };

  const playRecording = () => {
    if (recordedBlob && audioRef.current) {
      const audioUrl = URL.createObjectURL(recordedBlob);
      audioRef.current.src = audioUrl;
      audioRef.current.play();
      setIsPlaying(true);
      
      audioRef.current.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
    }
  };

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const sendRecording = () => {
    if (recordedBlob) {
      onStopRecording(recordedBlob);
      resetRecorder();
    }
  };

  const cancelRecording = () => {
    if (isRecording) {
      stopRecording();
    }
    resetRecorder();
  };

  const resetRecorder = () => {
    setRecordingTime(0);
    setIsPaused(false);
    setAudioLevel(0);
    setRecordedBlob(null);
    setIsPlaying(false);
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleRecordClick = async () => {
    // Re-check microphone availability when user clicks record
    await checkMicrophoneAvailability();
    
    if (!microphoneAvailable) {
      toast({
        title: "No Microphone Available",
        description: "Please connect a microphone device to record voice messages.",
        variant: "destructive"
      });
      return;
    }
    
    onStartRecording();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // If not recording and no recorded blob, show record button
  if (!isRecording && !recordedBlob) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleRecordClick}
        disabled={!microphoneAvailable}
        title={!microphoneAvailable ? "No microphone available" : "Record voice message"}
      >
        <Mic className={`w-4 h-4 ${!microphoneAvailable ? 'opacity-50' : ''}`} />
      </Button>
    );
  }

  // If recording, show recording interface
  if (isRecording && !recordedBlob) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-3 bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-2"
      >
        {/* Audio Level Visualization */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 bg-destructive rounded-full"
              animate={{ 
                height: [4, Math.max(4, (audioLevel / 255) * 20 * (i + 1)), 4] 
              }}
              transition={{ 
                duration: 0.1, 
                repeat: Infinity, 
                repeatType: "reverse" 
              }}
            />
          ))}
        </div>

        {/* Recording Time - FIXED: Always show current time */}
        <span className="text-sm font-medium text-destructive min-w-[50px]">
          {formatTime(recordingTime)}
        </span>

        {/* Recording Status */}
        <div className="flex items-center gap-1">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-2 h-2 bg-destructive rounded-full"
          />
          <span className="text-xs text-destructive">
            {isPaused ? 'Paused' : 'Recording'}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1">
          {!isPaused ? (
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8"
              onClick={pauseRecording}
            >
              <Pause className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8"
              onClick={resumeRecording}
            >
              <Play className="w-4 h-4" />
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8"
            onClick={stopRecording}
          >
            <Square className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8"
            onClick={cancelRecording}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    );
  }

  // If recording is done, show playback and send interface
  if (recordedBlob) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-lg px-4 py-2"
      >
        <audio ref={audioRef} />
        
        {/* Playback Controls */}
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8"
          onClick={isPlaying ? stopPlayback : playRecording}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>

        {/* Duration */}
        <span className="text-sm font-medium text-primary">
          {formatTime(recordingTime)}
        </span>

        {/* Waveform Visualization */}
        <div className="flex items-center gap-1">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-primary/60 rounded-full"
              style={{ height: `${Math.random() * 16 + 4}px` }}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8"
            onClick={cancelRecording}
          >
            <X className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8"
            onClick={sendRecording}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    );
  }

  return null;
}
'use client';

import { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, SkipBack, SkipForward, VolumeOff } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface MusicPlayerProps {
  songUrl: string;
}

export default function MusicPlayer({ songUrl }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(100);
  const [mute, setMute] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };

    audio.addEventListener("timeupdate", updateProgress);
    
    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
    };
  }, []);

  // Automatically play the song when `songUrl` changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [songUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const seek = (value: number[]) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = (value[0] / 100) * audioRef.current.duration;
    setProgress(value[0]);
  };

  const adjustVolume = (value: number[]) => {
    if (!audioRef.current) return;
    if (mute) {
      setMute(false);
      audioRef.current.muted = false;
    }
    audioRef.current.volume = value[0] / 100;
    setVolume(value[0]);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !mute;
    setMute(!mute);
  };

  return (
    <div className="w-full max-w-lg p-6 bg-[#272727] text-white rounded-xl shadow-lg flex flex-col items-center space-y-4">
      <h2 className="text-lg font-semibold">Now Playing</h2>

      <audio ref={audioRef} src={songUrl} />

      <Slider value={[progress]} max={100} className="w-full bg-[#1a1a1a]" onValueChange={seek} />

      <div className="flex items-center gap-4">
        <button className="w-10 h-10 bg-[#181818] rounded-full flex items-center justify-center hover:bg-[#222] transition">
          <SkipBack className="w-5 h-5 text-gray-300" />
        </button>
        <button
          onClick={togglePlay}
          className="w-12 h-12 bg-[#181818] rounded-full flex items-center justify-center hover:bg-[#222] transition"
        >
          {isPlaying ? <Pause className="w-6 h-6 text-gray-300" /> : <Play className="w-6 h-6 text-gray-300" />}
        </button>
        <button className="w-10 h-10 bg-[#181818] rounded-full flex items-center justify-center hover:bg-[#222] transition">
          <SkipForward className="w-5 h-5 text-gray-300" />
        </button>
      </div>

      <div className="flex items-center gap-2 w-full">
        <button onClick={toggleMute} className="focus:outline-none">
          {mute ? <VolumeOff className="w-5 h-5 text-gray-400" /> : <Volume2 className="w-5 h-5 text-gray-400" />}
        </button>
        <Slider value={[mute ? 0 : volume]} max={100} className="w-full bg-[#1a1a1a]" onValueChange={adjustVolume} />
      </div>
    </div>
  );
}

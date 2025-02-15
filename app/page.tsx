"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle, Heart, MoreHorizontal, Mic2 } from "lucide-react";

const sampleSongs = [
  {
    id: 1,
    title: "Neon Dreams",
    artist: "Cyber Symphony",
    duration: "3:45",
    cover: "https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=400&h=400&fit=crop",
  },
  {
    id: 2,
    title: "Digital Horizon",
    artist: "Quantum Beats",
    duration: "4:20",
    cover: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&h=400&fit=crop",
  },
  {
    id: 3,
    title: "Future Pulse",
    artist: "Neural Network",
    duration: "3:55",
    cover: "https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=400&h=400&fit=crop",
  },
];

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(100);
  const [currentSong, setCurrentSong] = useState(sampleSongs[0]);
  const [volume, setVolume] = useState(80);
  const [isLiked, setIsLiked] = useState(false);
  const progressRef = useRef<SVGSVGElement>(null);

  const handleProgressClick = (e: React.MouseEvent<SVGElement>) => {
    if (progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const center = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
      
      const angle = Math.atan2(
        e.clientY - center.y,
        e.clientX - center.x
      );
      
      let degrees = angle * (180 / Math.PI) + 90;
      if (degrees < 0) degrees += 360;
      
      const percentage = Math.min(Math.max((degrees / 360) * 100, 0), 100);
      setCurrentTime((percentage / 100) * duration);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const progressPercentage = (currentTime / duration) * 100;
  
  const getProgressPath = (percentage: number) => {
    const radius = 32;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    return {
      radius,
      circumference,
      offset
    };
  };

  const { radius, circumference, offset } = getProgressPath(progressPercentage);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      {/* Main Content */}
      <div className="flex h-screen">
        {/* Left Sidebar */}
        <div className="w-64 bg-black p-6 flex flex-col gap-6">
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Your Library</h2>
            {sampleSongs.map((song) => (
              <div 
                key={song.id}
                onClick={() => setCurrentSong(song)}
                className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-300 cursor-pointer
                  ${currentSong.id === song.id 
                    ? 'bg-zinc-800' 
                    : 'hover:bg-zinc-800/50'
                  }`}
              >
                <img 
                  src={song.cover} 
                  alt={song.title} 
                  className="w-12 h-12 rounded-md object-cover"
                />
                <div>
                  <h3 className="font-medium text-sm">{song.title}</h3>
                  <p className="text-xs text-zinc-400">{song.artist}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-8 overflow-auto">
          {/* Now Playing Header */}
          <div className="flex items-end gap-6 mb-8">
            <img 
              src={currentSong.cover} 
              alt={currentSong.title}
              className="w-56 h-56 rounded-lg shadow-2xl"
            />
            <div>
              <p className="text-sm mb-2">Now Playing</p>
              <h1 className="text-5xl font-bold mb-4">{currentSong.title}</h1>
              <p className="text-lg text-zinc-400">{currentSong.artist}</p>
            </div>
          </div>

          {/* Lyrics Section (placeholder) */}
          <div className="mt-12 space-y-6">
            <div className="flex items-center gap-2 text-zinc-400">
              <Mic2 className="w-5 h-5" />
              <span>Lyrics</span>
            </div>
            <div className="space-y-4 text-zinc-400">
              <p className="hover:text-white transition-colors cursor-pointer">In the digital realm where dreams take flight</p>
              <p className="text-white text-lg">Through neon corridors of endless light</p>
              <p className="hover:text-white transition-colors cursor-pointer">Binary whispers guide our way</p>
              <p className="hover:text-white transition-colors cursor-pointer">In this symphony of cyber display</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Player Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 p-4">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          {/* Song Info */}
          <div className="flex items-center gap-4 min-w-[180px]">
            <img 
              src={currentSong.cover} 
              alt={currentSong.title}
              className="w-14 h-14 rounded object-cover"
            />
            <div>
              <h3 className="text-sm font-medium">{currentSong.title}</h3>
              <p className="text-xs text-zinc-400">{currentSong.artist}</p>
            </div>
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className={`hover:scale-110 transition-transform ${isLiked ? 'text-green-500' : 'text-zinc-400'}`}
            >
              <Heart className="w-5 h-5" fill={isLiked ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Player Controls */}
          <div className="flex flex-col items-center max-w-xl flex-1">
            {/* Control Buttons */}
            <div className="flex items-center gap-6 mb-4">
              <button className="text-zinc-400 hover:text-white transition-colors">
                <Shuffle className="w-5 h-5" />
              </button>
              <button className="text-zinc-400 hover:text-white transition-colors">
                <SkipBack className="w-6 h-6" />
              </button>
              
              {/* Circular Progress Bar with Play/Pause Button */}
              <div className="relative">
                <svg
                  ref={progressRef}
                  width="140"
                  height="140"
                  className="transform -rotate-90 cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={handleProgressClick}
                >
                  <circle
                    cx="70"
                    cy="70"
                    r={radius}
                    strokeWidth="2"
                    className="stroke-zinc-700 fill-none"
                  />
                  <circle
                    cx="70"
                    cy="70"
                    r={radius}
                    strokeWidth="2"
                    className="stroke-[url(#progressGradient)] fill-none transition-all duration-300"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#1DB954" />
                      <stop offset="100%" stopColor="#1ed760" />
                    </linearGradient>
                  </defs>
                </svg>
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center transition-all duration-300 hover:scale-105"
                >
                  {isPlaying ? 
                    <Pause className="w-6 h-6" /> : 
                    <Play className="w-6 h-6 ml-1" />
                  }
                </button>
              </div>

              <button className="text-zinc-400 hover:text-white transition-colors">
                <SkipForward className="w-6 h-6" />
              </button>
              <button className="text-zinc-400 hover:text-white transition-colors">
                <Repeat className="w-5 h-5" />
              </button>
            </div>

            {/* Time and Progress */}
            <div className="flex items-center gap-2 text-xs text-zinc-400 w-full">
              <span>{formatTime(currentTime)}</span>
              <span className="text-zinc-600">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2 min-w-[180px] justify-end">
            <Volume2 className="w-5 h-5 text-zinc-400" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-24 h-1 bg-zinc-700 rounded-full appearance-none cursor-pointer 
                [&::-webkit-slider-thumb]:appearance-none 
                [&::-webkit-slider-thumb]:w-3 
                [&::-webkit-slider-thumb]:h-3 
                [&::-webkit-slider-thumb]:rounded-full 
                [&::-webkit-slider-thumb]:bg-white
                hover:[&::-webkit-slider-thumb]:bg-green-400
                hover:bg-zinc-600
                transition-all"
            />
            <button className="text-zinc-400 hover:text-white">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
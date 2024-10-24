"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { Slider } from "~/components/ui/slider";

interface CustomVideoPlayerProps {
  url: string;
  className?: string;
  showInitialPlayButton?: boolean;
}

const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({
  url,
  className,
  showInitialPlayButton = true, // Default to true for backwards compatibility
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isControlsVisible, setIsControlsVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      setProgress((video.currentTime / video.duration) * 100);
    };

    video.addEventListener("timeupdate", updateProgress);
    video.addEventListener("loadedmetadata", () => setDuration(video.duration));

    return () => {
      video.removeEventListener("timeupdate", updateProgress);
      video.removeEventListener("loadedmetadata", () =>
        setDuration(video.duration),
      );
    };
  }, []);

  const togglePlay = () => {
    if (!showInitialPlayButton) return;
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        void videoRef.current.play();
        setHasStartedPlaying(true);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgressChange = (newValue: number[]) => {
    const video = videoRef.current;
    if (video && newValue[0]) {
      const newTime = (newValue[0] / 100) * video.duration;
      video.currentTime = newTime;
      setProgress(newValue[0]);
    }
  };

  const handleVolumeChange = (newValue: number[]) => {
    const newVolume = newValue[0] ?? 1;
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      setVolume(isMuted ? 1 : 0);
    }
  };

  const toggleFullscreen = () => {
    if (!playerRef.current) return;

    if (!isFullscreen) {
      if (playerRef.current.requestFullscreen) {
        void playerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        void document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const showControls = () => {
    if (hasStartedPlaying) {
      setIsControlsVisible(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        setIsControlsVisible(false);
      }, 3000);
    }
  };

  const hideControls = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    setIsControlsVisible(false);
  };

  return (
    <div
      ref={playerRef}
      className={cn(
        "relative aspect-video w-full h-[300px] overflow-hidden rounded-lg bg-current",
        className,
      )}
      onMouseEnter={showControls}
      onMouseMove={showControls}
      onMouseLeave={hideControls}
    >
      <video
        ref={videoRef}
        src={url}
        className="h-full w-full"
        onClick={() => {
          togglePlay();
        }}
      />
      {showInitialPlayButton && !isPlaying && !hasStartedPlaying && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-black/50 hover:bg-black/70"
          onClick={(e) => {
            e.preventDefault();
            togglePlay();
          }}
        >
          <Play size={25} className="text-white" />
        </Button>
      )}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300",
          isControlsVisible && hasStartedPlaying
            ? "opacity-100"
            : "pointer-events-none opacity-0",
        )}
      >
        <Slider
          value={[progress]}
          max={100}
          step={0.1}
          onValueChange={handleProgressChange}
          className="mb-4 w-full"
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.preventDefault();
                togglePlay();
              }}
              className="text-white/80 hover:bg-transparent hover:text-white"
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.preventDefault();
                toggleMute();
              }}
              className="text-white/80 hover:bg-transparent hover:text-white"
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </Button>
            <Slider
              value={[volume]}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="w-20"
            />
            <span className="text-sm text-white">
              {formatTime(videoRef.current?.currentTime ?? 0)} /
              {formatTime(duration)}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              toggleFullscreen();
            }}
            className="text-white/80 hover:bg-transparent hover:text-white"
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomVideoPlayer;

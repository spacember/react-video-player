import "./style.css";
import React, { useRef, useEffect, useMemo } from "react";
import { useIntersectionObserver } from "usehooks-ts";

export interface ICaptionProps {
  description: string;
  fileName: string;
  url: string;
}

export interface IVideoPlayerProps {
  captions?: ICaptionProps[];
  defaultVolume?: number;
  imageUrl?: string;
  showMuteUnmute?: boolean;
  showPlayPause?: boolean;
  showRemainingTime?: boolean;
  showSeekbar?: boolean;
  showVolume?: boolean;
  threshold?: number;
  url?: string;
}

const setDefaultVolume = (
  videoRef: React.RefObject<HTMLVideoElement>,
  volume?: number
) => videoRef && videoRef.current && (videoRef.current.volume = volume || 0.4);

const isIntersecting =
  (entry?: IntersectionObserverEntry, imageUrl?: string) => () =>
    !imageUrl && entry?.isIntersecting;

const pauseVideo = (videoRef: React.RefObject<HTMLVideoElement>): void =>
  videoRef.current?.pause();

const playVideo = async (
  videoRef: React.RefObject<HTMLVideoElement>
): Promise<void> => await videoRef.current?.play();

const VideoPlayer: React.FC<IVideoPlayerProps> = ({
  captions,
  defaultVolume,
  imageUrl,
  showMuteUnmute,
  showPlayPause,
  showRemainingTime,
  showSeekbar,
  showVolume,
  threshold,
  url,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // button references
  const decreaseVolumeRef = useRef<HTMLButtonElement>(null);
  const fullScreenRef = useRef<HTMLButtonElement>(null);
  const increaseVolumeRef = useRef<HTMLButtonElement>(null);
  const muteUnmuteRef = useRef<HTMLButtonElement>(null);
  const playPauseRef = useRef<HTMLButtonElement>(null);

  // initial setup
  setDefaultVolume(videoRef, defaultVolume);

  // intersection observer
  const entry = useIntersectionObserver(videoRef, { threshold });
  const isEntryInView = useMemo(isIntersecting(entry, imageUrl), [entry]);

  useEffect(() => {
    isEntryInView ? playVideo(videoRef) : pauseVideo(videoRef);
  }, [isEntryInView]);

  // event listeners
  const toggleMuteUnmute = (_event: React.MouseEvent<HTMLElement>) =>
    (videoRef.current!.muted = !videoRef.current!.muted);

  const togglePlayPause = (_event: React.MouseEvent<HTMLElement>) =>
    videoRef.current?.paused ? playVideo(videoRef) : pauseVideo(videoRef);

  const canToggleVolume = (): boolean =>
    videoRef.current!.volume < 0.9 && videoRef.current!.volume > 0.1;

  const increaseVolumeByTenPercent = (_event: React.MouseEvent<HTMLElement>) =>
    canToggleVolume() && (videoRef.current!.volume += 0.1);

  const decreaseVolumeByTenPercent = (_event: React.MouseEvent<HTMLElement>) =>
    canToggleVolume() && (videoRef.current!.volume -= 0.1);

  const canFullScreen = (): boolean => document.fullscreenEnabled;

  const isFullScreen = (): boolean => !!document.fullscreenElement;

  const toggleFullScreen = async (_event: React.MouseEvent<HTMLElement>) =>
    canFullScreen() && isFullScreen()
      ? document.exitFullscreen()
      : videoRef.current?.requestFullscreen();

  return (
    <figure>
      <video muted={true} poster={imageUrl} ref={videoRef}>
        <source src={url} type="video/mp4" />
      </video>
      <ul className="controls">
        <li className="progress">
          <progress value="0"></progress>
        </li>
        <li>
          <button onClick={togglePlayPause} ref={playPauseRef}>
            Play/Pause
          </button>
        </li>
        <li>
          <button onClick={toggleMuteUnmute} ref={muteUnmuteRef}>
            Mute/Unmute
          </button>
        </li>
        <li>
          <button onClick={increaseVolumeByTenPercent} ref={increaseVolumeRef}>
            Vol+
          </button>
        </li>
        <li>
          <button onClick={decreaseVolumeByTenPercent} ref={decreaseVolumeRef}>
            Vol-
          </button>
        </li>
        <li>
          <button onClick={toggleFullScreen} ref={fullScreenRef}>
            Fullscreen
          </button>
        </li>
      </ul>
    </figure>
  );
};

export default VideoPlayer;

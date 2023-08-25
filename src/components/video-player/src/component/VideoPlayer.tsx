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

const setAutoplay = (
  videoRef: React.RefObject<HTMLVideoElement>,
  imageUrl?: string
) => imageUrl && videoRef.current?.pause();

const setDefaultVolume = (
  videoRef: React.RefObject<HTMLVideoElement>,
  volume?: number
) => (videoRef!.current!.volume = volume || 0.4);

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
  // html elem references
  const videoRef = useRef<HTMLVideoElement>(null);
  const getCurrentVolume = (): number =>
    Math.floor(videoRef.current!.volume * 10) / 10;

  // initial setup
  useEffect(() => {
    setAutoplay(videoRef, imageUrl);
    setDefaultVolume(videoRef, defaultVolume);
  }, []);

  // event listeners && methods
  const canFullScreen = () => document.fullscreenEnabled;

  const decreaseVolume = (amount: number) =>
    getCurrentVolume() > 0 && setVolume(amount);

  const isFullScreen = () => !!document.fullscreenElement;

  const inscreaseVolume = (amount: number) =>
    getCurrentVolume() < 1 && setVolume(amount);

  const pauseVideo = () => videoRef.current?.pause();

  const playVideo = () => videoRef.current?.play();

  const setVolume = (amount: number) =>
    (videoRef.current!.volume =
      Math.floor((getCurrentVolume() + amount) * 10) / 10);

  const toggleFullScreen = () =>
    canFullScreen() && isFullScreen()
      ? document.exitFullscreen()
      : videoRef.current?.requestFullscreen();

  const toggleMuteUnmute = () =>
    (videoRef.current!.muted = !videoRef.current!.muted);

  const togglePlayPause = () =>
    videoRef.current?.paused ? playVideo() : pauseVideo();

  const changeVolume = (amount: number) =>
    amount > 0 ? inscreaseVolume(amount) : decreaseVolume(amount);

  // intersection observer
  const entry = useIntersectionObserver(videoRef, { threshold });

  const isIntersecting = (entry?: IntersectionObserverEntry) => () =>
    entry?.isIntersecting;

  const isInView = useMemo(isIntersecting(entry), [entry]);

  useEffect(() => {
    isInView ? playVideo() : pauseVideo();
  }, [isInView]);

  return (
    <figure>
      <video
        loop={true}
        muted={true}
        poster={imageUrl}
        preload="none"
        ref={videoRef}
      >
        <source src={url} type="video/mp4" />
      </video>
      <ul className="controls">
        <li className="progress">
          <progress value="0" max={1}></progress>
        </li>
        <li>
          <button onClick={togglePlayPause}>Play/Pause</button>
        </li>
        <li>
          <button onClick={toggleMuteUnmute}>Mute/Unmute</button>
        </li>
        <li>
          <button onClick={() => changeVolume(0.1)}>Vol+</button>
        </li>
        <li>
          <button onClick={() => changeVolume(-0.1)}>Vol-</button>
        </li>
        <li>
          {/* {`${videoRef.current?.currentTime} / ${videoRef.current!.duration}`} */}
        </li>
        <li>
          <button onClick={toggleFullScreen}>Fullscreen</button>
        </li>
      </ul>
    </figure>
  );
};

export default VideoPlayer;

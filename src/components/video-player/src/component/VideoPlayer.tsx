import "./style.css";
import React, { useRef, useEffect, useMemo } from "react";
import { useIntersectionObserver } from "usehooks-ts";

export interface ICaptionProps {
  description: string;
  fileName: string;
  url: string;
}

export interface IVideoPlayerProps {
  autoplay: boolean;
  captions?: ICaptionProps[];
  className?: string;
  defaultVolume?: number;
  imageUrl?: string;
  showMuteUnmute?: boolean;
  showPlayPause?: boolean;
  showRemainingTime?: boolean;
  showSeekbar?: boolean;
  showVolume?: boolean;
  videoUrl?: string;
}

const VideoPlayer: React.FC<IVideoPlayerProps> = ({
  autoplay = true,
  captions,
  className,
  defaultVolume = 0.4,
  imageUrl,
  showMuteUnmute = true,
  showPlayPause = true,
  showRemainingTime = true,
  showSeekbar = false,
  showVolume = false,
  videoUrl,
}) => {
  const ref = useRef<HTMLVideoElement | null>(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.5 });

  const playVideo = () => ref.current?.play();

  const pauseVideo = () => ref.current?.pause();

  const isIntersecting = useMemo(() => {
    return entry?.isIntersecting;
  }, [entry]);

  useEffect(() => {
    isIntersecting ? playVideo() : pauseVideo();
  }, [isIntersecting]);

  return (
    <figure>
      <video autoPlay={autoplay} muted={true} poster={imageUrl} ref={ref}>
        <source src={videoUrl} type="video/mp4" />
      </video>
      <ul className="controls">
        <li className="progress">
          <progress value="0"></progress>
        </li>
        <li>
          <button type="button">Play/Pause</button>
        </li>
        <li>
          <button type="button">Mute/Unmute</button>
        </li>
        <li>
          <button type="button">Vol+</button>
        </li>
        <li>
          <button type="button">Vol-</button>
        </li>
        <li>
          <button type="button">Fullscreen</button>
        </li>
      </ul>
    </figure>
  );
};

export default VideoPlayer;

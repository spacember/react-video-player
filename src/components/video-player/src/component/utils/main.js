"use strict";

const videoContainer = document.getElementById("videoContainer");
const video = document.getElementById("video");
const videoControls = document.getElementById("video-controls");
const playpause = document.getElementById("playpause");
const mute = document.getElementById("mute");
const volinc = document.getElementById("volinc");
const voldec = document.getElementById("voldec");
const progress = document.getElementById("progress");
const progressBar = document.getElementById("progress-bar");
const fullscreen = document.getElementById("fs");

// play/pause
playpause.addEventListener("click", (e) => {
  if (video.paused || video.ended) {
    video.play();
  } else {
    video.pause();
  }
});

// mute/unmute
mute.addEventListener("click", (e) => {
  video.muted = !video.muted;
});

// volume +
volinc.addEventListener("click", (e) => {
  alterVolume("+");
});

// volume -
voldec.addEventListener("click", (e) => {
  alterVolume("-");
});

function alterVolume(dir) {
  const currentVolume = Math.floor(video.volume * 10) / 10;
  if (dir === "+" && currentVolume < 1) {
    video.volume += 0.1;
  } else if (dir === "-" && currentVolume > 0) {
    video.volume -= 0.1;
  }
}

video.addEventListener("loadedmetadata", () => {
  progress.setAttribute("max", video.duration);
});

// progress visual update
video.addEventListener("timeupdate", () => {
  if (!progress.getAttribute("max"))
    progress.setAttribute("max", video.duration);
  progress.value = video.currentTime;
  progressBar.style.width = `${Math.floor(
    (video.currentTime * 100) / video.duration
  )}%`;
});

// manual seeking
progress.addEventListener("click", (e) => {
  const rect = progress.getBoundingClientRect();
  const pos = (e.pageX - rect.left) / progress.offsetWidth;
  video.currentTime = pos * video.duration;
});

if (!document?.fullscreenEnabled) {
  fullscreen.style.display = "none";
}

// fullscreen
fullscreen.addEventListener("click", (e) => {
  if (document.fullscreenElement !== null) {
    // The document is in fullscreen mode
    document.exitFullscreen();
    setFullscreenData(false);
  } else {
    // The document is not in fullscreen mode
    videoContainer.requestFullscreen();
    setFullscreenData(true);
  }
});

function setFullscreenData(state) {
  videoContainer.setAttribute("data-fullscreen", !!state);
}

document.addEventListener("fullscreenchange", (e) => {
  setFullscreenData(!!document.fullscreenElement);
});

// Display the user defined video controls
// videoControls.setAttribute("data-state", "visible");

const supportsProgress = document.createElement("progress").max !== undefined;
if (!supportsProgress) progress.setAttribute("data-state", "fake");

function changeButtonState(type) {
  if (type === "playpause") {
    // Play/Pause button
    if (video.paused || video.ended) {
      playpause.setAttribute("data-state", "play");
    } else {
      playpause.setAttribute("data-state", "pause");
    }
  } else if (type === "mute") {
    // Mute button
    mute.setAttribute("data-state", video.muted ? "unmute" : "mute");
  }
}

video.addEventListener(
  "play",
  () => {
    changeButtonState("playpause");
  },
  false
);

video.addEventListener(
  "pause",
  () => {
    changeButtonState("playpause");
  },
  false
);

// intersection observer
if (!!window.IntersectionObserver) {
  let observer = new IntersectionObserver(
    ([elem]) => {
      elem.isIntersecting ? video.play() : video.pause();
    },
    { threshold: 0.5 }
  );

  observer.observe(video);
}

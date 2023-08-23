import "./App.css";
import VideoPlayer from "./components/video-player/src/component/VideoPlayer";
import videoPlayerContent from "./content/videoPlayer.json";
import Wrapper from "./components/wrapper/src/component/Wrapper";

function App() {
  return (
    <Wrapper>
      {<VideoPlayer {...videoPlayerContent} />}
    </Wrapper>
  );
}

export default App;

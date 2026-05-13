import { useState, useRef } from 'react';
import { Play, Pause, FastForward, Rewind, Settings } from 'lucide-react';

export default function CustomPlayer({ channelId, messageId, thumbnailUrl }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Directly call the Render/Koyeb streaming backend
  const streamUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/stream/${channelId}/${messageId}`;

  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const skip = (time) => { videoRef.current.currentTime += time; };
  const changeSpeed = () => {
    const currentSpeed = videoRef.current.playbackRate;
    videoRef.current.playbackRate = currentSpeed >= 2 ? 0.5 : currentSpeed + 0.5;
  };

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center group" onClick={() => setShowControls(!showControls)}>
      <video
        ref={videoRef}
        src={streamUrl}
        poster={thumbnailUrl}
        className="w-full h-full object-contain"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        playsInline
      />
      {/* ... (Overlay UI logic remains identical to previous response) ... */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center pl-1">
            <Play size={32} className="text-black" />
          </div>
        </div>
      )}
      <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent transition-opacity ${isPlaying && !showControls ? 'opacity-0' : 'opacity-100'}`}>
        <div className="flex justify-between items-center text-white">
           <div className="flex space-x-4">
              <button onClick={() => skip(-10)}><Rewind size={20}/></button>
              <button onClick={togglePlay}>{isPlaying ? <Pause size={20}/> : <Play size={20}/>}</button>
              <button onClick={() => skip(10)}><FastForward size={20}/></button>
           </div>
           <button onClick={changeSpeed}><Settings size={20}/></button>
        </div>
      </div>
    </div>
  );
}
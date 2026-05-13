import { useState, useRef, useEffect } from 'react';
import { Play, Pause, FastForward, Rewind, Settings, Loader2 } from 'lucide-react';

export default function CustomPlayer({ channelId, messageId, thumbnailUrl }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Directly call the backend streaming URL
  const streamUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/stream/${channelId}/${messageId}`;

  // Robust Play/Pause toggle logic
  const togglePlay = (e) => {
    if (e) e.stopPropagation(); // Stops click from hiding controls
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      setIsLoading(true); // Show loader while fetching from Telegram
      videoRef.current.play()
        .then(() => {
          setIsLoading(false);
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error("Playback error:", err);
          setIsLoading(false);
        });
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Handle skip forward/backward
  const skip = (e, time) => {
    if (e) e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.currentTime += time;
    }
  };

  // Handle playback speed
  const changeSpeed = (e) => {
    if (e) e.stopPropagation();
    if (videoRef.current) {
      const currentSpeed = videoRef.current.playbackRate;
      const newSpeed = currentSpeed >= 2 ? 0.5 : currentSpeed + 0.5;
      videoRef.current.playbackRate = newSpeed;
      // Optional: Add a toast notification here in the future
    }
  };

  return (
    <div 
      className="relative w-full aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center group shadow-lg border border-gray-800"
      onClick={() => setShowControls(!showControls)} // Toggles controls when clicking background
    >
      {/* HTML5 Video Element */}
      <video
        ref={videoRef}
        src={streamUrl}
        poster={thumbnailUrl}
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
        onPlay={() => { setIsPlaying(true); setIsLoading(false); }}
        onPause={() => setIsPlaying(false)}
        onWaiting={() => setIsLoading(true)}   // Shows loader if video buffers
        onPlaying={() => setIsLoading(false)}  // Hides loader when resumes
        playsInline
      />

      {/* Loading Spinner Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 pointer-events-none z-10">
          <Loader2 size={48} className="text-white animate-spin" />
        </div>
      )}

      {/* Big Center Play Button (Only visible when paused and NOT loading) */}
      {!isPlaying && !isLoading && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer z-10 transition-all hover:bg-black/50"
          onClick={togglePlay}
        >
          <div className="w-16 h-16 bg-white/90 hover:bg-white rounded-full flex items-center justify-center pl-1 shadow-2xl transition-transform transform hover:scale-110">
            <Play size={32} className="text-black" />
          </div>
        </div>
      )}

      {/* Bottom Controls Overlay */}
      <div 
        className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/95 via-black/60 to-transparent transition-opacity duration-300 z-20 ${isPlaying && !showControls ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        onClick={(e) => e.stopPropagation()} // Prevents clicks on controls from triggering the wrapper
      >
        <div className="flex justify-between items-center text-white mb-1">
           {/* Left Controls (Rewind, Play, FastForward) */}
           <div className="flex space-x-6 items-center">
              <button onClick={(e) => skip(e, -10)} className="hover:text-primary transition-colors">
                <Rewind size={22} />
              </button>
              
              <button onClick={togglePlay} className="hover:text-primary transition-colors">
                {isPlaying ? <Pause size={28} /> : <Play size={28} />}
              </button>
              
              <button onClick={(e) => skip(e, 10)} className="hover:text-primary transition-colors">
                <FastForward size={22} />
              </button>
           </div>

           {/* Right Controls (Speed Settings) */}
           <button onClick={changeSpeed} className="hover:text-primary transition-colors p-2 bg-gray-800/50 rounded-full">
              <Settings size={20} />
           </button>
        </div>
      </div>
    </div>
  );
}
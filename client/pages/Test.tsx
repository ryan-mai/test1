import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaSearch, FaPlus, FaEllipsisH, FaPlay, FaVolumeUp } from 'react-icons/fa';
import { BiSkipPrevious, BiSkipNext, BiShuffle, BiRepeat } from 'react-icons/bi';
import { CgScreen } from 'react-icons/cg';
import { MdQueueMusic } from 'react-icons/md';

const Test = () => {
  const navigate = useNavigate();
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const progressBarRef = React.useRef<HTMLDivElement>(null);
  const [volume, setVolume] = React.useState(0.75);
  // Sample data for playlist cards
  const playlists = [
    {
      id: 1,
      title: 'Hot Hits Canada',
      image: '/placeholder.svg',
      type: 'hot-hits',
    },
    {
      id: 2,
      title: 'Hot Rhythmic',
      image: '/placeholder.svg',
      type: 'hot-rhythmic',
    },
    {
      id: 3,
      title: 'Hip-Hop Favourites',
      image: '/placeholder.svg',
      type: 'hip-hop',
    },
    {
      id: 4,
      title: 'Summer Hits 2025',
      image: '/placeholder.svg',
      type: 'summer-gradient',
    },
    {
      id: 5,
      title: 'New Music Friday Canada',
      image: '/placeholder.svg',
      type: 'new-music',
    },
    {
      id: 6,
      title: "Today's Top Hits",
      image: '/placeholder.svg',
      type: 'top-hits',
    },
    {
      id: 7,
      title: "Editors' Picks: Best Songs of the Year So Far",
      image: '/placeholder.svg',
      type: 'editors-picks',
    },
    {
      id: 8,
      title: 'Jack Harlow Radio',
      image: '/placeholder.svg',
      type: 'artist-radio',
    },
  ];

  // Sample data for daily mix cards
  const dailyMixes = [
    {
      id: 1,
      number: '01',
      color: 'cyan',
      title: 'Home',
      description: 'Main dashboard and player',
      path: '/home',
      image: '/placeholder.svg',
    },
    {
      id: 2,
      number: '02',
      color: 'yellow',
      title: 'About',
      description: 'Learn more about the project',
      path: '/about',
      image: '/placeholder.svg',
    },
    {
      id: 3,
      number: '03',
      color: 'red',
      title: 'Preprocessing',
      description: 'Process and analyze audio data',
      path: '/preprocessing',
      image: '/placeholder.svg',
    },
    {
      id: 4,
      number: '04',
      color: 'pink',
      title: 'Mental State',
      description: 'Brain activity visualization',
      path: '/mental-state',
      image: '/placeholder.svg',
    },
    {
      id: 5,
      number: '05',
      color: 'green',
      title: 'Login',
      description: 'Sign in to your account',
      path: '/login',
      image: '/placeholder.svg',
    },
  ];


  // Update audio volume when volume state changes
  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Play/pause handler for player bar
  const handlePlayerBarPlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Sync play/pause state and progress
  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
  }, []);

  // Format time in mm:ss
  const formatTime = (t: number) => {
    if (isNaN(t)) return '0:00';
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Seek when clicking/dragging progress bar
  const handleProgressBar = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!audioRef.current || !progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, x / rect.width));
    const seekTime = percent * duration;
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  // Handle volume bar click/drag
  const handleVolumeBar = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!audioRef.current) return;
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, x / rect.width));
    setVolume(percent);
  };

  return (
    <div className="flex flex-col h-screen bg-[#121212] text-white">
      {/* Top Navigation */}
      <div className="relative flex items-center justify-between p-4">
        {/* Right side content */}
        <div className="flex items-center gap-4 ml-auto">
          <div className="text-[#B3B3B3] hover:text-white cursor-pointer">
          </div>
        </div>
      </div>

      {/* Centered Home + Search at filter level */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-8">
            <button
              className="p-4 rounded-full bg-[#2A2A2A] text-[#B3B3B3] focus:outline-none hover:bg-[#383838] transition-colors"
              onClick={() => navigate('/home')}
              aria-label="Go to Home"
            >
              <FaHome size={36} />
            </button>
            <div className="flex items-center rounded-full bg-[#2A2A2A] px-6 py-4 w-[420px]">
              <FaSearch className="text-[#B3B3B3] mr-4" size={24} />
              <input
                type="text"
                placeholder="What do you want to play?"
                className="bg-transparent border-none outline-none text-[#B3B3B3] w-full text-lg"
              />
            </div>
          </div>
        </div>
        <div className="h-16 w-16 rounded-full bg-gray-500 ml-8 mr-16"></div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-4">
        {/* Filter Pills */}
        <div className="flex gap-2 mb-6">
          <button className="px-4 py-2 rounded-full bg-white text-black font-medium">
            All
          </button>
          <button className="px-4 py-2 rounded-full bg-[#2A2A2A] text-white font-medium hover:bg-[#3E3E3E]">
            Music
          </button>
          <button className="px-4 py-2 rounded-full bg-[#2A2A2A] text-white font-medium hover:bg-[#3E3E3E]">
            Podcasts
          </button>
          <button className="px-4 py-2 rounded-full bg-[#2A2A2A] text-white font-medium hover:bg-[#3E3E3E]">
            Audiobooks
          </button>
        </div>

        {/* First row of cards */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          {playlists.slice(0, 4).map((playlist) => (
            <div
              key={playlist.id}
              className={`p-4 rounded-lg bg-[#181818] hover:bg-[#282828] transition-colors cursor-pointer ${
                playlist.type === 'summer-gradient' 
                ? 'bg-gradient-to-br from-[#1DB954] to-[#450CF5]' 
                : ''
              }`}
            >
              <div className="relative">
                <img
                  src={playlist.image}
                  alt={playlist.title}
                  className="w-full aspect-square object-cover rounded-md mb-4"
                />
              </div>
              <h3 className="font-bold text-white truncate">{playlist.title}</h3>
            </div>
          ))}
        </div>

        {/* Second row of cards */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          {playlists.slice(4, 8).map((playlist) => (
            <div
              key={playlist.id}
              className={`p-4 rounded-lg bg-[#181818] hover:bg-[#282828] transition-colors cursor-pointer ${
                playlist.type === 'editors-picks' ? 'bg-[#1ED760]' : ''
              }`}
            >
              <div className="relative">
                <img
                  src={playlist.image}
                  alt={playlist.title}
                  className="w-full aspect-square object-cover rounded-md mb-4"
                />
              </div>
              <h3 className="font-bold text-white truncate">{playlist.title}</h3>
            </div>
          ))}
        </div>

        {/* Featured sections */}
        <div className="flex justify-between mb-4">
          <div>
            <div className="flex items-center gap-4">
              <img
                src="/placeholder.svg"
                alt="XXXTENTACION"
                className="w-16 h-16 rounded-full"
              />
              <div>
                <p className="text-sm text-[#B3B3B3]">New release from</p>
                <h2 className="text-2xl font-bold">XXXTENTACION</h2>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-[#B3B3B3]">Made For</p>
                <h2 className="text-2xl font-bold">ILITSEN</h2>
              </div>
            </div>
          </div>
          <div className="text-[#B3B3B3] hover:text-white cursor-pointer">
            Show all
          </div>
        </div>

        {/* Large feature card with small cards */}
        <div className="flex gap-6 mb-8">
          {/* Feature card */}
          <div className="w-1/5">
            <div className="bg-transparent rounded shadow-lg cursor-pointer">
              <img
                src="/placeholder.svg"
                alt="Broly"
                className="w-full aspect-square object-cover rounded-sm"
              />
              <div className="p-2">
                <p className="text-xs text-[#B3B3B3]">Single • Ski Mask The Slump God,...</p>
                <h3 className="font-bold text-2xl">Broly</h3>
                <div className="flex mt-4 gap-4">
                  <button className="w-12 h-12 flex items-center justify-center rounded-full bg-white">
                    <FaPlay className="text-black ml-1" size={20} />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2A2A2A] hover:bg-[#3E3E3E]">
                    <FaPlus className="text-white" size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Daily mix cards */}
          {dailyMixes.map((mix) => (
            <div key={mix.id} className="w-1/5">
              <div 
                className="bg-[#181818] rounded-lg p-4 hover:bg-[#282828] transition-colors cursor-pointer"
                onClick={() => navigate(mix.path)}
              >
                <div className="relative">
                  <img
                    src={mix.image}
                    alt={`Daily Mix ${mix.number}`}
                    className="w-full aspect-square object-cover rounded-md mb-4"
                  />
                  <div 
                    className={`absolute bottom-8 left-2 px-2 py-1 rounded text-sm text-black font-medium ${
                      mix.color === 'cyan' ? 'bg-cyan-400' : 
                      mix.color === 'yellow' ? 'bg-yellow-400' :
                      mix.color === 'red' ? 'bg-red-400' :
                      mix.color === 'pink' ? 'bg-pink-400' :
                      'bg-green-400'
                    }`}
                  >
                    Daily Mix
                  </div>
                  <div 
                    className={`absolute bottom-8 right-2 px-3 py-1 rounded text-2xl text-black font-bold ${
                      mix.color === 'cyan' ? 'bg-cyan-400' : 
                      mix.color === 'yellow' ? 'bg-yellow-400' :
                      mix.color === 'red' ? 'bg-red-400' :
                      mix.color === 'pink' ? 'bg-pink-400' :
                      'bg-green-400'
                    }`}
                  >
                    {mix.number}
                  </div>
                </div>
                <h3 className="font-bold text-white text-base">{mix.title}</h3>
                <p className="text-sm text-[#B3B3B3]">{mix.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Player bar */}
      <audio ref={audioRef} src="/test-song.mp3" preload="auto" />
      <div className="h-24 bg-[#181818] border-t border-[#282828] flex items-center px-4">
        <div className="w-1/4 flex items-center">
          <img 
            src="/placeholder.svg" 
            alt="Now Playing" 
            className="h-14 w-14 rounded-sm mr-4"
          />
          <div>
            <p className="text-white text-sm font-medium">Show Me Love</p>
            <p className="text-[#B3B3B3] text-xs">@TheMe, bees & honey</p>
          </div>
        </div>
        
        <div className="w-1/2 flex flex-col items-center">
          <div className="flex items-center gap-4 mb-2">
            <BiShuffle className="text-[#B3B3B3] hover:text-white cursor-pointer" size={20} />
            <BiSkipPrevious className="text-[#B3B3B3] hover:text-white cursor-pointer" size={28} />
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white"
              onClick={handlePlayerBarPlay}
            >
              {isPlaying ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="black"><rect x="2" y="2" width="3" height="10" rx="1.5"/><rect x="9" y="2" width="3" height="10" rx="1.5"/></svg>
              ) : (
                <FaPlay className="text-black ml-0.5" size={14} />
              )}
            </button>
            <BiSkipNext className="text-[#B3B3B3] hover:text-white cursor-pointer" size={28} />
            <BiRepeat className="text-[#B3B3B3] hover:text-white cursor-pointer" size={20} />
          </div>
          <div className="w-full flex items-center gap-2 select-none">
            <span className="text-xs text-[#B3B3B3] min-w-[36px] text-right">{formatTime(currentTime)}</span>
            <div
              ref={progressBarRef}
              className="flex-1 h-1 bg-[#404040] rounded-full cursor-pointer relative group"
              onClick={handleProgressBar}
            >
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
              ></div>
              {/* Thumb */}
              {duration > 0 && (
                <div
                  className="absolute top-1/2 -translate-y-1/2"
                  style={{ left: `calc(${(currentTime / duration) * 100}% - 8px)` }}
                >
                  <div className="w-3 h-3 bg-white rounded-full shadow border border-[#404040] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" />
                </div>
              )}
            </div>
            <span className="text-xs text-[#B3B3B3] min-w-[36px]">{formatTime(duration)}</span>
          </div>
        </div>
        
        <div className="w-1/4 flex items-center justify-end gap-3">
          <CgScreen className="text-[#B3B3B3] hover:text-white cursor-pointer" size={20} />
          <MdQueueMusic className="text-[#B3B3B3] hover:text-white cursor-pointer" size={20} />
          <FaVolumeUp className="text-[#B3B3B3] hover:text-white cursor-pointer" size={20} />
          <div
            className="w-24 h-1 bg-[#404040] rounded-full cursor-pointer relative group"
            onClick={handleVolumeBar}
          >
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${volume * 100}%` }}
            ></div>
            {/* Thumb */}
            <div
              className="absolute top-1/2 -translate-y-1/2"
              style={{ left: `calc(${volume * 100}% - 8px)` }}
            >
              <div className="w-3 h-3 bg-white rounded-full shadow border border-[#404040] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" />
            </div>
          </div>
          <button className="text-[#B3B3B3] hover:text-white">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M1.5 1H6v1.5H3v10h10v-3H14.5v4.5h-14V1.5z M8 4H16v8H8V4zm6.5 6.5v-5h-5v5h5z"></path>
            </svg>
          </button>
          <button className="text-[#B3B3B3] hover:text-white">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M16 3v10H0V3h16zM1 4v8h14V4H1z"></path>
              <path d="M10 12h4V4h-4v8zm1-7h2v6h-2V5z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Test;

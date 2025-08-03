import React from 'react';
import GlareHover from '../components/ui/GlareHover';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaSearch } from 'react-icons/fa';
import { NowPlayingBar } from '../components/NowPlayingBar';
import { useAudio } from '../lib/AudioContext';

const Index = () => {
  const navigate = useNavigate();
  // Use the global audio context

  // Get current song info from context
  const { initializeSong, songUrl } = useAudio();

  
  // Only initialize the default song if not already set
  React.useEffect(() => {
    if (songUrl === '/test-song.mp3') return;
    initializeSong({
      songUrl: '/test-song.mp3',
      songTitle: 'Test Song',
      artist: 'Demo Artist',
      albumCoverUrl: '/placeholder.svg'
    });
  }, [initializeSong, songUrl]);

  // Sample data for daily mix cards
const dailyMixes = [
    {
        id: 1,
        number: '01',
        color: 'cyan',
        title: 'About',
        description: 'Learn more about the project',
        path: '/home',
        image: '/neurons.jpg',
    },
    {
        id: 2,
        number: '02',
        color: 'yellow',
        title: 'Processing',
        description: 'Process and analyze audio data',
        path: '/animatedpreprocessing',
        image: '/placeholder.svg',
    },
    {
        id: 3,
        number: '03',
        color: 'red',
        title: 'Mental Health',
        description: 'Brain activity dashboard',
        path: '/mental-state',
        image: '/placeholder.svg',
    },
    {
        id: 4,
        number: '04',
        color: 'pink',
        title: 'Login',
        description: 'Sign in to your account',
        path: '/login',
        image: '/placeholder.svg',
    },
];




  return (
    <>


      <div className="flex flex-col h-screen bg-[#121212] text-white">
        {/* Top Navigation */}
        <div className="relative flex items-center justify-between p-4">
          {/* Right side content */}
          <div className="flex items-center gap-4 ml-auto">
            <div className="text-[#B3B3B3] hover:text-white cursor-pointer">
            </div>
          </div>
        </div>

        {/* Home and Search - centered, profile left */}
        <div className="flex items-center justify-center mb-8 relative mt-8">
          <div className="flex items-center gap-4 mx-auto">
            <button
              className="p-4 rounded-full bg-[#2A2A2A] text-[#B3B3B3] focus:outline-none hover:bg-[#383838] transition-colors"
              onClick={() => navigate('/home')}
              aria-label="Go to Home"
            >
              <FaHome size={36} />
            </button>
            <div className="flex items-center rounded-full bg-[#2A2A2A] px-6 py-4 w-[340px]">
              <FaSearch className="text-[#B3B3B3] mr-4" size={24} />
              <input
                type="text"
                placeholder="What do you want to play?"
                className="bg-transparent border-none outline-none text-[#B3B3B3] w-full text-lg"
              />
            </div>
          </div>
        </div>

        {/* Main Content shifted down */}
        <div className="flex-1 overflow-auto p-4">
          <div className="mt-16"> {/* Add margin-top to move content down */}

            {/* Daily mix cards */}
            <div className="flex flex-row gap-8 mb-6 px-12 -mt-20">
              {dailyMixes.map((mix) => (
                <div key={mix.id} className="w-1/4 min-w-[200px] max-w-[320px]">
                  <GlareHover
                    className={
                      `relative rounded-lg p-3 transition-colors cursor-pointer overflow-hidden border-2 border-white group bg-black`
                    }
                    style={{
                      width: '100%',
                      height: '100%',
                      color: 'black',
                      minWidth: 0
                    }}
                  >
                    {/* Glare animation overlay */}
                    <div
                      className="pointer-events-none absolute inset-0 z-10"
                      style={{
                        background: 'linear-gradient(120deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 60%, rgba(255,255,255,0.18) 100%)',
                        mixBlendMode: 'lighten',
                        opacity: 0.7,
                        transition: 'opacity 0.4s',
                      }}
                    />
                    <div onClick={() => navigate(mix.path)} style={{ width: '100%', height: '100%' }} className="absolute inset-0 z-20 cursor-pointer" />
                    {/* Black tint overlay on hover */}
                    <div className="pointer-events-none absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-200 z-10" />
                    <div
                      className="relative -lg overflow-hidden"
                      style={{
                        backgroundColor:
                          mix.color === 'cyan' ? '#01fffd' :
                          mix.color === 'yellow' ? '#f4fd47' :
                          mix.color === 'red' ? '#fd4831' :
                          mix.color === 'pink' ? '#f69bd2' :
                          '#afb0fe',
                      }}
                    >
                      <img
                        src={mix.image}
                        alt={`Daily Mix ${mix.number}`}
                        className="w-full aspect-square object-cover mb-4"
                      />
                      <div 
                        className="absolute bottom-8 left-2 px-2 py-1 text-sm font-medium border border-white/30"
                        style={{
                          backgroundColor:
                            mix.color === 'cyan' ? '#01fffd' :
                            mix.color === 'yellow' ? '#f4fd47' :
                            mix.color === 'red' ? '#fd4831' :
                            mix.color === 'pink' ? '#f69bd2' :
                            '#afb0fe',
                          color: 'black'
                        }}
                      >
                        {mix.description}
                      </div>
                      <div 
                        className="absolute bottom-8 right-2 px-3 py-1 text-2xl font-bold border border-white/30"
                        style={{
                          backgroundColor:
                            mix.color === 'cyan' ? '#01fffd' :
                            mix.color === 'yellow' ? '#f4fd47' :
                            mix.color === 'red' ? '#fd4831' :
                            mix.color === 'pink' ? '#f69bd2' :
                            '#afb0fe',
                          color: 'black'
                        }}
                      >
                        {mix.number}
                      </div>
                    </div>
                    <h3
                      className="font-bold text-2xl mt-6"
                      style={{
                        color:
                          mix.color === 'cyan' ? '#01fffd' :
                          mix.color === 'yellow' ? '#f4fd47' :
                          mix.color === 'red' ? '#fd4831' :
                          mix.color === 'pink' ? '#f69bd2' :
                          '#afb0fe'
                      }}
                    >
                      {mix.title}
                    </h3>
                    <p className="text-sm text-white">{mix.description}</p>
                  </GlareHover>
                </div>
              ))}
            </div>
          </div> {/* end mt-16 */}
        </div> {/* end flex-1 */}
        {/* Now Playing Bar Component */}
        <NowPlayingBar />
      </div>
      </>
  );
};

export default Index;

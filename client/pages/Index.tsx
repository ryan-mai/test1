import { ChevronLeft, ChevronRight, MoreHorizontal, SlidersHorizontal } from "lucide-react";
import { NowPlayingBar } from "../components/NowPlayingBar";

const MusicStreamingHome = () => {
  return (
    <div className="min-h-screen bg-music-bg-primary text-music-text-primary pb-20">
      {/* Navigation Header */}
      <div className="sticky top-0 z-50 backdrop-blur-[50px] bg-music-bg-primary/80 border-b border-music-border">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3">
          {/* Filter Tabs */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-hide">
            <div className="inline-flex items-center gap-3 px-3 sm:px-4 py-2 rounded-lg bg-music-text-primary text-music-bg-primary font-semibold text-sm tracking-wide whitespace-nowrap">
              All
            </div>
            <div className="inline-flex items-center gap-3 px-3 sm:px-4 py-2 rounded-lg bg-white/5 text-music-text-primary text-sm tracking-wide whitespace-nowrap">
              Music
            </div>
            <div className="inline-flex items-center gap-3 px-3 sm:px-4 py-2 rounded-lg bg-white/5 text-music-text-primary text-sm tracking-wide whitespace-nowrap">
              Podcasts
            </div>
            <div className="inline-flex items-center gap-3 px-3 sm:px-4 py-2 rounded-lg bg-white/5 text-music-text-primary text-sm tracking-wide whitespace-nowrap">
              Audiobooks
            </div>
          </div>
          
          {/* Settings Button */}
          <button className="p-3 hover:bg-white/5 rounded-lg transition-colors">
            <SlidersHorizontal className="w-5 h-5 text-music-text-secondary" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 py-6 sm:py-8 space-y-8 sm:space-y-10">
        {/* Made For You Section */}
        <MadeForYouSection />
        
        {/* Your Top Mixes Section */}
        <YourTopMixesSection />
        
        {/* Your Favorite Artists Section */}
        <YourFavoriteArtistsSection />
        
        {/* Albums for You Section */}
        <AlbumsForYouSection />
        
        {/* Audiobooks for you Section */}
        <AudiobooksSection />
        
        {/* Podcasts for you Section */}
        <PodcastsSection />
        
        {/* Episodes for you Section */}
        <EpisodesSection />
      </div>

      {/* Fixed Now Playing Bar */}
      <NowPlayingBar />
    </div>
  );
};

// Section Header Component
const SectionHeader = ({ title }: { title: string }) => (
  <div className="flex items-center justify-between">
    <h2 className="text-xl font-bold text-music-text-primary tracking-wide">{title}</h2>
    <div className="flex items-center gap-1">
      <button className="p-2 opacity-50 hover:opacity-100 transition-opacity">
        <ChevronLeft className="w-6 h-6 text-music-text-secondary" />
      </button>
      <button className="p-2 hover:opacity-75 transition-opacity">
        <ChevronRight className="w-6 h-6 text-music-text-secondary" />
      </button>
      <button className="p-2 hover:opacity-75 transition-opacity">
        <MoreHorizontal className="w-6 h-6 text-music-text-secondary" />
      </button>
    </div>
  </div>
);

// Playlist Card Component
const PlaylistCard = ({
  title,
  description,
  count,
  accentColor,
  images = []
}: {
  title: string;
  description: string;
  count: string;
  accentColor: string;
  images?: string[];
}) => (
  <div className="flex-none w-[150px] sm:w-[170px] group">
    <div className="space-y-2">
      {/* Card Stack Effect */}
      <div className="relative">
        <div 
          className="h-2 rounded-t-lg opacity-15"
          style={{ 
            background: accentColor,
            width: '133px',
            marginLeft: '18.5px'
          }}
        />
        <div 
          className="h-2 rounded-t-lg opacity-30 -mt-1"
          style={{ 
            background: accentColor,
            width: '154px',
            marginLeft: '8px'
          }}
        />
        
        {/* Main Image */}
        <div className="w-[170px] h-[170px] rounded-lg bg-music-bg-secondary overflow-hidden relative -mt-1">
          {images.length > 0 ? (
            <div className="grid grid-cols-2 gap-0 h-full">
              {images.slice(0, 4).map((img, idx) => (
                <img 
                  key={idx}
                  src={img} 
                  alt=""
                  className="w-full h-full object-cover"
                />
              ))}
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-music-bg-secondary to-music-bg-primary" />
          )}
        </div>
      </div>
      
      {/* Card Info */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-music-text-primary tracking-wide truncate">
            {title}
          </h3>
          <span 
            className="text-sm font-normal tracking-wide"
            style={{ color: accentColor }}
          >
            {count}
          </span>
        </div>
        <p className="text-xs text-music-text-secondary leading-normal">
          {description}
        </p>
      </div>
    </div>
  </div>
);

// Made For You Section
const MadeForYouSection = () => (
  <section className="space-y-4">
    <SectionHeader title="Made For You" />
    <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
      <PlaylistCard
        title="Discover Weekly"
        description="Your weekly mixtape of fresh music."
        count="50"
        accentColor="#CE6E9A"
        images={[
          "https://api.builder.io/api/v1/image/assets/TEMP/fdc92ce7ed345ae66d147a941b08be6c8a31a957?width=85",
          "https://api.builder.io/api/v1/image/assets/TEMP/38aff501f0c42a669d93ef112f8bdccc887276e2?width=85"
        ]}
      />
      <PlaylistCard
        title="Daily Mix 1"
        description="Linkin Park, System Of A Down, Coal Chamber..."
        count="50"
        accentColor="#95E6D3"
        images={[
          "https://api.builder.io/api/v1/image/assets/TEMP/fdc92ce7ed345ae66d147a941b08be6c8a31a957?width=85",
          "https://api.builder.io/api/v1/image/assets/TEMP/38aff501f0c42a669d93ef112f8bdccc887276e2?width=85",
          "https://api.builder.io/api/v1/image/assets/TEMP/49220cb455feda938f994229cdd7b15a4dce3fd5?width=85"
        ]}
      />
      <PlaylistCard
        title="Daily Mix 2"
        description="Avril Lavigne, Lorde, Charli XCX and more"
        count="50"
        accentColor="#F4B8BD"
        images={[
          "https://api.builder.io/api/v1/image/assets/TEMP/fdc92ce7ed345ae66d147a941b08be6c8a31a957?width=85",
          "https://api.builder.io/api/v1/image/assets/TEMP/38aff501f0c42a669d93ef112f8bdccc887276e2?width=85",
          "https://api.builder.io/api/v1/image/assets/TEMP/49220cb455feda938f994229cdd7b15a4dce3fd5?width=85",
          "https://api.builder.io/api/v1/image/assets/TEMP/d9e15420823e5bb4e980f6f0dcaa25bfea60acbe?width=85"
        ]}
      />
      <PlaylistCard
        title="Daily Mix 3"
        description="The Strokes, Martin Garrix, MGMT and more"
        count="50"
        accentColor="#C3E7B7"
        images={[
          "https://api.builder.io/api/v1/image/assets/TEMP/fdc92ce7ed345ae66d147a941b08be6c8a31a957?width=85",
          "https://api.builder.io/api/v1/image/assets/TEMP/38aff501f0c42a669d93ef112f8bdccc887276e2?width=85",
          "https://api.builder.io/api/v1/image/assets/TEMP/49220cb455feda938f994229cdd7b15a4dce3fd5?width=85",
          "https://api.builder.io/api/v1/image/assets/TEMP/d9e15420823e5bb4e980f6f0dcaa25bfea60acbe?width=85"
        ]}
      />
      <PlaylistCard
        title="Daily Mix 4"
        description="Chuck Berry, Elvis Presley, Roy Orbison and more"
        count="50"
        accentColor="#F37FA6"
        images={[
          "https://api.builder.io/api/v1/image/assets/TEMP/fdc92ce7ed345ae66d147a941b08be6c8a31a957?width=68",
          "https://api.builder.io/api/v1/image/assets/TEMP/38aff501f0c42a669d93ef112f8bdccc887276e2?width=68",
          "https://api.builder.io/api/v1/image/assets/TEMP/49220cb455feda938f994229cdd7b15a4dce3fd5?width=68",
          "https://api.builder.io/api/v1/image/assets/TEMP/d9e15420823e5bb4e980f6f0dcaa25bfea60acbe?width=68"
        ]}
      />
      <PlaylistCard
        title="Daily Mix 5"
        description="Frank Sinatra, Gerhard Trede, Dean Martin and more"
        count="50"
        accentColor="#A0BEC8"
        images={[
          "https://api.builder.io/api/v1/image/assets/TEMP/fdc92ce7ed345ae66d147a941b08be6c8a31a957?width=68",
          "https://api.builder.io/api/v1/image/assets/TEMP/38aff501f0c42a669d93ef112f8bdccc887276e2?width=68",
          "https://api.builder.io/api/v1/image/assets/TEMP/49220cb455feda938f994229cdd7b15a4dce3fd5?width=68",
          "https://api.builder.io/api/v1/image/assets/TEMP/d9e15420823e5bb4e980f6f0dcaa25bfea60acbe?width=68"
        ]}
      />
      <PlaylistCard
        title="Nirvana Radio"
        description="The Strokes, Martin Garrix, MGMT and more"
        count="50"
        accentColor="#FDD87D"
        images={[
          "https://api.builder.io/api/v1/image/assets/TEMP/fdc92ce7ed345ae66d147a941b08be6c8a31a957?width=68",
          "https://api.builder.io/api/v1/image/assets/TEMP/38aff501f0c42a669d93ef112f8bdccc887276e2?width=68",
          "https://api.builder.io/api/v1/image/assets/TEMP/49220cb455feda938f994229cdd7b15a4dce3fd5?width=68",
          "https://api.builder.io/api/v1/image/assets/TEMP/d9e15420823e5bb4e980f6f0dcaa25bfea60acbe?width=68"
        ]}
      />
      <PlaylistCard
        title="Fall Out Boy Radio"
        description="With Panic! At The Disco, The All-American Rejects,..."
        count="50"
        accentColor="#D4B2A9"
        images={[
          "https://api.builder.io/api/v1/image/assets/TEMP/fdc92ce7ed345ae66d147a941b08be6c8a31a957?width=68",
          "https://api.builder.io/api/v1/image/assets/TEMP/38aff501f0c42a669d93ef112f8bdccc887276e2?width=68",
          "https://api.builder.io/api/v1/image/assets/TEMP/49220cb455feda938f994229cdd7b15a4dce3fd5?width=68",
          "https://api.builder.io/api/v1/image/assets/TEMP/d9e15420823e5bb4e980f6f0dcaa25bfea60acbe?width=68"
        ]}
      />
    </div>
  </section>
);

// Simple Mix Card Component
const SimpleMixCard = ({ 
  title, 
  description, 
  count, 
  accentColor,
  image
}: {
  title: string;
  description: string;
  count: string;
  accentColor: string;
  image: string;
}) => (
  <div className="flex-none w-[170px] group">
    <div className="space-y-2">
      {/* Card Stack Effect */}
      <div className="relative">
        <div 
          className="h-2 rounded-t-lg opacity-15"
          style={{ 
            background: accentColor,
            width: '133px',
            marginLeft: '18.5px'
          }}
        />
        <div 
          className="h-2 rounded-t-lg opacity-30 -mt-1"
          style={{ 
            background: accentColor,
            width: '154px',
            marginLeft: '8px'
          }}
        />
        
        {/* Main Image */}
        <div className="w-[170px] h-[170px] rounded-lg bg-music-bg-secondary overflow-hidden relative -mt-1">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      
      {/* Card Info */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-music-text-primary tracking-wide truncate">
            {title}
          </h3>
          <span 
            className="text-sm font-normal tracking-wide"
            style={{ color: accentColor }}
          >
            {count}
          </span>
        </div>
        <p className="text-xs text-music-text-secondary leading-normal">
          {description}
        </p>
      </div>
    </div>
  </div>
);

// Your Top Mixes Section
const YourTopMixesSection = () => (
  <section className="space-y-4">
    <SectionHeader title="Your top mixes" />
    <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
      <SimpleMixCard
        title="Rock Mix"
        description="Red Hot Chili Peppers, R.E.M., Guns N' Roses..."
        count="50"
        accentColor="#CCF665"
        image="https://api.builder.io/api/v1/image/assets/TEMP/6cf4047b669555362420b7327af57ec5b901434a?width=170"
      />
      <SimpleMixCard
        title="Chill Mix"
        description="MF DOOM, Daft Punk, The Chainsmokers, and more"
        count="50"
        accentColor="#F9E72C"
        image="https://api.builder.io/api/v1/image/assets/TEMP/3cef616aaecee72d3002a44e091c516ca68232fb?width=170"
      />
      <SimpleMixCard
        title="Pop Mix"
        description="Red Hot Chili Peppers, R.E.M., Guns N' Roses..."
        count="50"
        accentColor="#9BF0E2"
        image="https://api.builder.io/api/v1/image/assets/TEMP/15efbf216a989ca1114385d01b4d7cae06484e1b?width=170"
      />
      <SimpleMixCard
        title="Daft Punk Mix"
        description="Daft Punk, MGMT, Muse, and more"
        count="50"
        accentColor="#6F86FF"
        image="https://api.builder.io/api/v1/image/assets/TEMP/957a625d17e48409117bf7c0f109d20c9427ea67?width=170"
      />
      <SimpleMixCard
        title="Happy Mix"
        description="The Turtles, Van Morrison, ABBA and more"
        count="50"
        accentColor="#FFCBD4"
        image="https://api.builder.io/api/v1/image/assets/TEMP/33c9fca15c04f8e340430a6a98f30a2fce7c9a56?width=170"
      />
      <SimpleMixCard
        title="David Bowie Mix"
        description="Soft Cell, The Who and The Clash"
        count="50"
        accentColor="#FFC668"
        image="https://api.builder.io/api/v1/image/assets/TEMP/26de1c702105e17d0c0fcdf27374068962007315?width=170"
      />
      <SimpleMixCard
        title="Upbeat Mix"
        description="Kylie Minogue, Charli XCX, Cage The Elephant and..."
        count="50"
        accentColor="#27856B"
        image="https://api.builder.io/api/v1/image/assets/TEMP/fadda93c902dafb0eaa4283ce7290e3b0944ca8e?width=170"
      />
      <SimpleMixCard
        title="60s Mix"
        description="Chuck Berry, Skeeter David, Van Morrison and..."
        count="50"
        accentColor="#DD138B"
        image="https://api.builder.io/api/v1/image/assets/TEMP/12086cdb2507d30b0cd50eabbe78a72877120e54?width=170"
      />
    </div>
  </section>
);

// Artist Card Component
const ArtistCard = ({ name, image }: { name: string; image: string }) => (
  <div className="flex-none flex flex-col items-center space-y-3">
    <div className="w-[170px] h-[170px] rounded-full overflow-hidden">
      <img 
        src={image} 
        alt={name}
        className="w-full h-full object-cover"
      />
    </div>
    <p className="text-sm font-medium text-music-text-primary">{name}</p>
  </div>
);

// Your Favorite Artists Section
const YourFavoriteArtistsSection = () => (
  <section className="space-y-4">
    <SectionHeader title="Your favorite artists" />
    <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
      <ArtistCard
        name="Guns N' Roses"
        image="https://api.builder.io/api/v1/image/assets/TEMP/ba49e4c1407707a215aa3c3e2ef7f1673fbd98a3?width=170"
      />
      <ArtistCard
        name="Daft Punk"
        image="https://api.builder.io/api/v1/image/assets/TEMP/b529b3bf09799a7f5dba03f36cc817c614479859?width=170"
      />
      <ArtistCard
        name="David Bowie"
        image="https://api.builder.io/api/v1/image/assets/TEMP/5ece59f4cfd3c28e86a40aef01e08552ba66d410?width=170"
      />
    </div>
  </section>
);

// Album Card Component
const AlbumCard = ({ 
  title, 
  artist, 
  trackCount, 
  image,
  accentColor 
}: {
  title: string;
  artist: string;
  trackCount: string;
  image: string;
  accentColor: string;
}) => (
  <div className="flex-none w-[170px] space-y-2">
    <div className="relative">
      <div 
        className="h-2 rounded-t-lg opacity-30"
        style={{ 
          background: accentColor,
          width: '157px',
          marginLeft: '6.5px'
        }}
      />
      <div className="w-[170px] h-[170px] rounded-lg overflow-hidden -mt-1">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
    
    <div className="space-y-2">
      <div className="flex items-start justify-between">
        <h3 className="text-sm font-medium text-music-text-primary tracking-wide truncate pr-2">
          {title}
        </h3>
        <span className="text-sm text-music-text-secondary tracking-wide flex-shrink-0">
          {trackCount}
        </span>
      </div>
      <p className="text-xs text-music-text-secondary">
        {artist}
      </p>
    </div>
  </div>
);

// Albums for You Section
const AlbumsForYouSection = () => (
  <section className="space-y-4">
    <SectionHeader title="Albums for You" />
    <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
      <AlbumCard
        title="Meteora"
        artist="Linkin Park"
        trackCount="13"
        image="https://api.builder.io/api/v1/image/assets/TEMP/960747fff14b1f54230227f838aa1b8e5d00df6b?width=170"
        accentColor="#A69174"
      />
      <AlbumCard
        title="Random Access Memories"
        artist="Daft Punk"
        trackCount="13"
        image="https://api.builder.io/api/v1/image/assets/TEMP/960747fff14b1f54230227f838aa1b8e5d00df6b?width=170"
        accentColor="#BBB4D8"
      />
      <AlbumCard
        title="Abbey Road"
        artist="The Beatles"
        trackCount="13"
        image="https://api.builder.io/api/v1/image/assets/TEMP/960747fff14b1f54230227f838aa1b8e5d00df6b?width=170"
        accentColor="#75A496"
      />
      <AlbumCard
        title="Black Holes and Revelations"
        artist="Muse"
        trackCount="13"
        image="https://api.builder.io/api/v1/image/assets/TEMP/960747fff14b1f54230227f838aa1b8e5d00df6b?width=170"
        accentColor="#6278B1"
      />
    </div>
  </section>
);

// Audiobook Card Component
const AudiobookCard = ({ title, author, image }: { title: string; author: string; image: string }) => (
  <div className="flex-none w-[170px] space-y-2">
    <div className="w-[170px] h-[219px] rounded-lg overflow-hidden">
      <img 
        src={image} 
        alt={title}
        className="w-full h-full object-cover"
      />
    </div>
    
    <div className="space-y-2">
      <h3 className="text-sm font-normal text-music-text-primary tracking-wide">
        {title}
      </h3>
      <p className="text-xs text-music-text-secondary">
        {author}
      </p>
    </div>
  </div>
);

// Audiobooks Section
const AudiobooksSection = () => (
  <section className="space-y-4">
    <SectionHeader title="Audiobooks for you" />
    <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
      <AudiobookCard
        title="Halo: The Flood"
        author="William C. Dietz"
        image="https://api.builder.io/api/v1/image/assets/TEMP/960747fff14b1f54230227f838aa1b8e5d00df6b?width=170"
      />
      <AudiobookCard
        title="Halo: First Strike"
        author="Eric Nylund"
        image="https://api.builder.io/api/v1/image/assets/TEMP/960747fff14b1f54230227f838aa1b8e5d00df6b?width=170"
      />
      <AudiobookCard
        title="Halo: Ghosts of Onyx"
        author="Eric Nylund"
        image="https://api.builder.io/api/v1/image/assets/TEMP/960747fff14b1f54230227f838aa1b8e5d00df6b?width=170"
      />
    </div>
  </section>
);

// Podcast Card Component
const PodcastCard = ({ 
  title, 
  author, 
  image, 
  accentColor 
}: {
  title: string;
  author: string;
  image: string;
  accentColor: string;
}) => (
  <div className="flex-none w-[170px] space-y-2">
    <div className="w-[170px] h-[170px] rounded-lg overflow-hidden">
      <img 
        src={image} 
        alt={title}
        className="w-full h-full object-cover"
      />
    </div>
    
    <div className="rounded-md p-3 relative" style={{ backgroundColor: `${accentColor}0D` }}>
      <div 
        className="absolute left-0 top-0 w-1 h-full rounded-r"
        style={{ backgroundColor: `${accentColor}99` }}
      />
      <div className="space-y-2">
        <h3 className="text-base font-normal text-music-text-primary tracking-wide">
          {title}
        </h3>
        <p className="text-sm text-music-text-secondary tracking-wide">
          {author}
        </p>
      </div>
    </div>
  </div>
);

// Podcasts Section
const PodcastsSection = () => (
  <section className="space-y-4">
    <SectionHeader title="Podcasts for you" />
    <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
      <PodcastCard
        title="anything goes..."
        author="emma chamberlain"
        image="https://api.builder.io/api/v1/image/assets/TEMP/960747fff14b1f54230227f838aa1b8e5d00df6b?width=170"
        accentColor="#85C585"
      />
      <PodcastCard
        title="The Joe Rogan..."
        author="Joe Rogan"
        image="https://api.builder.io/api/v1/image/assets/TEMP/960747fff14b1f54230227f838aa1b8e5d00df6b?width=170"
        accentColor="#F1CEBC"
      />
      <PodcastCard
        title="The Journal"
        author="The Wall Street Journal"
        image="https://api.builder.io/api/v1/image/assets/TEMP/960747fff14b1f54230227f838aa1b8e5d00df6b?width=170"
        accentColor="#F67D4D"
      />
    </div>
  </section>
);

// Episode Card Component with Video Icon
const EpisodeCard = ({ 
  title, 
  author, 
  image, 
  accentColor,
  hasVideo = false
}: {
  title: string;
  author: string;
  image: string;
  accentColor: string;
  hasVideo?: boolean;
}) => (
  <div className="flex-none w-[170px] space-y-2">
    <div className="w-[170px] h-[170px] rounded-lg overflow-hidden">
      <img 
        src={image} 
        alt={title}
        className="w-full h-full object-cover"
      />
    </div>
    
    <div className="rounded-md p-3" style={{ backgroundColor: `${accentColor}0D` }}>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {hasVideo && (
            <div className="w-6 h-6 border border-current rounded flex items-center justify-center" style={{ borderColor: accentColor }}>
              <div className="w-2 h-2 bg-current rounded-sm" style={{ backgroundColor: accentColor }} />
            </div>
          )}
          <h3 className="text-base font-normal text-music-text-primary tracking-wide">
            {title}
          </h3>
        </div>
        <p className="text-sm text-music-text-secondary tracking-wide">
          {author}
        </p>
      </div>
    </div>
  </div>
);

// Episodes Section
const EpisodesSection = () => (
  <section className="space-y-4">
    <SectionHeader title="Episodes for you" />
    <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
      <EpisodeCard
        title="anything goes..."
        author="emma chamberlain"
        image="https://api.builder.io/api/v1/image/assets/TEMP/960747fff14b1f54230227f838aa1b8e5d00df6b?width=170"
        accentColor="#85C585"
        hasVideo={true}
      />
      <EpisodeCard
        title="The Joe Rogan..."
        author="Joe Rogan"
        image="https://api.builder.io/api/v1/image/assets/TEMP/960747fff14b1f54230227f838aa1b8e5d00df6b?width=170"
        accentColor="#F1CEBC"
      />
      <EpisodeCard
        title="The Journal"
        author="The Wall Street Journal"
        image="https://api.builder.io/api/v1/image/assets/TEMP/960747fff14b1f54230227f838aa1b8e5d00df6b?width=170"
        accentColor="#F67D4D"
      />
    </div>
  </section>
);

export default MusicStreamingHome;

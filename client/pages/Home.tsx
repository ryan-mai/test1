import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Calendar, Clock, Compass, FileText, Image, Laptop, Lightbulb, MessageSquare, Music, User, Video } from "lucide-react";
import { NowPlayingBar } from "@/components/NowPlayingBar";
import { Link } from "react-router-dom";
import SpotlightCard from "../components/SpotlightCard";
import RollingGallery from "../components/RollingGallery";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/resizable-navbar";

export default function Home() {
  const [email, setEmail] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header - Resizable Navbar, sticky to top */}
      <Navbar className="sticky top-0 z-40 mt-8">
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems 
            items={[ 
              { name: "Music", link: "/music-recommendation" },
              { name: "Mental State", link: "/mental-state" },
              { name: "Library", link: "/library" },
              { name: "About", link: "/about" }
            ]} 
          />
          <div className="relative z-20 flex items-center gap-4">
          <NavbarButton variant="primary" as="a" href="/login" style={{ backgroundColor: '#1DB954', borderColor: '#1DB954', color: '#fff' }}>
            Log in
          </NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <a href="/" className="flex items-center space-x-2">
              <Brain className="h-6 w-6" />
              <span className="font-bold">Legoat</span>
            </a>
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {[
              { name: "Music", link: "/music-recommendation" },
              { name: "Mental State", link: "/mental-state" },
              { name: "Library", link: "/library" },
              { name: "About", link: "/about" }
            ].map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="secondary"
                as="a"
                href="/login"
                className="w-full"
                style={{ backgroundColor: '#1DB954', borderColor: '#1DB954', color: '#fff' }}
              >
                Log in
              </NavbarButton>
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                as="a"
                href="/login"
                className="w-full"
                style={{ backgroundColor: '#1DB954', borderColor: '#1DB954', color: '#fff' }}
              >
                Log in
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>


      {/* Hero Section */}
      <section className="container py-12 md:py-24 lg:py-32 space-y-8">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <div className="mb-4 w-full flex justify-center">
          </div>
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
            Synthesizing Stress with Harmony
          </h1>
          <p className="max-w-[36rem] text-muted-foreground md:text-xl">
            Transform your brain waves into personalized music recommendations.
            Experience the future of audio-neural connection.
          </p>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input 
              type="text" 
              placeholder="Type something..." 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button 
              type="button" 
              onClick={() => window.location.href = '/mental-state'}
            >
              Generate
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-12 md:py-24 lg:py-32 space-y-8">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl">
            Discover the Power of Neuro-Audio Technology
          </h2>
          <p className="max-w-[36rem] text-muted-foreground md:text-xl">
            Our platform combines EEG data with advanced music recommendation algorithms to create a uniquely personalized experience.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <SpotlightCard>
            <CardHeader>
              <Compass className="h-6 w-6 mb-2" />
              <CardTitle>Neuro-Music Matching</CardTitle>
              <CardDescription>
                Our algorithms match your brain activity patterns with music that resonates with your current mental state.
              </CardDescription>
            </CardHeader>
          </SpotlightCard>
          <SpotlightCard>
            <CardHeader>
              <Brain className="h-6 w-6 mb-2" />
              <CardTitle>Mental State Analysis</CardTitle>
              <CardDescription>
                Track your mental states over time and see how different music affects your brain activity.
              </CardDescription>
            </CardHeader>
          </SpotlightCard>
          <SpotlightCard>
            <CardHeader>
              <Music className="h-6 w-6 mb-2" />
              <CardTitle>Personalized Playlists</CardTitle>
              <CardDescription>
                Get curated playlists based on your unique neural patterns and music preferences.
              </CardDescription>
            </CardHeader>
          </SpotlightCard>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl">
            How It Works
          </h2>
          <p className="max-w-[36rem] text-muted-foreground md:text-xl">
            Connecting your brain to music is simpler than you think.
          </p>
        </div>
        <div className="mt-8 flex justify-center">
          <RollingGallery autoplay pauseOnHover />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container py-12 md:py-24 lg:py-32 space-y-8">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl">
            What Our Users Say
          </h2>
          <p className="max-w-[36rem] text-muted-foreground md:text-xl">
            Join thousands of users experiencing the perfect music for their mental state.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4">
                <p className="text-sm italic text-muted-foreground">
                  "Legoat completely changed how I experience music. The recommendations are eerily perfect for my mood and mental state."
                </p>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-secondary" />
                  <div>
                    <p className="text-sm font-medium">Sarah K.</p>
                    <p className="text-xs text-muted-foreground">Neuroscience Student</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4">
                <p className="text-sm italic text-muted-foreground">
                  "As a music producer, this tool helps me understand how my compositions affect listeners on a neural level. Game changer!"
                </p>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-secondary" />
                  <div>
                    <p className="text-sm font-medium">Marcus J.</p>
                    <p className="text-xs text-muted-foreground">Music Producer</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4">
                <p className="text-sm italic text-muted-foreground">
                  "I use Legoat during my meditation sessions. The way it adapts to my changing mental states is truly revolutionary."
                </p>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-secondary" />
                  <div>
                    <p className="text-sm font-medium">Olivia T.</p>
                    <p className="text-xs text-muted-foreground">Meditation Coach</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl">
            Ready to Connect Your Mind to Music?
          </h2>
          <p className="max-w-[36rem] text-muted-foreground md:text-xl">
            Join our platform today and experience music in a whole new dimension.
          </p>
          <Button size="lg" asChild>
            <Link to="/login">Get Started</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 Legoat. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              About
            </Link>
            <Link to="/library" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Library
            </Link>
            <Link to="/settings" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Settings
            </Link>
          </div>
        </div>
      </footer>

      {/* Now Playing Bar */}
      <NowPlayingBar />
    </div>
  );
}

// Brain Icon Component (since it's not imported from lucide-react)
function Brain(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
    </svg>
  );
}

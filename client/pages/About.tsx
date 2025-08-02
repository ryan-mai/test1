import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Brain, 
  Shield, 
  Users, 
  Music, 
  Zap, 
  Heart, 
  Lock,
  HelpCircle,
  FileText,
  Settings,
  Mail
} from "lucide-react";

export default function About() {
  const [activeTab, setActiveTab] = useState("about");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="font-semibold">Back to Home</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-12">
        <div className="mx-auto max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-spotify-green rounded-full mb-6">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              About <span className="text-spotify-green">Legoat</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connecting your mind to music through advanced EEG technology and AI-powered recommendations.
            </p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
              <TabsTrigger value="help">Help</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>

            {/* About Tab */}
            <TabsContent value="about" className="space-y-6 mt-8">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                                             <Brain className="h-5 w-5 text-spotify-green" />
                      Our Mission
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Legoat revolutionizes music discovery by analyzing your brainwave patterns to create 
                      personalized music recommendations that match your current mental state and emotional needs.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                                             <Zap className="h-5 w-5 text-spotify-green" />
                      How It Works
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Using advanced EEG technology, we capture your brain activity patterns and use 
                      machine learning algorithms to match them with music that resonates with your neural state.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                                             <Music className="h-5 w-5 text-spotify-green" />
                      Music Library
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Access millions of songs, playlists, and albums curated specifically for your 
                      brain activity patterns and musical preferences.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                                             <Heart className="h-5 w-5 text-spotify-green" />
                      Mental Wellness
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Track your mental states over time and discover how different music affects 
                      your brain activity and emotional well-being.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Features Section */}
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Key Features</h2>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-spotify-green/10 rounded-full flex items-center justify-center mt-1">
                      <span className="text-spotify-green font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">EEG Integration</h3>
                      <p className="text-sm text-muted-foreground">Connect compatible EEG devices for real-time brain activity monitoring.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-spotify-green/10 rounded-full flex items-center justify-center mt-1">
                      <span className="text-spotify-green font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">AI Analysis</h3>
                      <p className="text-sm text-muted-foreground">Advanced algorithms analyze your brainwave patterns and mental states.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-spotify-green/10 rounded-full flex items-center justify-center mt-1">
                      <span className="text-spotify-green font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Smart Recommendations</h3>
                      <p className="text-sm text-muted-foreground">Get personalized music suggestions based on your neural activity.</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy" className="space-y-6 mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    Privacy Policy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Data Collection</h3>
                    <p className="text-sm text-muted-foreground">
                      We collect EEG data, music preferences, and usage patterns to provide personalized recommendations. 
                      All data is encrypted and stored securely.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Data Usage</h3>
                    <p className="text-sm text-muted-foreground">
                      Your brain activity data is used solely for music recommendation purposes. 
                      We never sell or share your personal data with third parties.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Data Security</h3>
                    <p className="text-sm text-muted-foreground">
                      All data is encrypted using industry-standard protocols and stored in secure, 
                      HIPAA-compliant servers with regular security audits.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Your Rights</h3>
                    <p className="text-sm text-muted-foreground">
                      You have the right to access, modify, or delete your data at any time. 
                      Contact our support team for assistance.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Help Tab */}
            <TabsContent value="help" className="space-y-6 mt-8">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HelpCircle className="h-5 w-5 text-green-600" />
                      Getting Started
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                      <li>Create an account or sign in to your existing account</li>
                      <li>Connect your compatible EEG device</li>
                      <li>Record a short brain activity sample</li>
                      <li>Receive personalized music recommendations</li>
                      <li>Explore your mental state analysis</li>
                    </ol>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-green-600" />
                      Device Compatibility
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      We support the following EEG devices:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Muse 2 Headband</li>
                      <li>Muse S Headband</li>
                      <li>Emotiv EPOC+</li>
                      <li>OpenBCI Cyton</li>
                      <li>Other BCI-compatible devices</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-green-600" />
                      Troubleshooting
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <div>
                        <strong>Device not connecting?</strong>
                        <p>Ensure your device is charged and Bluetooth is enabled on your device.</p>
                      </div>
                      <div>
                        <strong>Poor signal quality?</strong>
                        <p>Clean the electrodes and ensure proper contact with your scalp.</p>
                      </div>
                      <div>
                        <strong>Recommendations not accurate?</strong>
                        <p>Try recording a longer brain activity sample for better analysis.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-green-600" />
                      Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Need help? Our support team is here for you:
                    </p>
                    <div className="space-y-2 text-sm">
                      <p><strong>Email:</strong> support@legoat.com</p>
                      <p><strong>Live Chat:</strong> Available 24/7</p>
                      <p><strong>Documentation:</strong> Complete guides and tutorials</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Contact Tab */}
            <TabsContent value="contact" className="space-y-6 mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-green-600" />
                    Contact Us
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h3 className="font-semibold mb-3">Get in Touch</h3>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p><strong>General Inquiries:</strong> hello@legoat.com</p>
                        <p><strong>Technical Support:</strong> support@legoat.com</p>
                        <p><strong>Partnerships:</strong> partnerships@legoat.com</p>
                        <p><strong>Press:</strong> press@legoat.com</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">Office Hours</h3>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM PST</p>
                        <p><strong>Saturday:</strong> 10:00 AM - 4:00 PM PST</p>
                        <p><strong>Sunday:</strong> Closed</p>
                        <p><strong>Emergency Support:</strong> 24/7 via email</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}


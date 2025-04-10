
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Timer, Flag, Award, Car, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

const Index = () => {
  // Set the title when the component mounts
  useEffect(() => {
    document.title = "RacePulse - Your Motorsports Companion";
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-racing-black overflow-hidden">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "url('https://source.unsplash.com/random/?formula1,racing')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "grayscale(30%)"
          }}
        />
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
              Your Complete <span className="text-racing-red">Motorsports</span> Companion
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              Live timing, expert insights, and everything you need to get started in the world of motorsports.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-racing-red hover:bg-racing-red/90">
                <Link to="/timing">
                  <Timer className="mr-2 h-5 w-5" />
                  Live Timing
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                <Link to="/chatbot">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Ask Our Chatbot
                </Link>
              </Button>
            </div>
          </div>
        </div>
        {/* Red diagonal divider */}
        <div className="h-10 bg-racing-red transform -skew-y-1 translate-y-2" />
      </div>
      
      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Everything You Need in One Place</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="racing-card p-6">
              <div className="w-12 h-12 bg-racing-red/10 rounded-full flex items-center justify-center mb-4">
                <Timer className="h-6 w-6 text-racing-red" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Live Timing</h3>
              <p className="text-gray-600">
                Follow every millisecond of the action with our real-time timing boards across all major motorsport series.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="racing-card p-6">
              <div className="w-12 h-12 bg-racing-red/10 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-racing-red" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Chatbot</h3>
              <p className="text-gray-600">
                Get answers to all your motorsport questions from our knowledgeable AI assistant.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="racing-card p-6">
              <div className="w-12 h-12 bg-racing-red/10 rounded-full flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-racing-red" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Championship Trackers</h3>
              <p className="text-gray-600">
                Stay updated with championship standings and points across all competitions and categories.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Series Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Motorsport Series We Cover</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {seriesItems.map((item, index) => (
              <div 
                key={index}
                className="racing-card flex flex-col items-center p-6 hover:shadow-lg transition-shadow"
              >
                <item.icon className="h-8 w-8 text-racing-red mb-3" />
                <h3 className="text-lg font-medium text-center">{item.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-racing-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Enhance Your Motorsport Experience?</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Get real-time insights, expert analysis, and connect with the passionate world of motorsports.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg" className="bg-racing-red hover:bg-racing-red/90">
              <Link to="/timing">
                <Timer className="mr-2 h-5 w-5" />
                View Live Timing
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-racing-black py-8 border-t border-racing-gray/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Flag className="w-5 h-5 text-racing-red" />
              <span className="text-white font-bold">RacePulse</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2025 RacePulse. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Series data
const seriesItems = [
  { name: "Formula 1", icon: Car },
  { name: "MotoGP", icon: Car },
  { name: "WEC", icon: Car },
  { name: "Formula E", icon: Car },
  { name: "IndyCar", icon: Car },
  { name: "NASCAR", icon: Car },
  { name: "WRC", icon: Car },
  { name: "DTM", icon: Car },
];

export default Index;

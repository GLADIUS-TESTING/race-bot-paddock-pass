
import { useState } from "react";
import { Link } from "react-router-dom";
import { Flag, MessageSquare, Timer, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-racing-black text-white py-4 sticky top-0 z-50 border-b border-racing-gray/30">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Flag className="w-6 h-6 text-racing-red" />
          <span className="text-xl font-bold">RacePulse</span>
        </Link>
        
        {/* Mobile menu button */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleMenu}
          className="md:hidden text-white hover:text-racing-red"
        >
          {isMenuOpen ? <X /> : <Menu />}
        </Button>
        
        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="hover:text-racing-red transition-colors">
            Home
          </Link>
          <Link to="/timing" className="hover:text-racing-red transition-colors flex items-center gap-1">
            <Timer className="w-4 h-4" />
            Live Timing
          </Link>
          <Link to="/chatbot" className="hover:text-racing-red transition-colors flex items-center gap-1">
            <MessageSquare className="w-4 h-4" />
            Chatbot
          </Link>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-racing-black border-b border-racing-gray/30 md:hidden">
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <Link 
                to="/" 
                className="hover:text-racing-red transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/timing" 
                className="hover:text-racing-red transition-colors py-2 flex items-center gap-1"
                onClick={() => setIsMenuOpen(false)}
              >
                <Timer className="w-4 h-4" />
                Live Timing
              </Link>
              <Link 
                to="/chatbot" 
                className="hover:text-racing-red transition-colors py-2 flex items-center gap-1"
                onClick={() => setIsMenuOpen(false)}
              >
                <MessageSquare className="w-4 h-4" />
                Chatbot
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

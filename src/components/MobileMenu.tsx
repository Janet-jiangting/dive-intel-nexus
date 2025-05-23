
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { X, Map, Fish, Users, LogIn, UserPlus, Search } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden">
      <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-ocean-900 p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-white" onClick={onClose}>DiveAtlas</Link>
          <Button
            variant="ghost"
            className="text-white hover:bg-ocean-800"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="mt-8 space-y-2">
          <form className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search dive sites..."
              className="flex h-10 w-full rounded-md border border-input bg-ocean-800/50 text-sm text-white shadow-sm transition-colors pl-8 pr-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </form>
          
          <div className="space-y-1 pt-4">
            <Link 
              to="/dive-sites"
              className="flex items-center rounded-md py-2 px-3 text-base font-medium text-white hover:bg-ocean-800"
              onClick={onClose}
            >
              <Map className="mr-3 h-5 w-5" />
              Dive Sites
            </Link>
            <Link 
              to="/marine-life"
              className="flex items-center rounded-md py-2 px-3 text-base font-medium text-white hover:bg-ocean-800"
              onClick={onClose}
            >
              <Fish className="mr-3 h-5 w-5" />
              Marine Life
            </Link>
            <Link 
              to="/community"
              className="flex items-center rounded-md py-2 px-3 text-base font-medium text-white hover:bg-ocean-800"
              onClick={onClose}
            >
              <Users className="mr-3 h-5 w-5" />
              Community
            </Link>
          </div>
          
          <div className="border-t border-ocean-800 pt-6 mt-6">
            <div className="flex flex-col gap-3">
              <Button 
                variant="outline" 
                className="w-full border-ocean-700 text-white hover:bg-ocean-800"
                onClick={onClose}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
              <Button 
                variant="default" 
                className="w-full bg-seagreen-600 hover:bg-seagreen-700 text-white"
                onClick={onClose}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;

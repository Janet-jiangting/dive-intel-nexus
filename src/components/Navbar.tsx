import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Anchor, Menu, X, Map, Fish, Users, Search, Crown 
} from 'lucide-react';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import MobileMenu from './MobileMenu';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-ocean-900/90 backdrop-blur-sm sticky top-0 z-40 w-full border-b border-ocean-800">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex gap-6 items-center">
          <Link 
            to="/" 
            className="flex items-center space-x-2"
          >
            <Anchor className="h-6 w-6 text-ocean-300" />
            <span className="font-bold text-xl text-white">INTO the BLUE</span>
          </Link>
          
          <div className="hidden md:flex">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-white hover:bg-ocean-800 hover:text-white focus:bg-ocean-800">
                    <Map className="mr-2 h-4 w-4" />
                    Dive Sites
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-6 w-[400px] md:w-[500px] lg:w-[600px] lg:grid-cols-2">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            to="/dive-sites"
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-ocean-500/50 to-ocean-900 p-6 no-underline outline-none focus:shadow-md"
                          >
                            <div className="mb-2 mt-4 text-lg font-medium text-white">
                              Explore Dive Sites
                            </div>
                            <p className="text-sm leading-tight text-white/90">
                              Discover top diving locations worldwide with detailed information on marine life, conditions, and more.
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link 
                            to="/dive-sites?filter=popular" 
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-ocean-100 hover:text-ocean-900 focus:bg-ocean-100 focus:text-ocean-900"
                          >
                            <div className="text-sm font-medium leading-none">Popular Sites</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Most visited dive destinations worldwide
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link 
                            to="/dive-sites?filter=coral" 
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-ocean-100 hover:text-ocean-900 focus:bg-ocean-100 focus:text-ocean-900"
                          >
                            <div className="text-sm font-medium leading-none">Coral Reefs</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Best locations for coral reef exploration
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link 
                            to="/dive-sites?filter=wrecks" 
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-ocean-100 hover:text-ocean-900 focus:bg-ocean-100 focus:text-ocean-900"
                          >
                            <div className="text-sm font-medium leading-none">Shipwrecks</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Fascinating wreck dive locations
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/marine-life" className={cn(navigationMenuTriggerStyle(), "bg-transparent text-white hover:bg-ocean-800 hover:text-white focus:bg-ocean-800")}>
                    <Fish className="mr-2 h-4 w-4" />
                    Marine Life
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/community" className={cn(navigationMenuTriggerStyle(), "bg-transparent text-white hover:bg-ocean-800 hover:text-white focus:bg-ocean-800")}>
                    <Users className="mr-2 h-4 w-4" />
                    Community
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/my-ocean" className={cn(navigationMenuTriggerStyle(), "bg-transparent text-white hover:bg-ocean-800 hover:text-white focus:bg-ocean-800")}>
                    <Crown className="mr-2 h-4 w-4" />
                    My Ocean
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <form className="hidden lg:flex relative w-full max-w-sm items-center">
            <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search dive sites..."
              className="flex h-9 w-full rounded-md border border-input bg-ocean-800/50 text-sm text-white shadow-sm transition-colors pl-8 pr-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </form>
          <div className="hidden md:flex items-center">
            <Button variant="ghost" className="text-white hover:bg-ocean-800 hover:text-white">
              Sign In
            </Button>
            <Button variant="default" className="bg-seagreen-600 hover:bg-seagreen-700 text-white">
              Sign Up
            </Button>
          </div>
          <Button
            variant="ghost"
            className="md:hidden text-white hover:bg-ocean-800"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
      
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  );
};

export default Navbar;

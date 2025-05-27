import { Link } from 'react-router-dom';
import { Anchor, Mail, MapPin, Phone, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-ocean-900 text-white">
      <div className="container py-12 px-4 sm:px-6 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Anchor className="h-6 w-6 text-ocean-300" />
              <span className="font-bold text-2xl">INTO the BLUE</span>
            </div>
            <p className="text-ocean-100 mb-6">
              Your comprehensive guide to the underwater world. Explore dive sites, discover marine life, and connect with the global diving community.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-ocean-300 hover:text-white">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-ocean-300 hover:text-white">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-ocean-300 hover:text-white">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-ocean-300 hover:text-white">
                <Youtube size={20} />
                <span className="sr-only">YouTube</span>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6 border-b border-ocean-800 pb-2">Explore</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/dive-sites" className="text-ocean-300 hover:text-white transition">
                  Dive Sites
                </Link>
              </li>
              <li>
                <Link to="/marine-life" className="text-ocean-300 hover:text-white transition">
                  Marine Life
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-ocean-300 hover:text-white transition">
                  Community Forums
                </Link>
              </li>
              <li>
                <Link to="#" className="text-ocean-300 hover:text-white transition">
                  Dive Shops
                </Link>
              </li>
              <li>
                <Link to="#" className="text-ocean-300 hover:text-white transition">
                  Conservation
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6 border-b border-ocean-800 pb-2">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link to="#" className="text-ocean-300 hover:text-white transition">
                  Diving Guides
                </Link>
              </li>
              <li>
                <Link to="#" className="text-ocean-300 hover:text-white transition">
                  Safety Tips
                </Link>
              </li>
              <li>
                <Link to="#" className="text-ocean-300 hover:text-white transition">
                  Equipment Reviews
                </Link>
              </li>
              <li>
                <Link to="#" className="text-ocean-300 hover:text-white transition">
                  Weather Forecasts
                </Link>
              </li>
              <li>
                <Link to="#" className="text-ocean-300 hover:text-white transition">
                  Partners
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6 border-b border-ocean-800 pb-2">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-ocean-400 mr-3 mt-0.5" />
                <span>123 Ocean Avenue, Marine City, MC 98765</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-ocean-400 mr-3" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-ocean-400 mr-3" />
                <span>info@intotheblue.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-ocean-800 text-sm text-ocean-400">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} INTO the BLUE. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link to="#" className="hover:text-white transition">Privacy Policy</Link>
              <Link to="#" className="hover:text-white transition">Terms of Service</Link>
              <Link to="#" className="hover:text-white transition">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

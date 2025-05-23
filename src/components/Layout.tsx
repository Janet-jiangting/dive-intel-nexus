
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  fullHeight?: boolean;
}

const Layout = ({ children, fullHeight = false }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col dark">
      <Navbar />
      <main className={`flex-grow ${fullHeight ? 'flex' : ''}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

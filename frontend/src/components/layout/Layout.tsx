import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Toaster } from 'react-hot-toast';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-50">
        {children}
      </main>
      <Footer />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#4CAF50',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: '#F44336',
              secondary: 'white',
            },
          },
        }}
      />
    </div>
  );
};

export default Layout;
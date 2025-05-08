import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">SnapBuy</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-900 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-gray-900 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors">
              Products
            </Link>
            <Link to="/collections" className="text-gray-900 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors">
              Collections
            </Link>
          </nav>

          {/* Search, Cart, Account */}
          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 w-48 lg:w-64 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </form>
            
            <Link to="/cart" className="relative p-2 text-gray-900 hover:text-primary-600 transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-primary-600 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
            
            {user ? (
              <div className="relative group">
                <button className="p-2 text-gray-900 hover:text-primary-600 transition-colors">
                  <User className="h-6 w-6" />
                </button>
                <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="px-4 py-3">
                    <p className="text-sm">Signed in as</p>
                    <p className="text-sm font-medium truncate">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Your Profile
                    </Link>
                    <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Your Orders
                    </Link>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="p-2 text-gray-900 hover:text-primary-600 transition-colors">
                <User className="h-6 w-6" />
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Link to="/cart" className="relative p-2 mr-2 text-gray-900">
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-primary-600 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-900 focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
          <form onSubmit={handleSearchSubmit} className="px-3 py-2">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-6 top-[4.7rem] h-4 w-4 text-gray-400" />
          </form>
          <Link
            to="/"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/products"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            Products
          </Link>
          <Link
            to="/collections"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            Collections
          </Link>
          {user ? (
            <>
              <Link
                to="/profile"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                Your Profile
              </Link>
              <Link
                to="/orders"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                Your Orders
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
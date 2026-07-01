/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Library, Globe, Menu, X, Landmark, Award } from 'lucide-react';

interface HeaderProps {
  activeTab: 'collections' | 'journals' | 'methodology' | 'institutional';
  setActiveTab: (tab: 'collections' | 'journals' | 'methodology' | 'institutional') => void;
  onSignInClick: () => void;
  isSignedIn: boolean;
}

export default function Header({ activeTab, setActiveTab, onSignInClick, isSignedIn }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { id: 'collections', label: 'Collections' },
    { id: 'journals', label: 'Journals / Index' },
    { id: 'methodology', label: 'Methodology / Inquiry' },
    { id: 'institutional', label: 'Institutional Access' },
  ] as const;

  return (
    <header className="w-full bg-surface border-b-[0.5px] border-outline-variant sticky top-0 z-50 transition-colors duration-200">
      <div className="flex justify-between items-center w-full px-5 md:px-16 py-4 max-w-[1280px] mx-auto">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => {
              setActiveTab('collections');
              setMobileMenuOpen(false);
            }}
            className="font-serif italic text-3xl md:text-4xl text-primary font-bold cursor-pointer hover:opacity-85 transition-opacity"
            id="logo-button"
          >
            EcoVeridian
          </button>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 ml-4">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`text-body-md font-sans pb-1 cursor-pointer transition-all duration-200 text-sm tracking-wide ${
                  activeTab === item.id
                    ? 'text-primary font-bold border-b-2 border-primary'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
                id={`nav-${item.id}`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Actions Menu */}
        <div className="flex items-center gap-4 md:gap-6">
          
          {/* Quick Stats icons or structural depth */}
          <div className="flex items-center gap-4 text-primary">
            <button 
              title="Consortium Nodes"
              className="p-1 hover:text-secondary hover:bg-surface-container-low rounded transition-all cursor-pointer"
              id="header-node-btn"
            >
              <Landmark className="w-5 h-5 stroke-[1.5]" />
            </button>
            <button 
              title="Regional Protocols"
              className="p-1 hover:text-secondary hover:bg-surface-container-low rounded transition-all cursor-pointer"
              id="header-lang-btn"
            >
              <Globe className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>

          {/* Sign In Trigger */}
          <button
            onClick={onSignInClick}
            className={`px-4 md:px-6 py-2 text-sm font-sans font-semibold rounded-[2px] transition-all duration-200 border cursor-pointer ${
              isSignedIn
                ? 'bg-surface border-outline-variant text-primary hover:bg-surface-container-low'
                : 'bg-primary border-primary text-on-primary hover:bg-primary-container'
            }`}
            id="header-signin-btn"
          >
            {isSignedIn ? 'Scholar Profile' : 'Sign In'}
          </button>

          {/* Mobile Menu Icon */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1 text-primary hover:bg-surface-container-low rounded cursor-pointer"
            id="mobile-menu-toggle"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden w-full border-t-[0.5px] border-outline-variant bg-surface animate-fade-in absolute left-0 right-0 py-4 shadow-lg z-40">
          <nav className="flex flex-col gap-3 px-6 pb-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left text-body-md font-sans py-2 border-l-2 pl-3 transition-colors ${
                  activeTab === item.id
                    ? 'border-primary text-primary font-bold bg-surface-container-low'
                    : 'border-transparent text-on-surface-variant'
                }`}
                id={`mobile-nav-${item.id}`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

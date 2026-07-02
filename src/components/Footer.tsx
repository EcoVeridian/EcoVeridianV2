/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface FooterProps {
  setActiveTab: (tab: 'collections' | 'journals' | 'methodology' | 'institutional' | 'team' | 'about') => void;
}

export default function Footer({ setActiveTab }: FooterProps) {
  return (
    <footer className="w-full bg-surface-container-low border-t-[0.5px] border-outline-variant mt-auto">
      <div className="w-full px-5 md:px-16 py-12 flex flex-col md:flex-row justify-between items-start gap-8 max-w-[1280px] mx-auto">
        
        {/* Brand Description */}
        <div className="flex flex-col gap-4 max-w-sm">
          <span className="flex items-center gap-2.5 font-serif text-display-lg-mobile text-primary font-bold italic tracking-tight">
            <img src="/favicon.svg" alt="EcoVeridian logo" className="w-8 h-8 flex-shrink-0" />
            EcoVeridian
          </span>
          <div className="flex flex-col gap-1">
            <p className="font-sans text-xs text-on-surface-variant leading-relaxed uppercase tracking-wider">
              © 2026 EcoVeridian. All rights reserved.
            </p>
            <a
              href="mailto:ecoveridian@gmail.com"
              className="font-sans text-xs text-on-surface-variant leading-relaxed hover:text-primary hover:underline transition-all duration-300"
            >
              Contact: ecoveridian@gmail.com
            </a>
            <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
              Institute for Environmental Analysis &amp; Research
            </p>
          </div>
        </div>

        {/* Directory Links */}
        <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 font-mono text-xs uppercase tracking-widest">
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setActiveTab('collections')}
              className="text-left text-on-surface-variant hover:text-primary hover:underline transition-all duration-300 cursor-pointer"
              id="footer-link-research"
            >
              Research
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className="text-left text-on-surface-variant hover:text-primary hover:underline transition-all duration-300 cursor-pointer"
              id="footer-link-about"
            >
              About Us
            </button>
            <button
              onClick={() => setActiveTab('journals')}
              className="text-left text-on-surface-variant hover:text-primary hover:underline transition-all duration-300 cursor-pointer"
              id="footer-link-resource-hub"
            >
              Resource Hub
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className="text-left text-on-surface-variant hover:text-primary hover:underline transition-all duration-300 cursor-pointer"
              id="footer-link-team"
            >
              Team
            </button>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setActiveTab('methodology')}
              className="text-left text-on-surface-variant hover:text-primary hover:underline transition-all duration-300 cursor-pointer"
              id="footer-link-partner"
            >
              Partner With Us
            </button>
            <a
              href="https://www.instagram.com/ecoveridian"
              target="_blank"
              rel="noreferrer"
              className="text-left text-on-surface-variant hover:text-primary hover:underline transition-all duration-300 cursor-pointer"
              id="footer-link-instagram"
            >
              Instagram
            </a>
            <a
              href="https://github.com/EcoVeridian"
              target="_blank"
              rel="noreferrer"
              className="text-left text-on-surface-variant hover:text-primary hover:underline transition-all duration-300 cursor-pointer"
              id="footer-link-github"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/company/ecoveridian"
              target="_blank"
              rel="noreferrer"
              className="text-left text-on-surface-variant hover:text-primary hover:underline transition-all duration-300 cursor-pointer"
              id="footer-link-linkedin"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

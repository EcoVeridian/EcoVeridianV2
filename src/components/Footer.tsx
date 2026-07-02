/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface FooterProps {
  setActiveTab: (tab: 'collections' | 'journals' | 'methodology' | 'institutional') => void;
}

export default function Footer({ setActiveTab }: FooterProps) {
  return (
    <footer className="w-full bg-surface-container-low border-t-[0.5px] border-outline-variant mt-auto">
      <div className="w-full px-5 md:px-16 py-12 flex flex-col md:flex-row justify-between items-start gap-8 max-w-[1280px] mx-auto">
        
        {/* Brand Description */}
        <div className="flex flex-col gap-4 max-w-sm">
          <span className="font-serif text-display-lg-mobile text-primary font-bold italic tracking-tight">EcoVeridian</span>
          <p className="font-sans text-xs text-on-surface-variant leading-relaxed uppercase tracking-wider">
            © 2026 EcoVeridian. All rights reserved.
          </p>
          <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
            Contact: ecoveridian@gmail.com
          </p>
          <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
            Institute for Environmental Analysis &amp; Research
          </p>
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
            <a
              href="#about"
              className="text-left text-on-surface-variant hover:text-primary hover:underline transition-all duration-300 cursor-pointer"
              id="footer-link-about"
            >
              About Us
            </a>
            <button
              onClick={() => setActiveTab('journals')}
              className="text-left text-on-surface-variant hover:text-primary hover:underline transition-all duration-300 cursor-pointer"
              id="footer-link-resource-hub"
            >
              Resource Hub
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
            <button
              onClick={() => setActiveTab('collections')}
              className="text-left text-on-surface-variant hover:text-primary hover:underline transition-all duration-300 cursor-pointer"
              id="footer-link-team"
            >
              Team
            </button>
            <a
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
              className="text-left text-on-surface-variant hover:text-primary hover:underline transition-all duration-300 cursor-pointer"
              id="footer-link-github"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/"
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

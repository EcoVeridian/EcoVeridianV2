/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from 'react-router-dom';
import { useSiteSettings } from '../content/ContentContext';

const linkClass =
  'text-left text-on-surface-variant hover:text-primary hover:underline transition-all duration-300 cursor-pointer';

export default function Footer() {
  const settings = useSiteSettings();

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
              {settings.copyright}
            </p>
            <a
              href={`mailto:${settings.contactEmail}`}
              className="font-sans text-xs text-on-surface-variant leading-relaxed hover:text-primary hover:underline transition-all duration-300"
            >
              Contact: {settings.contactEmail}
            </a>
            <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
              {settings.footerTagline}
            </p>
          </div>
        </div>

        {/* Directory Links */}
        <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 font-mono text-xs uppercase tracking-widest">
          <div className="flex flex-col gap-3">
            <Link to="/" className={linkClass} id="footer-link-research">
              Research
            </Link>
            <Link to="/about" className={linkClass} id="footer-link-about">
              About Us
            </Link>
            <Link to="/resources" className={linkClass} id="footer-link-resource-hub">
              Resource Hub
            </Link>
            <Link to="/team" className={linkClass} id="footer-link-team">
              Team
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            <Link to="/partner" className={linkClass} id="footer-link-partner">
              Partner With Us
            </Link>
            {settings.socials.map((social) => (
              <a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className={linkClass}
                id={`footer-link-${social.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from 'react-router-dom';
import { Home, Users, Handshake, Mail, ArrowRight, GraduationCap } from 'lucide-react';
import { PanelsTopLeft } from 'lucide-react';

interface PageCardConfig {
  to: string;
  icon: typeof Home;
  title: string;
  description: string;
}

const CARDS: PageCardConfig[] = [
  {
    to: '/admin/pages/home',
    icon: Home,
    title: 'Home',
    description: 'Hero copy, badges, and the featured articles shown on the landing page.',
  },
  {
    to: '/admin/pages/about',
    icon: Users,
    title: 'About',
    description: 'Mission copy, approach pillars, and sidebar content for the About Us page.',
  },
  {
    to: '/admin/pages/team',
    icon: GraduationCap,
    title: 'Team',
    description: 'Heading and intro copy for the Team and Interns sections on /team.',
  },
  {
    to: '/admin/pages/collaborate',
    icon: Handshake,
    title: 'Ways to Work With Us',
    description: 'Collaboration tiers and the project scope estimator.',
  },
  {
    to: '/admin/pages/partner',
    icon: Mail,
    title: 'Partner',
    description: 'Copy for the partner inquiry page and the response-time notice.',
  },
];

export default function PagesIndex() {
  return (
    <div className="animate-fade-in">
      <header className="mb-8 border-b-[0.5px] border-outline-variant pb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-secondary font-bold mb-2">Content</p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary flex items-center gap-3">
          <PanelsTopLeft className="w-8 h-8 text-secondary stroke-[1.5]" />
          Pages
        </h1>
        <p className="font-sans text-sm text-on-surface-variant mt-2 leading-relaxed max-w-xl">
          Edit the copy for the site's static pages. Each page is a single document — changes are
          saved directly, with no draft/publish step.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
        {CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.to}
              to={card.to}
              className="border-[0.5px] border-outline-variant bg-surface-container-low p-6 rounded-[2px] hover:border-primary/40 transition-colors group"
            >
              <Icon className="w-7 h-7 text-secondary mb-4 stroke-[1.5]" />
              <h2 className="font-serif text-lg font-bold text-primary mb-1 group-hover:text-secondary transition-colors">
                {card.title}
              </h2>
              <p className="font-sans text-xs text-on-surface-variant leading-relaxed mb-3">{card.description}</p>
              <span className="font-mono text-[10px] uppercase tracking-wider text-secondary font-bold flex items-center gap-1">
                Edit <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

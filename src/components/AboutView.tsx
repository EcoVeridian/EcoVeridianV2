/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sprout, BookOpenCheck } from 'lucide-react';
import { usePageAbout } from '../content/ContentContext';
import { iconFor } from '../lib/icons';

export default function AboutView() {
  const page = usePageAbout();

  return (
    <section className="w-full max-w-[1280px] mx-auto px-5 md:px-16 py-12 md:py-20 animate-fade-in">
      {/* Page Header */}
      <header className="max-w-[850px] mb-12 md:mb-16 border-b-[0.5px] border-outline-variant pb-10">
        <span className="font-mono text-[11px] md:text-xs uppercase tracking-[0.18em] text-secondary font-bold mb-4 block">
          {page.kicker}
        </span>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4 leading-tight">
          {page.heading}
        </h1>
        <p className="font-sans text-base md:text-lg text-on-surface-variant leading-relaxed">
          {page.intro}
        </p>
      </header>

      {/* Why We Exist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16 md:mb-20">
        <div className="lg:col-span-7 flex flex-col gap-5">
          <h2 className="font-serif text-2xl md:text-3xl text-primary font-semibold">
            {page.whyHeading}
          </h2>
          {page.whyParagraphs.map((paragraph, i) => (
            <p key={i} className="font-sans text-sm md:text-base text-on-surface-variant leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="lg:col-span-5 bg-surface-container-low border-[0.5px] border-outline-variant rounded-[2px] p-6 md:p-7 flex flex-col gap-4">
          <BookOpenCheck className="w-8 h-8 text-secondary stroke-[1.5]" />
          <h3 className="font-serif text-xl font-bold text-primary">{page.sidebarHeading}</h3>
          <ul className="font-sans text-sm text-on-surface-variant leading-relaxed flex flex-col gap-2 list-disc list-inside">
            {page.sidebarItems.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Core Pillars */}
      <div className="mb-4">
        <h2 className="font-serif text-2xl md:text-3xl text-primary font-semibold border-b-[0.5px] border-outline-variant pb-3 mb-8">
          {page.approachHeading}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          {page.pillars.map((pillar) => {
            const Icon = iconFor(pillar.icon);
            return (
              <div
                key={pillar.title}
                className="border-[0.5px] border-outline-variant p-6 bg-surface-container-low hover:border-primary/40 transition-colors duration-200 rounded-[2px]"
              >
                <Icon className="w-7 h-7 text-secondary mb-4 stroke-[1.5]" />
                <h3 className="font-serif text-lg md:text-xl font-bold text-primary mb-2">{pillar.title}</h3>
                <p className="font-sans text-sm text-on-surface-variant leading-relaxed">{pillar.body}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Closing Note */}
      <div className="mt-16 md:mt-20 border-t-[0.5px] border-outline-variant pt-10 max-w-[760px]">
        <div className="flex items-start gap-4">
          <Sprout className="w-8 h-8 text-primary flex-shrink-0 stroke-[1.5]" />
          <p className="font-sans text-sm md:text-base text-on-surface-variant leading-relaxed">
            {page.closingNote}
          </p>
        </div>
      </div>
    </section>
  );
}

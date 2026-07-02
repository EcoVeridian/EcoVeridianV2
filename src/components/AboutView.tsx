/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Target, Database, Users, Sprout, BarChart3, BookOpenCheck } from 'lucide-react';

const PILLARS = [
  {
    icon: Target,
    title: 'Practical, Decision-Ready Research',
    body:
      'We turn raw environmental and tourism data into forecasts, briefs, and dashboards that partners can actually act on, not just academic exercises that sit on a shelf.',
  },
  {
    icon: Database,
    title: 'Transparent Methods & Data',
    body:
      'Every published resource comes with its underlying dataset summary, modeling approach, and validation notes, so organizations can see exactly how a number was produced.',
  },
  {
    icon: BarChart3,
    title: 'Forecasting for the Outdoors',
    body:
      'Our flagship work models park visitation and seasonal demand so land managers, gateway communities, and nonprofits can plan staffing and resources earlier.',
  },
  {
    icon: Users,
    title: 'Free Collaboration',
    body:
      'We partner with parks, agencies, and community organizations at no cost, scoping projects together and shaping the work around what your team actually needs.',
  },
];

export default function AboutView() {
  return (
    <section className="w-full max-w-[1280px] mx-auto px-5 md:px-16 py-12 md:py-20 animate-fade-in">
      {/* Page Header */}
      <header className="max-w-[850px] mb-12 md:mb-16 border-b-[0.5px] border-outline-variant pb-10">
        <span className="font-mono text-[11px] md:text-xs uppercase tracking-[0.18em] text-secondary font-bold mb-4 block">
          About Us
        </span>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4 leading-tight">
          What EcoVeridian Is For
        </h1>
        <p className="font-sans text-base md:text-lg text-on-surface-variant leading-relaxed">
          EcoVeridian is a research hub focused on making environmental and tourism data useful. We build
          forecasting models, clean dataset references, and reproducible methods, then publish them in one
          place so parks, gateway communities, and nonprofits can plan with better information.
        </p>
      </header>

      {/* Why We Exist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16 md:mb-20">
        <div className="lg:col-span-7 flex flex-col gap-5">
          <h2 className="font-serif text-2xl md:text-3xl text-primary font-semibold">
            Why This Platform Exists
          </h2>
          <p className="font-sans text-sm md:text-base text-on-surface-variant leading-relaxed">
            National parks and the communities around them face growing visitation with limited staffing and
            infrastructure budgets. Most of the data needed to plan ahead already exists, but it is scattered
            across agencies, formats, and time scales. EcoVeridian pulls that data together, models it, and
            translates the results into forecasts and briefs that are easy to act on.
          </p>
          <p className="font-sans text-sm md:text-base text-on-surface-variant leading-relaxed">
            Rather than treating forecasting as a one-off report, we publish our methodology, sample data, and
            update cadence alongside every resource. That means anyone using the site can trace a number back
            to its source and understand exactly how confident they should be in it.
          </p>
        </div>

        <div className="lg:col-span-5 bg-surface-container-low border-[0.5px] border-outline-variant rounded-[2px] p-6 md:p-7 flex flex-col gap-4">
          <BookOpenCheck className="w-8 h-8 text-secondary stroke-[1.5]" />
          <h3 className="font-serif text-xl font-bold text-primary">What You'll Find Here</h3>
          <ul className="font-sans text-sm text-on-surface-variant leading-relaxed flex flex-col gap-2 list-disc list-inside">
            <li>Flagship visitation forecasts for parks like Yellowstone and North Cascades</li>
            <li>Dataset summaries and feature dictionaries behind our models</li>
            <li>Reproducible notebooks documenting our modeling pipeline</li>
            <li>Plain-language briefs connecting forecasts to staffing and planning decisions</li>
          </ul>
        </div>
      </div>

      {/* Core Pillars */}
      <div className="mb-4">
        <h2 className="font-serif text-2xl md:text-3xl text-primary font-semibold border-b-[0.5px] border-outline-variant pb-3 mb-8">
          How We Approach the Work
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
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
            EcoVeridian started as a sustainability-focused research project and has grown into an ongoing hub
            for data-informed environmental and tourism planning. We are continuing to expand our resource
            library and welcome partners who want to put good data behind their decisions.
          </p>
        </div>
      </div>
    </section>
  );
}

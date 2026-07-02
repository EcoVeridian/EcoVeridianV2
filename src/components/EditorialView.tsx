/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ScholarlyArticle } from '../types';
import { ArrowUpRight } from 'lucide-react';

interface EditorialViewProps {
  articles: ScholarlyArticle[];
  onSelectArticle: (article: ScholarlyArticle) => void;
}

export default function EditorialView({ articles, onSelectArticle }: EditorialViewProps) {
  // Select featured entries by stable IDs and keep graceful fallbacks.
  const mainHeroArticle = articles.find((a) => a.id === 'ART-001') || articles[0];
  const flagshipArticle = articles.find((a) => a.id === 'ART-001') || articles[1];
  const methodologyArticle = articles.find((a) => a.id === 'ART-002') || articles[2];
  const updatesArticle = articles.find((a) => a.id === 'ART-003') || articles[3];

  return (
    <div className="w-full max-w-[1280px] mx-auto animate-fade-in">
      
      {/* Hero Section: Editorial Architecture */}
      <section className="px-5 md:px-16 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          <div className="md:col-span-8 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs px-2.5 py-1 bg-surface border-[0.5px] border-secondary text-secondary uppercase font-semibold">
                Student-Led Research Hub
              </span>
              <span className="font-mono text-xs px-2.5 py-1 bg-surface border-[0.5px] border-outline text-on-surface-variant uppercase">
                TSA Nationals Project
              </span>
            </div>
            
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-primary leading-tight font-bold tracking-tight">
              Turning Competition-Grade Data Science <br className="hidden md:block" /> Into Real Help
            </h1>
            
            <p className="font-sans text-lg md:text-xl text-on-surface-variant max-w-[720px] pt-4 border-t-[0.5px] border-outline-variant leading-relaxed">
              EcoVeridian is a student research team offering forecasting and data analysis support to organizations. We built this work through our TSA Data Science and Analytics project, then expanded it into a practical research hub partners can use.
            </p>
          </div>

          <div className="md:col-span-4 flex md:justify-end pb-2">
            <button
              onClick={() => onSelectArticle(mainHeroArticle)}
              className="px-6 py-3.5 bg-primary text-on-primary font-mono text-xs uppercase tracking-widest font-semibold rounded-[2px] hover:bg-primary-container hover:text-on-primary transition-colors cursor-pointer"
              id="hero-explore-btn"
            >
              Read The Research
            </button>
          </div>
        </div>

        {/* Hero Image */}
        <div
          onClick={() => onSelectArticle(mainHeroArticle)}
          className="mt-12 w-full h-[400px] md:h-[600px] relative border-[0.5px] border-outline-variant cursor-pointer group overflow-hidden"
          id="hero-image-container"
        >
          <img
            className="w-full h-full object-cover filter grayscale contrast-125 brightness-90 group-hover:scale-101 group-hover:brightness-95 transition-all duration-700"
            src={mainHeroArticle.image}
            alt="Data visualization and forecasting dashboard"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-0 left-0 bg-surface px-4 py-2 border-t-[0.5px] border-r-[0.5px] border-outline-variant flex items-center gap-2">
            <span className="font-mono text-xs text-on-surface-variant uppercase tracking-widest font-medium">
              Fig. 1 - Visitation Forecast Snapshot
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-secondary opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </section>

      {/* Bento Grid Content Section */}
      <section className="w-full px-5 md:px-16 py-16 bg-surface-container-low border-y-[0.5px] border-outline-variant">
        <div className="max-w-[1280px] mx-auto">
          
          <div className="flex items-center justify-between mb-12 border-b-[0.5px] border-outline-variant pb-4">
            <h2 className="font-serif text-3xl font-bold text-primary">Curated Archives</h2>
            <span className="font-mono text-xs text-secondary uppercase tracking-wider font-semibold">
              Proof Of Work
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Large Feature Card: Flagship Project */}
            <article
              onClick={() => onSelectArticle(flagshipArticle)}
              className="md:col-span-8 group cursor-pointer"
              id="bento-card-large"
            >
              <div className="h-[300px] md:h-[400px] border-[0.5px] border-outline-variant relative overflow-hidden bg-surface mb-4 transition-all duration-300 group-hover:border-primary">
                <img
                  className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-101 transition-all duration-700 filter sepia-[0.2] contrast-105"
                  src={flagshipArticle.image}
                  alt="Yellowstone and North Cascades forecasting overview"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <span className="font-mono text-xs px-2.5 py-1 bg-surface/95 border-[0.5px] border-outline backdrop-blur-sm uppercase font-semibold text-primary">
                    Flagship Project
                  </span>
                </div>
              </div>

              <h3 className="font-serif text-2xl font-bold text-primary mb-2 group-hover:text-secondary transition-colors leading-tight">
                {flagshipArticle.title}
              </h3>
              
              <p className="font-sans text-sm md:text-base text-on-surface-variant line-clamp-2 leading-relaxed">
                {flagshipArticle.excerpt}
              </p>
              
              <div className="mt-4 font-mono text-[10px] uppercase tracking-wider text-secondary font-bold">
                Read the Research -&gt;
              </div>
            </article>

            {/* Stacked Small Cards (Canopy and Mycelial) */}
            <div className="md:col-span-4 flex flex-col gap-6">
              
              {/* Card 2: Methodology */}
              <article
                onClick={() => onSelectArticle(methodologyArticle)}
                className="flex-1 border-[0.5px] border-outline-variant bg-surface p-6 hover:bg-surface-container hover:border-primary transition-all duration-300 cursor-pointer group flex flex-col justify-between"
                id="bento-card-small-1"
              >
                <div>
                  <div className="font-mono text-xs text-secondary font-semibold uppercase tracking-widest border-b-[0.5px] border-outline-variant pb-2 inline-block mb-4">
                    Methodology
                  </div>
                  <h3 className="font-serif text-xl font-bold text-primary mb-3 group-hover:text-secondary transition-colors leading-snug">
                    {methodologyArticle.title}
                  </h3>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed line-clamp-3">
                    {methodologyArticle.excerpt}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t-[0.5px] border-outline-variant/50 font-sans text-[11px] text-outline flex justify-between items-center">
                  <span>Read Time: {methodologyArticle.readTime}</span>
                  <span className="font-mono text-[10px] uppercase font-bold text-secondary group-hover:translate-x-0.5 transition-transform">READ →</span>
                </div>
              </article>

              {/* Card 3: Team updates */}
              <article
                onClick={() => onSelectArticle(updatesArticle)}
                className="flex-1 border-[0.5px] border-outline-variant bg-surface p-6 hover:bg-surface-container hover:border-primary transition-all duration-300 cursor-pointer group flex flex-col justify-between"
                id="bento-card-small-2"
              >
                <div>
                  <div className="font-mono text-xs text-secondary font-semibold uppercase tracking-widest border-b-[0.5px] border-outline-variant pb-2 inline-block mb-4">
                    Team Updates
                  </div>
                  <h3 className="font-serif text-xl font-bold text-primary mb-3 group-hover:text-secondary transition-colors leading-snug">
                    {updatesArticle.title}
                  </h3>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed line-clamp-3">
                    {updatesArticle.excerpt}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t-[0.5px] border-outline-variant/50 font-sans text-[11px] text-outline flex justify-between items-center">
                  <span>Read Time: {updatesArticle.readTime}</span>
                  <span className="font-mono text-[10px] uppercase font-bold text-secondary group-hover:translate-x-0.5 transition-transform">READ →</span>
                </div>
              </article>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

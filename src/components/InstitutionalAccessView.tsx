/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Landmark, Award, Calculator, Check, ArrowRight, Database, BarChart3 } from 'lucide-react';

interface InstitutionalAccessViewProps {
  onGoToPartnerWithUs: () => void;
}

export default function InstitutionalAccessView({ onGoToPartnerWithUs }: InstitutionalAccessViewProps) {
  const [dataSources, setDataSources] = useState(3);
  const [complexity, setComplexity] = useState(2);

  const turnaround = (() => {
    const score = dataSources + complexity;
    if (score <= 4) return 'Estimated turnaround: 1-2 weeks';
    if (score <= 7) return 'Estimated turnaround: 2-3 weeks';
    return 'Estimated turnaround: 3-5 weeks';
  })();

  return (
    <div className="w-full max-w-[1280px] mx-auto px-5 md:px-16 py-12 md:py-16 animate-fade-in">
      
      {/* Page Header */}
      <header className="mb-16 border-b-[0.5px] border-outline-variant pb-8 max-w-[850px]">
        <span className="font-mono text-xs text-secondary font-bold uppercase tracking-widest mb-2 block">
          Ways To Work With Us
        </span>
        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-primary font-bold mb-4 leading-tight">
          How We Can Help Your Organization
        </h1>
        <p className="font-sans text-base md:text-lg text-on-surface-variant leading-relaxed">
          We offer free collaboration and research support at different levels of depth. Choose the engagement style that fits your needs, and we will shape the project together.
        </p>
      </header>

      {/* Grid Layout: Left Tiers, Right Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Tiers Information (lg:col-span-7) */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          
          <h2 className="font-serif text-2xl text-primary font-semibold border-b-[0.5px] border-outline-variant pb-2">
            Collaboration Options
          </h2>

          {/* Tier 1 */}
          <div className="border-[0.5px] border-outline-variant p-6 bg-surface-container-low hover:bg-surface transition-colors duration-200 rounded-[2px] relative group">
            <Landmark className="w-8 h-8 text-secondary mb-4 stroke-[1.5]" />
            <h3 className="font-serif text-xl font-bold text-primary mb-2">Quick Consultation</h3>
            <p className="font-sans text-sm text-on-surface-variant leading-relaxed mb-4">
              Best for focused questions and fast review. Share your context, and we provide concise findings, interpretation help, or direction for next steps.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans text-on-surface">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-secondary flex-shrink-0" />
                <span>Initial findings in 1-2 weeks</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-secondary flex-shrink-0" />
                <span>One clear recommendation memo</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-secondary flex-shrink-0" />
                <span>Direct access to our team</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-secondary flex-shrink-0" />
                <span>Follow-up Q&A session</span>
              </li>
            </ul>
          </div>

          {/* Tier 2 */}
          <div className="border-[0.5px] border-primary/20 p-6 bg-primary-container/5 hover:bg-primary-container/10 transition-colors duration-200 rounded-[2px] relative">
            <div className="absolute top-4 right-4 bg-primary text-on-primary font-mono text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-sm">
              Deeper Engagement
            </div>
            <Award className="w-8 h-8 text-primary mb-4 stroke-[1.5]" />
            <h3 className="font-serif text-xl font-bold text-primary mb-2">Full Research Partnership</h3>
            <p className="font-sans text-sm text-on-surface-variant leading-relaxed mb-4">
              Best for ongoing collaboration. We co-design a scoped project, build custom analysis or forecasts, and support implementation discussions with your team.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans text-on-surface">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
                <span>Custom forecasting model build</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
                <span>Custom data visualizations</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
                <span>Milestone updates and iteration</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
                <span>Follow-up support after delivery</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Project Scope Estimator (lg:col-span-5) */}
        <div className="lg:col-span-5">
          <div className="border-[0.5px] border-outline bg-surface-container-lowest p-6 md:p-8 rounded-[2px] sticky top-[100px] shadow-sm">
            
            <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-widest font-bold mb-6 border-b-[0.5px] border-outline-variant pb-4">
              <Calculator className="w-4 h-4 text-secondary" />
              Project Scope Estimator
            </div>

            {/* Slider 1: Data sources */}
            <div className="mb-6">
              <div className="flex justify-between items-center text-xs font-mono text-on-surface-variant mb-2">
                <span className="flex items-center gap-1.5 font-bold">
                  <Database className="w-3.5 h-3.5 text-secondary" />
                  Data Sources
                </span>
                <span className="font-bold text-primary">{dataSources}</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="1"
                value={dataSources}
                onChange={(e) => setDataSources(Number(e.target.value))}
                className="w-full accent-primary bg-surface-container h-1 rounded-full cursor-pointer appearance-none"
              />
              <span className="text-[10px] font-sans text-outline leading-none">Higher source count usually means more integration effort.</span>
            </div>

            {/* Slider 2: Complexity */}
            <div className="mb-8">
              <div className="flex justify-between items-center text-xs font-mono text-on-surface-variant mb-2">
                <span className="flex items-center gap-1.5 font-bold">
                  <BarChart3 className="w-3.5 h-3.5 text-secondary" />
                  Question Complexity
                </span>
                <span className="font-bold text-primary">{complexity} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={complexity}
                onChange={(e) => setComplexity(Number(e.target.value))}
                className="w-full accent-primary bg-surface-container h-1 rounded-full cursor-pointer appearance-none"
              />
              <span className="text-[10px] font-sans text-outline leading-none">More complex scopes may include additional model iterations.</span>
            </div>

            {/* Turnaround Output */}
            <div className="bg-surface-container p-4 border-[0.5px] border-outline-variant text-center rounded-[2px] mb-6">
              <p className="font-mono text-[10px] uppercase text-outline font-bold tracking-wider mb-1">
                Estimated Project Timing
              </p>
              <p className="font-serif text-2xl font-bold text-primary">{turnaround}</p>
              <p className="font-sans text-[10px] text-outline-variant mt-1">
                We do not charge for access. Scope and timeline are finalized together after first contact.
              </p>
            </div>

            {/* Partner page routing trigger */}
            <button
              onClick={onGoToPartnerWithUs}
              className="w-full py-3 bg-secondary text-on-secondary font-mono text-xs uppercase tracking-widest font-bold hover:bg-secondary/90 transition-colors flex items-center justify-center gap-3 rounded-[2px] cursor-pointer"
              id="go-to-partner-btn"
            >
              Get In Touch
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

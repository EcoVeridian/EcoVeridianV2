/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Landmark, Award, Shield, Calculator, Check, ArrowRight, UserPlus, HardDrive } from 'lucide-react';

interface InstitutionalAccessViewProps {
  onDraftInquiry: (draftText: string) => void;
}

export default function InstitutionalAccessView({ onDraftInquiry }: InstitutionalAccessViewProps) {
  // Calculator States
  const [seats, setSeats] = useState(15);
  const [bandwidth, setBandwidth] = useState(250); // in GB
  const [selectedTier, setSelectedTier] = useState<'consortium' | 'node'>('consortium');

  // Pricing calculations
  const seatPrice = seats * 120; // $120 per seat/year
  const bandwidthPrice = bandwidth * 2.5; // $2.5 per GB/year
  const basePrice = selectedTier === 'consortium' ? 1500 : 8500;
  const totalAnnualCost = basePrice + seatPrice + bandwidthPrice;

  const handleInitiateDraft = () => {
    const formattedDraft = `# Institutional Access Request
- **Affiliated Institution**: [Specify your university/institute here]
- **Proposed Tier**: ${selectedTier === 'consortium' ? 'Consortium Partner' : 'Global Archival Node'}
- **Configured Research Seats**: ${seats} seats
- **Requested Monthly Bandwidth**: ${bandwidth} GB/month
- **Estimated Annual Consortium Fee**: $${totalAnnualCost.toLocaleString()} USD

## Abstract of Research Requirements
Please provide a brief summary of why your institution requires unthrottled access to our environmental frameworks...`;

    onDraftInquiry(formattedDraft);
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-5 md:px-16 py-12 md:py-16 animate-fade-in">
      
      {/* Page Header */}
      <header className="mb-16 border-b-[0.5px] border-outline-variant pb-8 max-w-[850px]">
        <span className="font-mono text-xs text-secondary font-bold uppercase tracking-widest mb-2 block">
          Consortium Membership Tiers
        </span>
        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-primary font-bold mb-4 leading-tight">
          Institutional Access Protocols
        </h1>
        <p className="font-sans text-base md:text-lg text-on-surface-variant leading-relaxed">
          The EcoVeridian Master Index is managed as a shared resource. We provide tailored subscription frameworks for universities, state departments, and accredited international agencies.
        </p>
      </header>

      {/* Grid Layout: Left Tiers, Right Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Tiers Information (lg:col-span-7) */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          
          <h2 className="font-serif text-2xl text-primary font-semibold border-b-[0.5px] border-outline-variant pb-2">
            Consortium Membership Tiers
          </h2>

          {/* Tier 1 */}
          <div className="border-[0.5px] border-outline-variant p-6 bg-surface-container-low hover:bg-surface transition-colors duration-200 rounded-[2px] relative group">
            <Landmark className="w-8 h-8 text-secondary mb-4 stroke-[1.5]" />
            <h3 className="font-serif text-xl font-bold text-primary mb-2">Consortium Partner</h3>
            <p className="font-sans text-sm text-on-surface-variant leading-relaxed mb-4">
              Designed for departmental libraries, research laboratories, and dedicated environmental working groups. Grants full search queries, unlimited schema previews, and standard metadata downloading bandwidth.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans text-on-surface">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-secondary flex-shrink-0" />
                <span>Up to 75 dedicated seats</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-secondary flex-shrink-0" />
                <span>1000 GB download limits</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-secondary flex-shrink-0" />
                <span>Direct API querying routes</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-secondary flex-shrink-0" />
                <span>Consortium Board Voting Seat</span>
              </li>
            </ul>
          </div>

          {/* Tier 2 */}
          <div className="border-[0.5px] border-primary/20 p-6 bg-primary-container/5 hover:bg-primary-container/10 transition-colors duration-200 rounded-[2px] relative">
            <div className="absolute top-4 right-4 bg-primary text-on-primary font-mono text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-sm">
              Maximum Priority
            </div>
            <Award className="w-8 h-8 text-primary mb-4 stroke-[1.5]" />
            <h3 className="font-serif text-xl font-bold text-primary mb-2">Global Archival Node</h3>
            <p className="font-sans text-sm text-on-surface-variant leading-relaxed mb-4">
              Tailored for regional university networks, national climate taskforces, and global scientific institutions. Features physical server data mirroring, unrestricted bulk sync operations, and hardware cold storage backups.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans text-on-surface">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
                <span>Unrestricted researcher seats</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
                <span>Uncapped bandwidth allocation</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
                <span>Weekly LTO tape data mirroring</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
                <span>Dedicated Librarian priority channel</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Pricing Calculator (lg:col-span-5) */}
        <div className="lg:col-span-5">
          <div className="border-[0.5px] border-outline bg-surface-container-lowest p-6 md:p-8 rounded-[2px] sticky top-[100px] shadow-sm">
            
            <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-widest font-bold mb-6 border-b-[0.5px] border-outline-variant pb-4">
              <Calculator className="w-4 h-4 text-secondary" />
              Consortium Fee Calculator
            </div>

            {/* Selector buttons */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              <button
                onClick={() => setSelectedTier('consortium')}
                className={`py-2 px-3 text-xs font-mono uppercase tracking-wider font-bold border transition-colors cursor-pointer ${
                  selectedTier === 'consortium'
                    ? 'bg-primary text-on-primary border-primary'
                    : 'bg-surface hover:bg-surface-container text-on-surface-variant border-outline-variant'
                }`}
              >
                Partner Tier
              </button>
              <button
                onClick={() => setSelectedTier('node')}
                className={`py-2 px-3 text-xs font-mono uppercase tracking-wider font-bold border transition-colors cursor-pointer ${
                  selectedTier === 'node'
                    ? 'bg-primary text-on-primary border-primary'
                    : 'bg-surface hover:bg-surface-container text-on-surface-variant border-outline-variant'
                }`}
              >
                Global Node
              </button>
            </div>

            {/* Slider 1: Seats */}
            <div className="mb-6">
              <div className="flex justify-between items-center text-xs font-mono text-on-surface-variant mb-2">
                <span className="flex items-center gap-1.5 font-bold">
                  <UserPlus className="w-3.5 h-3.5 text-secondary" />
                  Research Seats
                </span>
                <span className="font-bold text-primary">{seats} seats</span>
              </div>
              <input
                type="range"
                min="5"
                max="250"
                step="5"
                value={seats}
                onChange={(e) => setSeats(Number(e.target.value))}
                className="w-full accent-primary bg-surface-container h-1 rounded-full cursor-pointer appearance-none"
              />
              <span className="text-[10px] font-sans text-outline leading-none">$120 USD / seat per annum</span>
            </div>

            {/* Slider 2: Bandwidth */}
            <div className="mb-8">
              <div className="flex justify-between items-center text-xs font-mono text-on-surface-variant mb-2">
                <span className="flex items-center gap-1.5 font-bold">
                  <HardDrive className="w-3.5 h-3.5 text-secondary" />
                  Monthly Bandwidth
                </span>
                <span className="font-bold text-primary">{bandwidth} GB</span>
              </div>
              <input
                type="range"
                min="50"
                max="1000"
                step="25"
                value={bandwidth}
                onChange={(e) => setBandwidth(Number(e.target.value))}
                className="w-full accent-primary bg-surface-container h-1 rounded-full cursor-pointer appearance-none"
              />
              <span className="text-[10px] font-sans text-outline leading-none">$2.50 USD / GB per annum</span>
            </div>

            {/* Price Output */}
            <div className="bg-surface-container p-4 border-[0.5px] border-outline-variant text-center rounded-[2px] mb-6">
              <p className="font-mono text-[10px] uppercase text-outline font-bold tracking-wider mb-1">
                Estimated Annual Contribution
              </p>
              <p className="font-serif text-3xl font-bold text-primary">
                ${totalAnnualCost.toLocaleString()}
                <span className="text-xs font-mono text-on-surface-variant font-normal"> / yr</span>
              </p>
              <p className="font-sans text-[10px] text-outline-variant mt-1">
                Standard institutional tax offsets apply. Subject to Board approval.
              </p>
            </div>

            {/* Submission Draft routing trigger */}
            <button
              onClick={handleInitiateDraft}
              className="w-full py-3 bg-secondary text-on-secondary font-mono text-xs uppercase tracking-widest font-bold hover:bg-secondary/90 transition-colors flex items-center justify-center gap-3 rounded-[2px] cursor-pointer"
              id="draft-agreement-btn"
            >
              Initiate Agreement Draft
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

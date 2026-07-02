/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { InquiryFormState } from '../types';
import { Send, Info, Loader2 } from 'lucide-react';

export default function SubmissionView() {
  const [form, setForm] = useState<InquiryFormState>({
    investigatorName: '',
    institution: '',
    returnRelay: '',
    classification: '',
    dossier: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitStep, setSubmitStep] = useState('');
  const [receipt, setReceipt] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    const steps = [
      'Reviewing your inquiry details...',
      'Routing request to the EcoVeridian team...',
      'Preparing confirmation receipt...',
    ];

    let currentStep = 0;
    setSubmitStep(steps[0]);

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setSubmitStep(steps[currentStep]);
      } else {
        clearInterval(interval);
        setSubmitting(false);

        const transactionHash = Array.from({ length: 32 }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join('').toUpperCase();
        const blockReceipt = `EcoVeridian Inquiry Receipt
Reference: EV-${transactionHash}
Submitted: ${new Date().toLocaleString()}

Name: ${form.investigatorName}
Organization: ${form.institution || 'Not provided'}
Email: ${form.returnRelay}
Inquiry type: ${form.classification}

Message preview:
"${form.dossier.slice(0, 220)}${form.dossier.length > 220 ? '...' : ''}"

Thanks for reaching out. We typically respond within a few days.`;

        setReceipt(blockReceipt);
      }
    }, 1000);
  };

  const handleResetForm = () => {
    setForm({
      investigatorName: '',
      institution: '',
      returnRelay: '',
      classification: '',
      dossier: '',
    });
    setReceipt(null);
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-5 md:px-16 py-12 md:py-20 animate-fade-in">
      
      {/* Header Section */}
      <div className="max-w-[720px] mb-16 text-left border-b-[0.5px] border-outline-variant pb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-6">Partner With Us</h1>
        <p className="font-sans text-base md:text-lg text-on-surface-variant leading-relaxed">
          Tell us what you are working on and where you need help. We support forecasting, analysis, and collaborative research projects with organizations focused on sustainability and public lands.
        </p>
      </div>

      {receipt ? (
        /* Confirmation view after successful submit */
        <div className="max-w-3xl mx-auto border-[0.5px] border-outline bg-surface-container-lowest p-6 md:p-8 rounded-[2px] animate-fade-in shadow-sm">
          <div className="mb-6 border-b-[0.5px] border-outline-variant pb-4">
            <h2 className="font-mono text-xs uppercase tracking-widest text-primary font-bold">Inquiry Sent</h2>
            <p className="font-sans text-xs text-on-surface-variant">Thanks for reaching out. We will review this and follow up by email.</p>
          </div>

          <p className="font-sans text-sm text-on-surface mb-6 leading-relaxed">
            Thank you, <strong className="text-primary">{form.investigatorName}</strong>. Your request is now in our queue and a team member will follow up shortly.
          </p>

          <div className="font-mono text-[11px] leading-relaxed text-on-surface-variant bg-surface p-4 border-[0.5px] border-outline-variant rounded-[2px] max-h-[300px] overflow-y-auto overflow-x-hidden whitespace-pre-wrap select-text break-all">
            {receipt}
          </div>

          <div className="mt-8 pt-6 border-t-[0.5px] border-outline-variant flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-sans text-outline">
              <Info className="w-4 h-4" />
              <span>We typically respond within a few days.</span>
            </div>
            <button
              onClick={handleResetForm}
              className="py-2.5 px-6 border-[0.5px] border-outline text-primary font-mono text-xs uppercase tracking-widest hover:bg-surface-container-low transition-colors rounded-[2px] font-bold cursor-pointer"
              id="receipt-return-btn"
            >
              File New Inquiry
            </button>
          </div>
        </div>
      ) : (
        /* Original form view */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Contact details and response note */}
          <div className="lg:col-span-4 flex flex-col gap-12 lg:pr-12 lg:border-r-[0.5px] lg:border-outline-variant h-fit">
            
            {/* Notice Box */}
            <div className="bg-surface-container-low p-6 border-[0.5px] border-tertiary/20 relative rounded-[2px]">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-tertiary"></div>
              <h3 className="font-mono text-xs uppercase tracking-widest text-tertiary mb-3 flex items-center gap-2 font-bold">
                <Info className="w-4 h-4 text-tertiary" />
                RESPONSE LATENCY
              </h3>
              <p className="font-sans text-xs md:text-sm text-on-surface-variant leading-relaxed">
                We typically respond within a few days depending on current project volume.
              </p>
            </div>

            {/* Direct relays block */}
            <section>
              <h2 className="font-mono text-xs uppercase tracking-widest text-on-surface-variant mb-6 pb-2 border-b-[0.5px] border-outline-variant font-bold">
                Direct Communication
              </h2>
              <div className="space-y-6">
                <div>
                  <p className="font-sans text-[11px] text-outline uppercase font-semibold mb-1">CONTACT EMAIL</p>
                  <span className="font-sans text-lg text-primary font-semibold">ecoveridian@gmail.com</span>
                </div>
              </div>
            </section>

            {/* Address block */}
            <section>
              <h2 className="font-mono text-xs uppercase tracking-widest text-on-surface-variant mb-6 pb-2 border-b-[0.5px] border-outline-variant font-bold">
                Team
              </h2>
              <address className="font-sans text-xs md:text-sm text-on-surface-variant not-italic space-y-1.5 leading-relaxed">
                EcoVeridian
                <br />
                Student-led research team
                <br />
                Email: ecoveridian@gmail.com
              </address>
            </section>
          </div>

          {/* Right Column: Submission Form */}
          <div className="lg:col-span-8 lg:pl-12">
            <form onSubmit={handleFormSubmit} className="space-y-8 max-w-[720px]">
              
              {submitting ? (
                /* Submitting progress sequence */
                <div className="py-24 text-center animate-pulse flex flex-col justify-center items-center gap-4">
                  <Loader2 className="w-10 h-10 text-secondary animate-spin" />
                  <p className="font-serif text-lg font-bold text-primary">Submitting Inquiry...</p>
                  <p className="font-mono text-xs text-secondary italic mt-1">{submitStep}</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Investigator Name */}
                    <div className="flex flex-col">
                      <label className="font-mono text-xs text-on-surface-variant mb-2 uppercase font-bold" htmlFor="investigatorName">
                        Your Name
                      </label>
                      <input
                        type="text"
                        name="investigatorName"
                        id="investigatorName"
                        value={form.investigatorName}
                        onChange={handleInputChange}
                        placeholder="Jane Doe"
                        required
                        className="bg-transparent border-b-[0.5px] border-outline focus:outline-none focus:border-primary focus:bg-surface-container-low transition-all py-2 text-sm font-sans"
                      />
                    </div>

                    {/* Affiliated Institution */}
                    <div className="flex flex-col">
                      <label className="font-mono text-xs text-on-surface-variant mb-2 uppercase font-bold" htmlFor="institution">
                        Organization (if applicable)
                      </label>
                      <input
                        type="text"
                        name="institution"
                        id="institution"
                        value={form.institution}
                        onChange={handleInputChange}
                        placeholder="National Park Service, nonprofit, school, etc."
                        className="bg-transparent border-b-[0.5px] border-outline focus:outline-none focus:border-primary focus:bg-surface-container-low transition-all py-2 text-sm font-sans"
                      />
                    </div>
                  </div>

                  {/* Return Relay (Email) */}
                  <div className="flex flex-col">
                    <label className="font-mono text-xs text-on-surface-variant mb-2 uppercase font-bold" htmlFor="returnRelay">
                      Email
                    </label>
                    <input
                      type="email"
                      name="returnRelay"
                      id="returnRelay"
                      value={form.returnRelay}
                      onChange={handleInputChange}
                      placeholder="name@example.com"
                      required
                      className="bg-transparent border-b-[0.5px] border-outline focus:outline-none focus:border-primary focus:bg-surface-container-low transition-all py-2 text-sm font-sans w-full"
                    />
                  </div>

                  {/* Inquiry Classification Dropdown */}
                  <div className="flex flex-col">
                    <label className="font-mono text-xs text-on-surface-variant mb-2 uppercase font-bold" htmlFor="classification">
                      Inquiry Type
                    </label>
                    <select
                      name="classification"
                      id="classification"
                      value={form.classification}
                      onChange={handleInputChange}
                      required
                      className="bg-transparent border-b-[0.5px] border-outline focus:outline-none focus:border-primary focus:bg-surface-container-low transition-all py-2 text-sm font-sans cursor-pointer appearance-none"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23717973' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 0.5rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.25em 1.25em',
                      }}
                    >
                      <option value="" disabled>Select inquiry type...</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Research Collaboration">Research Collaboration</option>
                      <option value="Data or Forecasting Request">Data/Forecasting Request</option>
                      <option value="Media or Press">Media/Press</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Details Area */}
                  <div className="flex flex-col">
                    <label className="font-mono text-xs text-on-surface-variant uppercase font-bold mb-2" htmlFor="dossier">
                      Details
                    </label>
                    <textarea
                      name="dossier"
                      id="dossier"
                      value={form.dossier}
                      onChange={handleInputChange}
                      placeholder="Tell us a bit about what you are working on and how we might help."
                      required
                      rows={6}
                      className="bg-transparent border-b-[0.5px] border-outline focus:outline-none focus:border-primary focus:bg-surface-container-low transition-all py-2 text-sm font-sans resize-y min-h-[120px] w-full"
                    />
                  </div>

                  {/* Submit Button block */}
                  <div className="pt-6 border-t-[0.5px] border-outline-variant flex justify-end">
                    <button
                      type="submit"
                      className="bg-primary hover:bg-primary-container text-on-primary font-mono text-xs uppercase tracking-widest font-semibold py-3 px-8 rounded-[2px] transition-colors flex items-center gap-3 cursor-pointer"
                      id="submit-dossier-btn"
                    >
                      Send Inquiry
                      <Send className="w-4 h-4 stroke-[1.5]" />
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

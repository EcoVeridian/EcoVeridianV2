/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { InquiryFormState } from '../types';
import { Send, Info, Check, Copy, Loader2, Award, Shield, FileText, FileCode } from 'lucide-react';

export default function SubmissionView() {
  const [form, setForm] = useState<InquiryFormState>({
    investigatorName: '',
    institution: '',
    returnRelay: '',
    classification: '',
    dossier: '',
  });

  const [previewMarkdown, setPreviewMarkdown] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitStep, setSubmitStep] = useState('');
  const [receipt, setReceipt] = useState<string | null>(null);
  const [copiedReceipt, setCopiedReceipt] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const parseSimpleMarkdown = (text: string) => {
    if (!text) return <p className="text-outline italic">No content provided yet...</p>;
    
    // Split by lines and parse basic structures
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      let trimmed = line.trim();
      
      // Headers
      if (trimmed.startsWith('# ')) {
        return <h1 key={idx} className="font-serif text-xl font-bold text-primary mt-4 mb-2">{trimmed.slice(2)}</h1>;
      }
      if (trimmed.startsWith('## ')) {
        return <h2 key={idx} className="font-serif text-lg font-bold text-primary mt-3 mb-1.5">{trimmed.slice(3)}</h2>;
      }
      if (trimmed.startsWith('### ')) {
        return <h3 key={idx} className="font-sans text-sm font-bold text-secondary mt-2 mb-1">{trimmed.slice(4)}</h3>;
      }
      
      // List items
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return <li key={idx} className="font-sans text-sm text-on-surface-variant list-disc ml-4 my-0.5">{trimmed.slice(2)}</li>;
      }

      // Check for bold or italics inline
      let content: React.ReactNode = trimmed;
      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        content = <strong className="font-bold text-primary">{trimmed.slice(2, -2)}</strong>;
      } else if (trimmed.startsWith('*') && trimmed.endsWith('*')) {
        content = <em className="italic">{trimmed.slice(1, -1)}</em>;
      }

      return <p key={idx} className="font-sans text-sm text-on-surface-variant leading-relaxed my-1.5 text-justify">{content}</p>;
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    const steps = [
      'Validating dossier schema compliance...',
      'Encrypting return relay node pointers...',
      'Formulating digital signature with Geneva PGP core...',
      'Hashing payload integrity blocks (SHA-512)...',
      'Transmitting formal dossier to physical storage node...',
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

        // Formulate a beautiful, highly scholarly PGP signature receipt block
        const transactionHash = Array.from({ length: 32 }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join('').toUpperCase();
        
        const blockReceipt = `-----BEGIN PGP SIGNED MESSAGE-----
Hash: SHA512

==================================================
ECOSPHERE INQUIRY TRANSMISSION RECEIPT
==================================================
Timestamp: ${new Date().toISOString()}
Transaction ID: TXN-${transactionHash}
Physical Node: Geneva-CH-4
Relay Route: Secondary European Academic Ring

--------------------------------------------------
SUBMITTED SCHOLARLY DOSSIER INDEX
--------------------------------------------------
Principal Investigator: ${form.investigatorName}
Affiliated Institution: ${form.institution || 'Independent/Unspecified'}
Return Relay Email: ${form.returnRelay}
Inquiry Classification: ${form.classification.toUpperCase()}

Dossier Content:
"${form.dossier.slice(0, 200)}${form.dossier.length > 200 ? '...' : ''}"

--------------------------------------------------
PGP DIGITAL SIGNATURE
--------------------------------------------------
-----BEGIN PGP SIGNATURE-----
Version: EcoSphere Geneva Guard 4.2

iQGzBAEBCgAdFiEE4F8A9B2C11D3E7F566A18C90B2D4E6F890A1B2C3F890A1B2
C3F890A1B2C3F890A1B2C3F890A1B2C3F890A1B2C3F890A1B2C3F890A1B2C3F8
=9A1B
-----END PGP SIGNATURE-----`;

        setReceipt(blockReceipt);
      }
    }, 1000);
  };

  const copyReceipt = () => {
    if (receipt) {
      navigator.clipboard.writeText(receipt);
      setCopiedReceipt(true);
      setTimeout(() => setCopiedReceipt(false), 2000);
    }
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
      <div className="max-w-[720px] mx-auto mb-16 text-center md:text-left border-b-[0.5px] border-outline-variant pb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-6">Submission of Inquiry</h1>
        <p className="font-sans text-base md:text-lg text-on-surface-variant leading-relaxed">
          Direct correspondence protocol for research inquiries, methodology requests, and institutional collaboration proposals. Please route your inquiry through the appropriate channels below.
        </p>
      </div>

      {receipt ? (
        /* PGP Signed Receipt view after successful submit */
        <div className="max-w-3xl mx-auto border-[0.5px] border-outline bg-surface-container-lowest p-6 md:p-8 rounded-[2px] animate-fade-in shadow-sm">
          <div className="flex items-center gap-3 text-secondary mb-6 border-b-[0.5px] border-outline-variant pb-4">
            <Shield className="w-6 h-6 flex-shrink-0" />
            <div>
              <h2 className="font-mono text-xs uppercase tracking-widest text-primary font-bold">Inquiry Securely Logged</h2>
              <p className="font-sans text-xs text-on-surface-variant">Cryptographic transmission credentials established below.</p>
            </div>
          </div>

          <p className="font-sans text-sm text-on-surface mb-6 leading-relaxed">
            Thank you, <strong className="text-primary">{form.investigatorName}</strong>. Your dossier has been logged at our physical node in Geneva. A coordinator will evaluate your research requirements. Copied PGP headers are provided as proof of receipt.
          </p>

          <div className="relative font-mono text-[11px] leading-relaxed text-on-surface-variant bg-surface p-4 border-[0.5px] border-outline-variant rounded-[2px] max-h-[300px] overflow-y-auto overflow-x-hidden whitespace-pre-wrap select-text break-all">
            {receipt}
            <button
              onClick={copyReceipt}
              className="absolute top-3 right-3 p-1.5 bg-surface-container hover:bg-surface-container-high border border-outline-variant text-primary rounded cursor-pointer transition-colors"
              title="Copy PGP Signature Block"
              id="copy-receipt-btn"
            >
              {copiedReceipt ? <Check className="w-4 h-4 text-secondary" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="mt-8 pt-6 border-t-[0.5px] border-outline-variant flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-sans text-outline">
              <Info className="w-4 h-4" />
              <span>Response expected in 3-5 academic business days.</span>
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
          
          {/* Left Column: Direct relays & Notice box */}
          <div className="lg:col-span-4 flex flex-col gap-12 lg:pr-12 lg:border-r-[0.5px] lg:border-outline-variant h-fit">
            
            {/* Notice Box */}
            <div className="bg-surface-container-low p-6 border-[0.5px] border-tertiary/20 relative rounded-[2px]">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-tertiary"></div>
              <h3 className="font-mono text-xs uppercase tracking-widest text-tertiary mb-3 flex items-center gap-2 font-bold">
                <Info className="w-4 h-4 text-tertiary" />
                RESPONSE LATENCY
              </h3>
              <p className="font-sans text-xs md:text-sm text-on-surface-variant leading-relaxed">
                Due to current research volumes, non-urgent methodology inquiries may experience a processing delay of 3-5 academic business days.
              </p>
            </div>

            {/* Direct relays block */}
            <section>
              <h2 className="font-mono text-xs uppercase tracking-widest text-on-surface-variant mb-6 pb-2 border-b-[0.5px] border-outline-variant font-bold">
                Direct Communication
              </h2>
              <div className="space-y-6">
                <div>
                  <p className="font-sans text-[11px] text-outline uppercase font-semibold mb-1">PRIMARY RELAY</p>
                  <a
                    className="font-sans text-lg text-primary font-semibold hover:underline underline-offset-4 decoration-[0.5px]"
                    href="mailto:inquiry@ecosphere.org"
                  >
                    inquiry@ecosphere.org
                  </a>
                </div>
                <div>
                  <p className="font-sans text-[11px] text-outline uppercase font-semibold mb-2">PGP FINGERPRINT</p>
                  <p className="font-mono text-[11px] text-on-surface-variant bg-surface-container-high py-2.5 px-3 border-[0.5px] border-outline-variant rounded-sm break-all leading-normal select-all">
                    4F8A 9B2C 11D3 E7F5 66A1 8C90 B2D4 E6F8 90A1 B2C3
                  </p>
                </div>
              </div>
            </section>

            {/* Address block */}
            <section>
              <h2 className="font-mono text-xs uppercase tracking-widest text-on-surface-variant mb-6 pb-2 border-b-[0.5px] border-outline-variant font-bold">
                Physical Node
              </h2>
              <address className="font-sans text-xs md:text-sm text-on-surface-variant not-italic space-y-1.5 leading-relaxed">
                EcoSphere Research Institute<br />
                Global Environmental Consortium<br />
                1024 Climate Data Row, Suite 400<br />
                Geneva, CH-1201<br />
                Switzerland
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
                  <p className="font-serif text-lg font-bold text-primary">Transmitting Encrypted Dossier...</p>
                  <p className="font-mono text-xs text-secondary italic mt-1">{submitStep}</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Investigator Name */}
                    <div className="flex flex-col">
                      <label className="font-mono text-xs text-on-surface-variant mb-2 uppercase font-bold" htmlFor="investigatorName">
                        Principal Investigator / Name
                      </label>
                      <input
                        type="text"
                        name="investigatorName"
                        id="investigatorName"
                        value={form.investigatorName}
                        onChange={handleInputChange}
                        placeholder="Dr. Jane Doe"
                        required
                        className="bg-transparent border-b-[0.5px] border-outline focus:outline-none focus:border-primary focus:bg-surface-container-low transition-all py-2 text-sm font-sans"
                      />
                    </div>

                    {/* Affiliated Institution */}
                    <div className="flex flex-col">
                      <label className="font-mono text-xs text-on-surface-variant mb-2 uppercase font-bold" htmlFor="institution">
                        Affiliated Institution
                      </label>
                      <input
                        type="text"
                        name="institution"
                        id="institution"
                        value={form.institution}
                        onChange={handleInputChange}
                        placeholder="University of ..."
                        className="bg-transparent border-b-[0.5px] border-outline focus:outline-none focus:border-primary focus:bg-surface-container-low transition-all py-2 text-sm font-sans"
                      />
                    </div>
                  </div>

                  {/* Return Relay (Email) */}
                  <div className="flex flex-col">
                    <label className="font-mono text-xs text-on-surface-variant mb-2 uppercase font-bold" htmlFor="returnRelay">
                      Return Relay (Email)
                    </label>
                    <input
                      type="email"
                      name="returnRelay"
                      id="returnRelay"
                      value={form.returnRelay}
                      onChange={handleInputChange}
                      placeholder="name@institution.edu"
                      required
                      className="bg-transparent border-b-[0.5px] border-outline focus:outline-none focus:border-primary focus:bg-surface-container-low transition-all py-2 text-sm font-sans w-full"
                    />
                  </div>

                  {/* Inquiry Classification Dropdown */}
                  <div className="flex flex-col">
                    <label className="font-mono text-xs text-on-surface-variant mb-2 uppercase font-bold" htmlFor="classification">
                      Inquiry Classification
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
                      <option value="" disabled>Select classification...</option>
                      <option value="data_access">Dataset Access Protocol</option>
                      <option value="collaboration">Research Collaboration Proposal</option>
                      <option value="methodology">Methodological Clarification</option>
                      <option value="technical">Technical Platform Support</option>
                      <option value="other">Unclassified Inquiry</option>
                    </select>
                  </div>

                  {/* Inquiry Dossier Area with live markdown previewer toggle */}
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                      <label className="font-mono text-xs text-on-surface-variant uppercase font-bold" htmlFor="dossier">
                        Inquiry Dossier
                      </label>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] text-outline font-semibold">Markdown Enabled</span>
                        <button
                          type="button"
                          onClick={() => setPreviewMarkdown(!previewMarkdown)}
                          className={`px-2 py-0.5 font-mono text-[10px] uppercase font-bold tracking-wider rounded border transition-colors cursor-pointer ${
                            previewMarkdown
                              ? 'bg-primary text-on-primary border-primary'
                              : 'bg-surface hover:bg-surface-container text-on-surface-variant border-outline-variant'
                          }`}
                          id="toggle-dossier-preview-btn"
                        >
                          {previewMarkdown ? 'Editor' : 'Live Preview'}
                        </button>
                      </div>
                    </div>

                    {previewMarkdown ? (
                      /* Live Markdown visual preview area */
                      <div className="w-full min-h-[160px] bg-surface-container-lowest border-[0.5px] border-outline rounded-sm p-4 h-[200px] overflow-y-auto shadow-inner text-justify">
                        {parseSimpleMarkdown(form.dossier)}
                      </div>
                    ) : (
                      /* Real text area editor */
                      <textarea
                        name="dossier"
                        id="dossier"
                        value={form.dossier}
                        onChange={handleInputChange}
                        placeholder="Provide a detailed abstract of your request... (e.g., # Proposed Analysis\n- Target metrics\n- Expected outputs...)"
                        required
                        rows={6}
                        className="bg-transparent border-b-[0.5px] border-outline focus:outline-none focus:border-primary focus:bg-surface-container-low transition-all py-2 text-sm font-sans resize-y min-h-[120px] w-full"
                      />
                    )}
                  </div>

                  {/* Submit Button block */}
                  <div className="pt-6 border-t-[0.5px] border-outline-variant flex justify-end">
                    <button
                      type="submit"
                      className="bg-primary hover:bg-primary-container text-on-primary font-mono text-xs uppercase tracking-widest font-semibold py-3 px-8 rounded-[2px] transition-colors flex items-center gap-3 cursor-pointer"
                      id="submit-dossier-btn"
                    >
                      Transmit Dossier
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

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArticleDoc } from '../types';
import { useFrameworks } from '../content/ContentContext';
import { ArrowLeft, ArrowRight, Download, FileText, Check, Award, Copy, Loader2, Sparkles, Library } from 'lucide-react';

interface ArticleReaderProps {
  article: ArticleDoc;
  onClose: () => void;
}

export default function ArticleReader({ article, onClose }: ArticleReaderProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloadStep, setDownloadStep] = useState('');
  const [downloadFinished, setDownloadFinished] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const frameworks = useFrameworks();
  const linkedResource = article.linkedResourceSlug
    ? frameworks.find((f) => f.slug === article.linkedResourceSlug) ?? null
    : null;

  const simulatePDFDownload = () => {
    setDownloading(true);
    setDownloadFinished(false);
    const steps = [
      'Preparing report package...',
      'Compiling article sections and figures...',
      'Generating metadata and references...',
      'Finalizing download file...',
    ];

    let currentStep = 0;
    setDownloadStep(steps[0]);

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setDownloadStep(steps[currentStep]);
      } else {
        clearInterval(interval);
        setDownloading(false);
        setDownloadFinished(true);
        
        // Actually generate a simple text/plain file with the article contents!
        const content = `
=========================================
ECOVERIDIAN REPORT
Volume IV / Issue 09 — Grounded in Inquiry
=========================================

Title: ${article.title}
Author: ${article.author}
Category: ${article.category}
Read Time: ${article.readTime}

-----------------------------------------
ABSTRACT
-----------------------------------------
${article.abstract}

-----------------------------------------
INTRODUCTION
-----------------------------------------
${article.introduction}

-----------------------------------------
METHODOLOGY
-----------------------------------------
${article.methodologyText}

-----------------------------------------
ANALYSIS & DISCUSSIONS
-----------------------------------------
${article.analysisText}

-----------------------------------------
REFERENCES
-----------------------------------------
${article.references.map((r, i) => `[${i + 1}] ${r}`).join('\n')}

=========================================
OFFICIAL CITATION RECORD
EcoVeridian Reference Copy
EcoVeridian Publication ID: EV-${article.slug}-2026
=========================================
`;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${article.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_scholarly_report.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }, 1000);
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <article className="w-full max-w-[1280px] mx-auto px-5 md:px-16 py-12 animate-fade-in">
      
      {/* Back Button */}
      <button
        onClick={onClose}
        className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-widest hover:text-secondary transition-colors mb-8 cursor-pointer group"
        id="reader-back-btn"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Return to Curated Archives
      </button>

      {/* Hero Header */}
      <div className="border-b-[0.5px] border-outline-variant pb-10 mb-12">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <span className="font-mono text-xs px-2 py-1 bg-surface border-[0.5px] border-secondary text-secondary uppercase">
            {article.category}
          </span>
          <span className="font-mono text-xs px-2 py-1 bg-surface border-[0.5px] border-outline text-on-surface-variant uppercase">
            ID: ECO-{article.slug}
          </span>
          {article.publishedDate && (
            <span className="font-mono text-xs text-outline-variant ml-auto">
              Published {article.publishedDate}
            </span>
          )}
        </div>

        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-primary font-bold tracking-tight leading-tight mb-6">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 font-sans text-sm text-on-surface-variant pt-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-primary">{article.author}</span>
            <span>•</span>
            <span>Geneva Research Node</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-wider text-outline">
            <span>Read Time: {article.readTime}</span>
            <span>•</span>
            <span>Team Verified</span>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Side: Meta & References (lg:col-span-4) */}
        <div className="lg:col-span-4 flex flex-col gap-8 lg:border-r-[0.5px] lg:border-outline-variant lg:pr-10">
          
          {/* Abstract block */}
          <div className="bg-surface-container-low p-6 border-l-4 border-primary relative">
            <h3 className="font-mono text-xs uppercase tracking-widest text-primary font-bold mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-secondary" />
              REGISTRATION ABSTRACT
            </h3>
            <p className="font-serif text-sm italic text-on-surface leading-relaxed">
              &ldquo;{article.abstract}&rdquo;
            </p>
          </div>

          {/* Interactive tools */}
          <div className="border-[0.5px] border-outline-variant bg-surface p-5 rounded-[2px]">
            <h4 className="font-mono text-xs uppercase tracking-widest text-on-surface-variant mb-4 font-bold">
              Scholarly Instruments
            </h4>
            
            {article.linkedResourceSlug ? (
              <Link
                to={`/resources/${article.linkedResourceSlug}`}
                className="w-full py-3 bg-primary text-on-primary font-mono text-xs uppercase tracking-widest hover:bg-primary-container hover:text-on-primary transition-all flex items-center justify-center gap-3 cursor-pointer"
                id="view-resource-btn"
              >
                <Library className="w-4 h-4" />
                {linkedResource ? 'View in Resource Hub' : 'Open Linked Resource'}
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <button
                onClick={simulatePDFDownload}
                disabled={downloading}
                className="w-full py-3 bg-primary text-on-primary font-mono text-xs uppercase tracking-widest hover:bg-primary-container hover:text-on-primary transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
                id="download-citation-btn"
              >
                {downloading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Compiling...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Download Scholarly PDF
                  </>
                )}
              </button>
            )}

            {!article.linkedResourceSlug && downloading && (
              <div className="mt-4 animate-pulse">
                <div className="w-full bg-surface-container-high h-[4px] rounded-full overflow-hidden">
                  <div className="bg-secondary h-full w-[40%] animate-[shimmer_1.5s_infinite]" />
                </div>
                <p className="font-sans text-[11px] text-secondary italic mt-2 leading-relaxed">
                  {downloadStep}
                </p>
              </div>
            )}

            {!article.linkedResourceSlug && downloadFinished && (
              <div className="mt-4 p-3 bg-primary-fixed text-on-primary-fixed border border-primary/20 rounded-[2px] flex items-center gap-2 text-xs font-sans animate-fade-in">
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
                <span>Typeset report successfully generated & downloaded! Check downloads folder.</span>
              </div>
            )}

            <div className="mt-6 pt-4 border-t-[0.5px] border-outline-variant space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-outline">Publication Hash</span>
                <span className="font-mono text-[10px] text-on-surface-variant bg-surface-container-low px-1.5 py-0.5 border border-outline-variant rounded-sm">
                  SHA-256: 3F9E2A
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-outline">License Scope</span>
                <span className="font-mono text-[10px] text-secondary bg-secondary-container/20 px-1.5 py-0.5 border border-secondary/20 rounded-sm">
                  CC-BY-NC-ND 4.0
                </span>
              </div>
            </div>
          </div>

          {/* References */}
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-outline-variant mb-6 pb-2 border-b-[0.5px] border-outline-variant font-bold">
              Archival References
            </h3>
            <ol className="space-y-4 font-sans text-xs text-on-surface-variant leading-relaxed">
              {article.references.map((reference, i) => (
                <li key={i} className="flex gap-3 items-start group">
                  <span className="font-mono text-secondary font-bold select-none pt-0.5">[{i + 1}]</span>
                  <div className="flex-1">
                    <p className="italic inline">{reference}</p>
                    <button
                      onClick={() => copyToClipboard(reference, i)}
                      className="ml-2 inline-flex items-center text-primary hover:text-secondary opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer align-middle"
                      title="Copy APA Citation"
                    >
                      {copiedIndex === i ? (
                        <Check className="w-3 h-3 text-secondary" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Right Side: Main Text (lg:col-span-8) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Main Photo / Figure */}
          <div className="border-[0.5px] border-outline-variant relative overflow-hidden bg-surface group">
            <img
              className="w-full h-[350px] md:h-[450px] object-cover filter grayscale contrast-125 brightness-90 hover:brightness-100 transition-all duration-500"
              src={article.imageUrl}
              alt={article.title}
              referrerPolicy="no-referrer"
            />
            {article.figureCaption && (
              <div className="bg-surface px-4 py-3 border-t-[0.5px] border-outline-variant flex items-center justify-between">
                <span className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">
                  {article.figureCaption}
                </span>
                <span className="font-mono text-[10px] text-outline font-bold">
                  PLATE IX
                </span>
              </div>
            )}
          </div>

          {/* Introduction */}
          <div>
            <h2 className="font-serif text-2xl text-primary font-semibold mb-4 border-b-[0.5px] border-outline-variant pb-2">
              1. Introduction & Context
            </h2>
            <p className="font-sans text-base md:text-lg text-on-surface leading-relaxed text-justify mb-4">
              <span className="float-left text-5xl md:text-6xl text-primary font-serif font-bold mr-3 mt-1 select-none leading-[0.8] border-r-2 border-secondary pr-2">
                {article.introduction.charAt(0)}
              </span>
              {article.introduction.slice(1)}
            </p>
          </div>

          {/* Methodology */}
          <div>
            <h2 className="font-serif text-2xl text-primary font-semibold mb-4 border-b-[0.5px] border-outline-variant pb-2">
              2. Methodology & Observational Protocol
            </h2>
            <p className="font-sans text-base md:text-lg text-on-surface leading-relaxed text-justify">
              {article.methodologyText}
            </p>
          </div>

          {/* Analysis */}
          <div>
            <h2 className="font-serif text-2xl text-primary font-semibold mb-4 border-b-[0.5px] border-outline-variant pb-2">
              3. Analytical Calculus & Discussion
            </h2>
            <p className="font-sans text-base md:text-lg text-on-surface leading-relaxed text-justify">
              {article.analysisText}
            </p>
          </div>

          {/* Peer Certification Footer */}
          <div className="mt-8 p-6 bg-surface-container border-[0.5px] border-outline-variant flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Award className="w-10 h-10 text-secondary stroke-[1.5]" />
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
                  EcoVeridian Reviewed
                </p>
                <p className="font-sans text-xs text-on-surface-variant">
                  This work has been reviewed internally for clarity and reproducibility.
                </p>
              </div>
            </div>
            <div className="font-mono text-[10px] text-outline text-right">
              REGISTRY: ECO-RE-2026-X49
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

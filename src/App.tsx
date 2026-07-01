/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import EditorialView from './components/EditorialView';
import ArticleReader from './components/ArticleReader';
import MasterIndexView from './components/MasterIndexView';
import FrameworkDrawer from './components/FrameworkDrawer';
import SubmissionView from './components/SubmissionView';
import InstitutionalAccessView from './components/InstitutionalAccessView';

import { ENVIRONMENTAL_FRAMEWORKS, SCHOLARLY_ARTICLES } from './data';
import { ScholarlyArticle, EnvironmentalFramework } from './types';
import { Shield, X, Check, Loader2, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'collections' | 'journals' | 'methodology' | 'institutional'>('collections');
  const [selectedArticle, setSelectedArticle] = useState<ScholarlyArticle | null>(null);
  const [selectedFramework, setSelectedFramework] = useState<EnvironmentalFramework | null>(null);
  
  // Custom draft pre-fill state for linking Institutional Calculator directly into Submission dossier form
  const [inquiryDraft, setInquiryDraft] = useState<string>('');

  // Sign in state
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [signInEmail, setSignInEmail] = useState('veridiandev01@gmail.com');
  const [signInPassword, setSignInPassword] = useState('');
  const [signingIn, setSigningIn] = useState(false);
  const [signInSuccess, setSignInSuccess] = useState(false);

  // Pre-fill route helper when clicking Draft Agreement on Institutional Calculator
  const handleDraftInquiry = (draftText: string) => {
    setInquiryDraft(draftText);
    setActiveTab('methodology');
    setSelectedArticle(null);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setSigningIn(true);
    setTimeout(() => {
      setSigningIn(false);
      setSignInSuccess(true);
      setTimeout(() => {
        setIsSignedIn(true);
        setShowSignInModal(false);
        setSignInSuccess(false);
      }, 1000);
    }, 1200);
  };

  const handleSignOut = () => {
    setIsSignedIn(false);
    setSignInPassword('');
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col font-sans selection:bg-primary-container selection:text-on-primary-container transition-all duration-300">
      
      {/* Top Header navbar navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedArticle(null); // Return to general list on tab switch
        }}
        onSignInClick={() => {
          if (isSignedIn) {
            handleSignOut();
          } else {
            setShowSignInModal(true);
          }
        }}
        isSignedIn={isSignedIn}
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        
        {/* Render Reader View if an article is active */}
        {selectedArticle ? (
          <ArticleReader
            article={selectedArticle}
            onClose={() => setSelectedArticle(null)}
          />
        ) : (
          /* Render Active Tab views */
          <>
            {activeTab === 'collections' && (
              <EditorialView
                articles={SCHOLARLY_ARTICLES}
                onSelectArticle={(article) => setSelectedArticle(article)}
              />
            )}

            {activeTab === 'journals' && (
              <MasterIndexView
                frameworks={ENVIRONMENTAL_FRAMEWORKS}
                onSelectFramework={(fw) => setSelectedFramework(fw)}
              />
            )}

            {activeTab === 'methodology' && (
              <SubmissionView />
            )}

            {activeTab === 'institutional' && (
              <InstitutionalAccessView
                onDraftInquiry={handleDraftInquiry}
              />
            )}
          </>
        )}
      </main>

      {/* Detail slide drawer panel for framework item */}
      {selectedFramework && (
        <FrameworkDrawer
          framework={selectedFramework}
          onClose={() => setSelectedFramework(null)}
        />
      )}

      {/* Footer component */}
      <Footer
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedArticle(null);
        }}
      />

      {/* Academic Sign-In Modal Overlay */}
      {showSignInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs animate-fade-in p-4">
          <div className="bg-surface border-[0.5px] border-outline max-w-sm w-full p-6 md:p-8 rounded-[2px] shadow-2xl relative animate-scale-up">
            
            <button
              onClick={() => setShowSignInModal(false)}
              className="absolute top-4 right-4 p-1 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded cursor-pointer"
              id="signin-close-btn"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-6 text-primary border-b-[0.5px] border-outline-variant pb-3">
              <Shield className="w-5 h-5 text-secondary" />
              <h3 className="font-mono text-xs uppercase tracking-widest font-bold">
                Scholarly Authentication
              </h3>
            </div>

            {signInSuccess ? (
              <div className="py-8 text-center flex flex-col items-center justify-center gap-3 animate-fade-in">
                <div className="w-10 h-10 bg-primary-fixed text-on-primary-fixed rounded-full flex items-center justify-center border border-primary/20">
                  <Check className="w-6 h-6 text-primary" />
                </div>
                <p className="font-serif text-lg font-bold text-primary">Identity Authenticated</p>
                <p className="font-sans text-xs text-outline-variant">Synchronizing local credentials profile...</p>
              </div>
            ) : signingIn ? (
              <div className="py-8 text-center flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 text-secondary animate-spin" />
                <p className="font-serif text-base font-bold text-primary">Verifying Academic Handshake...</p>
              </div>
            ) : (
              <form onSubmit={handleSignIn} className="space-y-4">
                <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                  Authenticate using your registered academic relay nodes to verify consortium membership permissions.
                </p>

                <div className="flex flex-col">
                  <label className="font-mono text-[10px] text-outline uppercase font-semibold mb-1" htmlFor="signin-email">
                    Scholar Email Address
                  </label>
                  <input
                    type="email"
                    id="signin-email"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    required
                    className="bg-surface-container-low border border-outline-variant rounded-xs px-3 py-2 text-sm font-sans focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="font-mono text-[10px] text-outline uppercase font-semibold mb-1" htmlFor="signin-password">
                    Consortium Passcode
                  </label>
                  <input
                    type="password"
                    id="signin-password"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="bg-surface-container-low border border-outline-variant rounded-xs px-3 py-2 text-sm font-sans focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-primary hover:bg-primary-container text-on-primary font-mono text-xs uppercase tracking-widest font-bold rounded-[2px] transition-colors cursor-pointer"
                    id="signin-submit-btn"
                  >
                    Establish Secure Session
                  </button>
                  <div className="mt-3 flex justify-between items-center text-[10px] font-sans text-outline">
                    <span className="hover:underline hover:text-primary cursor-pointer">Register Credentials</span>
                    <span className="hover:underline hover:text-primary cursor-pointer">PGP Recovery</span>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

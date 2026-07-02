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
import TeamView from './components/TeamView';

import { ENVIRONMENTAL_FRAMEWORKS, SCHOLARLY_ARTICLES } from './data';
import { ScholarlyArticle, EnvironmentalFramework } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'collections' | 'journals' | 'methodology' | 'institutional' | 'team'>('collections');
  const [selectedArticle, setSelectedArticle] = useState<ScholarlyArticle | null>(null);
  const [selectedFramework, setSelectedFramework] = useState<EnvironmentalFramework | null>(null);

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col font-sans selection:bg-primary-container selection:text-on-primary-container transition-all duration-300">
      
      {/* Top Header navbar navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedArticle(null); // Return to general list on tab switch
        }}
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
                onGoToPartnerWithUs={() => {
                  setActiveTab('methodology');
                  setSelectedArticle(null);
                }}
              />
            )}

            {activeTab === 'team' && (
              <TeamView />
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
    </div>
  );
}

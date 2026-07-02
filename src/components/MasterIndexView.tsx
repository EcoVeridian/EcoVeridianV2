/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { EnvironmentalFramework } from '../types';
import { Download, Search, SlidersHorizontal, Check, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

interface MasterIndexViewProps {
  frameworks: EnvironmentalFramework[];
  onSelectFramework: (framework: EnvironmentalFramework) => void;
}

export default function MasterIndexView({ frameworks, onSelectFramework }: MasterIndexViewProps) {
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  
  // Discipline multi-select state
  const [disciplines, setDisciplines] = useState<Record<string, boolean>>({
    'Tourism Forecasting': false,
    'Environmental Data Analysis': false,
    'Sustainability Metrics': false,
    'Machine Learning Models': false,
    'Engineering Design Challenge': false,
  });

  // Domain Focus multi-select state
  const [domains, setDomains] = useState<Record<string, boolean>>({
    'Written Report': false,
    'Dataset Summary': false,
    'Code / Notebook': false,
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Active filters (synchronized immediately or on "Apply Filters" click)
  // Let's implement full reactive live filtering, and let "Apply Filters" reset pagination and show an elegant status flash.
  const [appliedFilters, setAppliedFilters] = useState({
    disciplines: { ...disciplines },
    domains: { ...domains },
    searchQuery: '',
  });

  const [filterFlash, setFilterFlash] = useState(false);

  // Apply Action
  const handleApplyFilters = () => {
    setAppliedFilters({
      disciplines: { ...disciplines },
      domains: { ...domains },
      searchQuery: searchQuery,
    });
    setCurrentPage(1);
    setFilterFlash(true);
    setTimeout(() => setFilterFlash(false), 2000);
  };

  // Toggle helpers
  const handleDisciplineChange = (key: string) => {
    setDisciplines((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDomainChange = (key: string) => {
    setDomains((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Filter logic
  const filteredFrameworks = useMemo(() => {
    return frameworks.filter((item) => {
      // 1. Search query check (matches ID, title, coverage, or description)
      const q = appliedFilters.searchQuery.toLowerCase();
      const matchesSearch =
        item.title.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.coverage.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      // 2. Topic tag filter check
      const activeDisciplines = Object.entries(appliedFilters.disciplines)
        .filter(([_, checked]) => checked)
        .map(([name]) => name);

      if (activeDisciplines.length > 0 && !activeDisciplines.includes(item.discipline)) {
        return false;
      }

      // 3. Format filter check
      const activeDomains = Object.entries(appliedFilters.domains)
        .filter(([_, checked]) => checked)
        .map(([name]) => name);

      if (activeDomains.length > 0 && !activeDomains.includes(item.domain)) {
        return false;
      }

      return true;
    });
  }, [frameworks, appliedFilters]);

  // Paginated Slicing
  const paginatedFrameworks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredFrameworks.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredFrameworks, currentPage]);

  const totalPages = Math.ceil(filteredFrameworks.length / itemsPerPage) || 1;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const statusTags = {
    Verified: 'bg-primary-fixed text-on-primary-fixed border border-primary/10',
    Archived: 'bg-surface-variant text-on-surface-variant border border-outline-variant',
    Standard: 'bg-secondary-container/30 text-on-secondary-container border border-secondary/15',
  };

  // Quick download helper for row-level trigger
  const handleRowDownload = (e: React.MouseEvent, item: EnvironmentalFramework) => {
    e.stopPropagation(); // prevent opening drawer
    // Generate simple text schema download
    const headers = ['ID', 'Title', 'Discipline', 'Domain', 'Format', 'Size', 'LastUpdated', 'Coverage'];
    const rowValues = [
      item.id,
      `"${item.title}"`,
      `"${item.discipline}"`,
      `"${item.domain}"`,
      item.format,
      item.size,
      item.lastUpdated,
      `"${item.coverage}"`,
    ];
    const csvContent = [headers.join(','), rowValues.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ecoveridian_${item.id.toLowerCase().replace(/-/g, '_')}_resource_metadata.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-5 md:px-16 py-12 md:py-16 grid grid-cols-1 md:grid-cols-12 gap-12 animate-fade-in">
      
      {/* Left Sidebar: Taxonomy (md:col-span-3) */}
      <aside className="col-span-1 md:col-span-3">
        <div className="sticky top-[100px] flex flex-col gap-8">
          
          <div className="border-b-[0.5px] border-outline pb-4 flex items-center justify-between">
            <h2 className="font-serif text-2xl font-semibold text-primary">Filters</h2>
            <SlidersHorizontal className="w-4 h-4 text-outline" />
          </div>

          {/* Filter Group: Topic Tags */}
          <div>
            <h3 className="font-mono text-xs text-on-surface-variant font-bold uppercase tracking-widest mb-4">
              Topic Tags
            </h3>
            <ul className="space-y-3 font-sans text-sm">
              {[
                { name: 'Tourism Forecasting', count: 1 },
                { name: 'Environmental Data Analysis', count: 1 },
                { name: 'Sustainability Metrics', count: 1 },
                { name: 'Machine Learning Models', count: 1 },
                { name: 'Engineering Design Challenge', count: 1 },
              ].map((disc) => (
                <li key={disc.name}>
                  <label className="flex items-center gap-3 cursor-pointer group select-none">
                    <input
                      type="checkbox"
                      checked={disciplines[disc.name]}
                      onChange={() => handleDisciplineChange(disc.name)}
                      className="appearance-none w-4 h-4 border-[0.5px] border-outline rounded-sm checked:bg-primary checked:border-primary transition-colors focus:ring-1 focus:ring-primary focus:ring-offset-1 focus:ring-offset-surface cursor-pointer"
                    />
                    <span
                      className={`transition-colors ${
                        disciplines[disc.name]
                          ? 'text-primary font-semibold'
                          : 'text-on-surface group-hover:text-primary'
                      }`}
                    >
                      {disc.name}
                    </span>
                    <span className="ml-auto font-mono text-[10px] text-outline-variant group-hover:text-primary">
                      {disc.count}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* Filter Group: Format */}
          <div>
            <h3 className="font-mono text-xs text-on-surface-variant font-bold uppercase tracking-widest mb-4">
              Format
            </h3>
            <ul className="space-y-3 font-sans text-sm">
              {['Written Report', 'Dataset Summary', 'Code / Notebook'].map((domainName) => (
                <li key={domainName}>
                  <label className="flex items-center gap-3 cursor-pointer group select-none">
                    <input
                      type="checkbox"
                      checked={domains[domainName]}
                      onChange={() => handleDomainChange(domainName)}
                      className="appearance-none w-4 h-4 border-[0.5px] border-outline rounded-sm checked:bg-primary checked:border-primary transition-colors focus:ring-1 focus:ring-primary focus:ring-offset-1 focus:ring-offset-surface cursor-pointer"
                    />
                    <span
                      className={`transition-colors ${
                        domains[domainName]
                          ? 'text-primary font-semibold'
                          : 'text-on-surface group-hover:text-primary'
                      }`}
                    >
                      {domainName}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* Apply Button */}
          <div>
            <button
              onClick={handleApplyFilters}
              className="w-full py-2.5 border-[0.5px] border-outline text-primary hover:bg-surface-container-low font-mono text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-99"
              id="sidebar-apply-btn"
            >
              {filterFlash ? (
                <>
                  <Check className="w-3.5 h-3.5 text-secondary" />
                  Filters Applied
                </>
              ) : (
                'Apply Filters'
              )}
            </button>
            <button
              onClick={() => {
                setDisciplines({
                  'Tourism Forecasting': false,
                  'Environmental Data Analysis': false,
                  'Sustainability Metrics': false,
                  'Machine Learning Models': false,
                  'Engineering Design Challenge': false,
                });
                setDomains({
                  'Written Report': false,
                  'Dataset Summary': false,
                  'Code / Notebook': false,
                });
                setSearchQuery('');
                setAppliedFilters({
                  disciplines: {
                    'Tourism Forecasting': false,
                    'Environmental Data Analysis': false,
                    'Sustainability Metrics': false,
                    'Machine Learning Models': false,
                    'Engineering Design Challenge': false,
                  },
                  domains: {
                    'Written Report': false,
                    'Dataset Summary': false,
                    'Code / Notebook': false,
                  },
                  searchQuery: '',
                });
                setCurrentPage(1);
              }}
              className="w-full text-center text-[11px] font-sans text-outline hover:text-primary hover:underline mt-2 cursor-pointer"
              id="sidebar-clear-btn"
            >
              Reset all parameters
            </button>
          </div>
        </div>
      </aside>

      {/* Main Index Area (md:col-span-9) */}
      <section className="col-span-1 md:col-span-9">
        
        {/* Header Block */}
        <header className="mb-10">
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-primary font-bold mb-4 leading-tight">
            Resource Hub
          </h1>
          <p className="font-sans text-base md:text-lg text-on-surface-variant max-w-3xl leading-relaxed">
            Browse our verified research outputs, dataset summaries, and reproducible methods. This page is structured to scale as EcoVeridian publishes more partner-ready work.
          </p>
        </header>

        {/* Live Search Bar */}
        <div className="relative mb-8 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleApplyFilters();
            }}
            placeholder="Search projects and resources (e.g., Yellowstone, forecast, notebook)..."
            className="w-full pl-10 pr-20 py-2.5 bg-surface-container-lowest border-[0.5px] border-outline text-sm font-sans focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary rounded-xs"
            id="search-index-input"
          />
          <Search className="w-4 h-4 text-outline absolute left-3 top-3.5" />
          <button
            onClick={handleApplyFilters}
            className="absolute right-2 top-2 px-3 py-1 bg-primary text-on-primary font-mono text-[10px] uppercase font-bold tracking-wider hover:bg-primary-container hover:text-on-primary rounded-xs transition-colors cursor-pointer"
            id="search-index-btn"
          >
            Search
          </button>
        </div>

        {/* Table Header Row (Desktop Layout) */}
        <div className="hidden md:flex flex-row items-center justify-between pb-3.5 border-b-[0.5px] border-primary font-mono text-xs text-primary font-bold uppercase tracking-widest px-2">
          <div className="flex-1">Project Code, Status, and Title</div>
          <div className="flex gap-12 w-1/2 justify-end pr-4">
            <span className="w-20 text-right">Format</span>
            <span className="w-20 text-right">Size</span>
            <span className="w-24 text-right">Last Updated</span>
            <span className="w-8"></span>
          </div>
        </div>

        {/* Dynamic Frameworks Rows */}
        <div className="flex flex-col">
          {paginatedFrameworks.length > 0 ? (
            paginatedFrameworks.map((item) => (
              <article
                key={item.id}
                onClick={() => onSelectFramework(item)}
                className="py-6 border-b-[0.5px] border-outline hover:bg-surface-container-lowest transition-colors duration-200 group flex flex-col md:flex-row gap-4 items-start md:items-center justify-between px-2 rounded-sm cursor-pointer"
                id={`framework-row-${item.id}`}
              >
                {/* ID & Title */}
                <div className="flex-1 pr-6">
                  <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                    <span className="font-mono text-[10px] leading-[14px] uppercase tracking-widest border-[0.5px] border-secondary text-secondary bg-surface px-2 py-0.5 rounded-sm">
                      {item.id}
                    </span>
                    <span className={`font-mono text-[10px] leading-[14px] uppercase tracking-widest px-2 py-0.5 rounded-sm ${statusTags[item.status]}`}>
                      {item.status}
                    </span>
                    <span className="font-mono text-[10px] text-outline font-medium tracking-wide">
                      {item.discipline}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg md:text-xl font-bold text-primary group-hover:text-secondary transition-colors leading-tight">
                    {item.title}
                  </h3>
                </div>

                {/* Meta stats block */}
                <div className="flex flex-row gap-6 md:gap-12 w-full md:w-1/2 justify-between md:justify-end items-center font-mono text-xs text-on-surface-variant">
                  <div className="flex flex-col md:flex-row gap-6 md:gap-12 w-full justify-between md:justify-end items-center">
                    <span className="w-20 md:text-right text-[11px] font-bold text-primary bg-surface-container/50 py-0.5 px-2 md:bg-transparent md:p-0 rounded-xs">
                      {item.format}
                    </span>
                    <span className="w-20 md:text-right font-sans text-xs">
                      {item.size}
                    </span>
                    <span className="w-24 md:text-right text-outline text-[11px]">
                      {item.lastUpdated}
                    </span>
                  </div>
                  
                  {/* Immediate Download trigger */}
                  <button
                    onClick={(e) => handleRowDownload(e, item)}
                    className="w-8 h-8 flex items-center justify-center rounded-full border-[0.5px] border-outline text-outline hover:border-primary hover:text-primary hover:bg-surface-container-low transition-all flex-shrink-0 cursor-pointer"
                    title={`Export ${item.id} Metadata`}
                    id={`download-row-btn-${item.id}`}
                  >
                    <Download className="w-4 h-4 stroke-[1.5]" />
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="py-12 border-b-[0.5px] border-outline text-center">
              <RefreshCw className="w-8 h-8 text-outline animate-spin mx-auto mb-4" />
              <p className="font-serif text-lg text-primary font-semibold">No indexing records matches</p>
              <p className="font-sans text-xs text-on-surface-variant mt-1">Try resetting selected filters or adjusting queries.</p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="mt-12 flex justify-between items-center border-t-[0.5px] border-outline pt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-2 text-primary disabled:text-outline-variant font-mono text-xs uppercase tracking-widest font-semibold hover:text-secondary disabled:hover:text-outline-variant transition-colors cursor-pointer select-none"
            id="pagination-prev"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous Set
          </button>
          
          <div className="font-sans text-xs text-on-surface-variant">
            Displaying {(currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, filteredFrameworks.length)} of {filteredFrameworks.length} records
          </div>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 text-primary disabled:text-outline-variant font-mono text-xs uppercase tracking-widest font-semibold hover:text-secondary disabled:hover:text-outline-variant transition-colors cursor-pointer select-none"
            id="pagination-next"
          >
            Next Set
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </section>
    </div>
  );
}

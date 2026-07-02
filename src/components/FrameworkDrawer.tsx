/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { EnvironmentalFramework } from '../types';
import { X, Download, Calendar, Database, MapPin, Layers, Check, Loader2 } from 'lucide-react';

interface FrameworkDrawerProps {
  framework: EnvironmentalFramework;
  onClose: () => void;
}

export default function FrameworkDrawer({ framework, onClose }: FrameworkDrawerProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloadFinished, setDownloadFinished] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    setDownloadFinished(false);

    setTimeout(() => {
      setDownloading(false);
      setDownloadFinished(true);

      // Generate actual CSV content from sampleData!
      if (framework.sampleData && framework.sampleData.length > 0) {
        const headers = Object.keys(framework.sampleData[0]);
        const csvRows = [
          headers.join(','), // Header row
          ...framework.sampleData.map((row) =>
            headers
              .map((fieldName) => {
                const val = row[fieldName];
                return typeof val === 'string' && val.includes(',') ? `"${val}"` : val;
              })
              .join(',')
          ),
        ];
        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${framework.id.toLowerCase().replace(/-/g, '_')}_dataset_sample.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        // Fallback simple download
        const fallbackContent = `ID,Title,Discipline,Domain,Format,Size\n${framework.id},"${framework.title}","${framework.discipline}","${framework.domain}",${framework.format},${framework.size}`;
        const blob = new Blob([fallbackContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${framework.id.toLowerCase().replace(/-/g, '_')}_spec.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }, 1200);
  };

  const statusColors = {
    Verified: 'bg-primary-fixed text-on-primary-fixed border border-primary/10',
    Archived: 'bg-surface-variant text-on-surface-variant border border-outline-variant',
    Standard: 'bg-secondary-container/30 text-on-secondary-container border border-secondary/15',
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-fade-in">
      {/* Backdrop area click closes drawer */}
      <div className="flex-grow cursor-pointer" onClick={onClose} />

      {/* Main Drawer Panel */}
      <div className="w-full max-w-[550px] bg-surface h-full shadow-2xl border-l-[0.5px] border-outline-variant flex flex-col justify-between overflow-y-auto animate-slide-left p-6 md:p-8">
        
        {/* Header Section */}
        <div>
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-secondary border-[0.5px] border-secondary px-2 py-0.5 font-bold">
                {framework.id}
              </span>
              <span className={`font-mono text-[11px] px-2 py-0.5 font-semibold ${statusColors[framework.status]}`}>
                {framework.status}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded transition-colors cursor-pointer"
              id="drawer-close-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h2 className="font-serif text-2xl md:text-3xl text-primary font-bold leading-tight mb-4">
            {framework.title}
          </h2>

          <p className="font-sans text-sm text-on-surface-variant leading-relaxed mb-6 pb-6 border-b-[0.5px] border-outline-variant">
            {framework.description}
          </p>

          {/* Metadata Section */}
          <h3 className="font-mono text-xs uppercase tracking-widest text-outline mb-4 font-bold">
            Resource Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="flex gap-3 items-center text-xs">
              <Layers className="w-4 h-4 text-secondary flex-shrink-0" />
              <div>
                <p className="font-mono text-outline uppercase text-[10px]">Topic Tag</p>
                <p className="font-sans text-on-surface font-semibold">{framework.discipline}</p>
              </div>
            </div>
            <div className="flex gap-3 items-center text-xs">
              <Database className="w-4 h-4 text-secondary flex-shrink-0" />
              <div>
                <p className="font-mono text-outline uppercase text-[10px]">Resource Type</p>
                <p className="font-sans text-on-surface font-semibold">{framework.domain}</p>
              </div>
            </div>
            <div className="flex gap-3 items-center text-xs">
              <Calendar className="w-4 h-4 text-secondary flex-shrink-0" />
              <div>
                <p className="font-mono text-outline uppercase text-[10px]">Update Interval</p>
                <p className="font-sans text-on-surface font-semibold">{framework.frequency}</p>
              </div>
            </div>
            <div className="flex gap-3 items-center text-xs">
              <MapPin className="w-4 h-4 text-secondary flex-shrink-0" />
              <div>
                <p className="font-mono text-outline uppercase text-[10px]">Geographic Bounds</p>
                <p className="font-sans text-on-surface font-semibold">{framework.coverage}</p>
              </div>
            </div>
          </div>

          {/* Sample Data Preview Table */}
          {framework.sampleData && framework.sampleData.length > 0 && (
            <div className="mb-8">
              <h3 className="font-mono text-xs uppercase tracking-widest text-outline mb-3 font-bold">
                Verified Sample Data Preview
              </h3>
              <div className="border-[0.5px] border-outline-variant rounded-xs overflow-x-auto bg-surface-container-lowest">
                <table className="w-full text-left font-sans text-xs border-collapse">
                  <thead>
                    <tr className="bg-surface-container border-b-[0.5px] border-outline-variant text-[10px] uppercase font-mono tracking-wider text-outline">
                      {Object.keys(framework.sampleData[0]).map((header) => (
                        <th key={header} className="p-2 border-r-[0.5px] border-outline-variant last:border-r-0">
                          {header.replace(/_/g, ' ')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {framework.sampleData.map((row, index) => (
                      <tr key={index} className="border-b-[0.5px] border-outline-variant last:border-b-0 hover:bg-surface-container-low">
                        {Object.values(row).map((val, cellIdx) => (
                          <td key={cellIdx} className="p-2 font-mono text-[11px] border-r-[0.5px] border-outline-variant last:border-r-0 text-on-surface-variant">
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Action Button & Footer */}
        <div className="pt-6 border-t-[0.5px] border-outline-variant">
          <div className="flex items-center justify-between gap-4 mb-4 text-xs font-mono">
            <div className="text-outline">File Format: <span className="font-bold text-primary">{framework.format}</span></div>
            <div className="text-outline">Payload Size: <span className="font-bold text-primary">{framework.size}</span></div>
          </div>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full py-3 bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-3 rounded-[2px] transition-colors cursor-pointer disabled:opacity-60"
            id="drawer-download-btn"
          >
            {downloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Synchronizing Binary Streams...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download Verified Sample (.CSV)
              </>
            )}
          </button>

          {downloadFinished && (
            <div className="mt-3 p-3 bg-primary-fixed text-on-primary-fixed border border-primary/10 rounded-sm text-xs font-sans text-center flex items-center justify-center gap-2 animate-fade-in">
              <Check className="w-4 h-4 text-primary" />
              <span>Full sample matrix successfully exported!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

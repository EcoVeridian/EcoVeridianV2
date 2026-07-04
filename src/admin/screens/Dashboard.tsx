/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from 'react-router-dom';
import { DatabaseBackup, ArrowRight } from 'lucide-react';
import { useAuth } from '../AuthContext';

export default function Dashboard() {
  const { admin } = useAuth();

  return (
    <div className="animate-fade-in">
      <header className="mb-8 border-b-[0.5px] border-outline-variant pb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-secondary font-bold mb-2">
          Dashboard
        </p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary">
          Welcome{admin ? `, ${admin.displayName}` : ''}
        </h1>
        <p className="font-sans text-sm text-on-surface-variant mt-2 leading-relaxed max-w-xl">
          This panel controls the EcoVeridian site. Content editors (articles, resources, pages,
          settings) are being rolled out phase by phase — new sections appear in the sidebar as they
          land.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
        <Link
          to="/admin/import"
          className="border-[0.5px] border-outline-variant bg-surface-container-low p-6 rounded-[2px] hover:border-primary/40 transition-colors group"
        >
          <DatabaseBackup className="w-7 h-7 text-secondary mb-4 stroke-[1.5]" />
          <h2 className="font-serif text-lg font-bold text-primary mb-1 group-hover:text-secondary transition-colors">
            Import Defaults
          </h2>
          <p className="font-sans text-xs text-on-surface-variant leading-relaxed mb-3">
            Seed Firestore with the site's current built-in content: articles, resources, team,
            taxonomies, pages, and settings.
          </p>
          <span className="font-mono text-[10px] uppercase tracking-wider text-secondary font-bold flex items-center gap-1">
            Open <ArrowRight className="w-3 h-3" />
          </span>
        </Link>
      </div>
    </div>
  );
}

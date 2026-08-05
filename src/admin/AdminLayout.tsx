/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { NavLink, Link, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  DatabaseBackup,
  LogOut,
  ExternalLink,
  Menu,
  X,
  FileText,
  Library,
  Tags,
  PanelsTopLeft,
  Inbox,
  FolderOpen,
  Settings,
  Palette,
  Image,
  Users,
  UsersRound,
  ShieldCheck,
} from 'lucide-react';
import { PermissionKey } from '../types';
import { useAuth } from './AuthContext';
import { useUnreadInquiries } from './lib/useUnreadInquiries';
import { useUnreadSubmissions } from './lib/useUnreadSubmissions';

// Items with a perm are hidden from roles lacking it (rules enforce the same
// permission server-side — hiding is just UX).
const NAV_ITEMS: Array<{
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  end: boolean;
  perm?: PermissionKey;
}> = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/articles', label: 'Articles', icon: FileText, end: false, perm: 'articles' },
  { to: '/admin/resources', label: 'Resources', icon: Library, end: false, perm: 'resources' },
  { to: '/admin/team', label: 'Team', icon: UsersRound, end: false, perm: 'team' },
  { to: '/admin/pages', label: 'Pages', icon: PanelsTopLeft, end: false, perm: 'pages' },
  { to: '/admin/taxonomies', label: 'Taxonomies', icon: Tags, end: false, perm: 'taxonomies' },
  { to: '/admin/inquiries', label: 'Inquiries', icon: Inbox, end: false, perm: 'inquiries' },
  { to: '/admin/submissions', label: 'Submissions', icon: FolderOpen, end: false, perm: 'submissions' },
  { to: '/admin/media', label: 'Media', icon: Image, end: false, perm: 'media' },
  { to: '/admin/settings', label: 'Site Settings', icon: Settings, end: false, perm: 'settings' },
  { to: '/admin/theme', label: 'Theme', icon: Palette, end: false, perm: 'settings' },
  { to: '/admin/users', label: 'Admin Users', icon: Users, end: false, perm: 'users' },
  { to: '/admin/roles', label: 'Roles', icon: ShieldCheck, end: false, perm: 'users' },
  { to: '/admin/import', label: 'Import Defaults', icon: DatabaseBackup, end: false, perm: 'users' },
];

export default function AdminLayout() {
  const { admin, can, signOutUser } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const unreadCount = useUnreadInquiries();
  const unreadSubmissionsCount = useUnreadSubmissions();
  const visibleItems = NAV_ITEMS.filter((item) => !item.perm || can(item.perm));

  const navLinks = (
    <nav className="flex flex-col gap-1">
      {visibleItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setMobileNavOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-[2px] font-sans text-sm transition-colors ${
                isActive
                  ? 'bg-primary text-on-primary font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
              }`
            }
          >
            <Icon className="w-4 h-4 stroke-[1.5]" />
            {item.label}
            {item.to === '/admin/inquiries' && unreadCount > 0 && (
              <span className="bg-secondary text-on-secondary rounded-full px-1.5 text-[10px] font-bold ml-auto">
                {unreadCount}
              </span>
            )}
            {item.to === '/admin/submissions' && unreadSubmissionsCount > 0 && (
              <span className="bg-secondary text-on-secondary rounded-full px-1.5 text-[10px] font-bold ml-auto">
                {unreadSubmissionsCount}
              </span>
            )}
          </NavLink>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-surface text-on-surface font-sans flex flex-col">
      {/* Topbar */}
      <header className="w-full bg-surface border-b-[0.5px] border-outline-variant sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 md:px-6 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="md:hidden p-1 text-primary cursor-pointer"
              aria-label="Toggle admin menu"
            >
              {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link to="/admin" className="flex items-center gap-2.5">
              <img src="/favicon.svg" alt="" className="w-7 h-7" />
              <span className="font-serif italic text-xl text-primary font-bold">EcoVeridian</span>
              <span className="font-mono text-[10px] uppercase tracking-widest bg-secondary-container/40 text-on-secondary-container border-[0.5px] border-secondary/30 px-2 py-0.5 rounded-sm font-bold">
                Admin
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors"
            >
              View Site
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            {admin && (
              <span className="hidden sm:flex items-center gap-2 font-sans text-xs text-on-surface-variant">
                {admin.email}
                <span className="font-mono text-[10px] uppercase tracking-wider border-[0.5px] border-outline px-1.5 py-0.5 rounded-sm">
                  {admin.role}
                </span>
              </span>
            )}
            <button
              onClick={() => signOutUser()}
              className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-on-surface-variant hover:text-error transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Mobile nav drawer */}
        {mobileNavOpen && (
          <div className="md:hidden border-t-[0.5px] border-outline-variant bg-surface px-4 py-3">
            {navLinks}
          </div>
        )}
      </header>

      <div className="flex flex-grow">
        {/* Sidebar (desktop) */}
        <aside className="hidden md:block w-56 border-r-[0.5px] border-outline-variant bg-surface-container-low p-4 flex-shrink-0">
          {navLinks}
        </aside>

        {/* Content */}
        <main className="flex-grow p-4 md:p-8 max-w-[1100px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense, useEffect, useRef } from 'react';
import { Routes, Route, Link, Navigate, useNavigate, useParams, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import EditorialView from './components/EditorialView';
import ArticleReader from './components/ArticleReader';
import MasterIndexView from './components/MasterIndexView';
import FrameworkDrawer from './components/FrameworkDrawer';
import SubmissionView from './components/SubmissionView';
import InstitutionalAccessView from './components/InstitutionalAccessView';
import TeamView from './components/TeamView';
import AboutView from './components/AboutView';

import { ContentProvider, useArticles, useFrameworks, useSiteSettings } from './content/ContentContext';
import { useMeta } from './lib/useMeta';

// The admin panel (auth + full Firestore SDK) is its own chunk so public
// visitors never download it.
const AdminApp = lazy(() => import('./admin/AdminApp'));

/**
 * Scroll to top on route change, except when moving within /resources
 * (opening/closing the framework drawer overlays the same list).
 */
function ScrollToTop() {
  const { pathname } = useLocation();
  const prevPathname = useRef(pathname);
  useEffect(() => {
    const withinResources =
      prevPathname.current.startsWith('/resources') && pathname.startsWith('/resources');
    if (!withinResources) window.scrollTo(0, 0);
    prevPathname.current = pathname;
  }, [pathname]);
  return null;
}

function HomeRoute() {
  const { seo } = useSiteSettings();
  useMeta(seo.title, seo.description);
  return <EditorialView />;
}

/** Site-wide banner, managed from admin Site Settings. */
function AnnouncementBanner() {
  const { announcement } = useSiteSettings();
  if (!announcement.enabled || !announcement.text) return null;
  const isInternalLink = announcement.linkUrl.startsWith('/');
  const linkLabel = announcement.linkLabel || 'Learn more';
  return (
    <div className="w-full bg-primary text-on-primary">
      <div className="max-w-[1280px] mx-auto px-5 md:px-16 py-2.5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center">
        <span className="font-sans text-xs md:text-sm">{announcement.text}</span>
        {announcement.linkUrl &&
          (isInternalLink ? (
            <Link
              to={announcement.linkUrl}
              className="font-mono text-[11px] uppercase tracking-wider underline hover:opacity-80 transition-opacity"
            >
              {linkLabel}
            </Link>
          ) : (
            <a
              href={announcement.linkUrl}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-[11px] uppercase tracking-wider underline hover:opacity-80 transition-opacity"
            >
              {linkLabel}
            </a>
          ))}
      </div>
    </div>
  );
}

function ArticleRoute() {
  const navigate = useNavigate();
  const { articleId } = useParams();
  const articles = useArticles();
  const article = articles.find((a) => a.slug === articleId);
  useMeta(article && `${article.title} · EcoVeridian`, article?.excerpt);
  if (!article) return <Navigate to="/" replace />;
  return <ArticleReader article={article} onClose={() => navigate('/')} />;
}

function ResourcesRoute() {
  const navigate = useNavigate();
  const { frameworkId } = useParams();
  const frameworks = useFrameworks();
  const framework = frameworks.find((f) => f.slug === frameworkId) ?? null;
  useMeta(
    'Resource Hub · EcoVeridian',
    'Browse verified research outputs, dataset summaries, and reproducible methods from EcoVeridian.',
  );
  return (
    <>
      <MasterIndexView />
      {framework && <FrameworkDrawer framework={framework} onClose={() => navigate('/resources')} />}
    </>
  );
}

function PartnerRoute() {
  useMeta(
    'Partner With Us · EcoVeridian',
    'Reach out to the EcoVeridian team for research collaborations, forecasting requests, and general inquiries.',
  );
  return <SubmissionView />;
}

function CollaborateRoute() {
  useMeta(
    'Ways to Work With Us · EcoVeridian',
    'Free collaboration and research support at different levels of depth, from quick consultations to full research partnerships.',
  );
  return <InstitutionalAccessView />;
}

function TeamRoute() {
  useMeta('Team · EcoVeridian', 'Meet the student research team behind EcoVeridian.');
  return <TeamView />;
}

function AboutRoute() {
  useMeta(
    'About Us · EcoVeridian',
    'What EcoVeridian is for: practical, decision-ready environmental research from a student-led team.',
  );
  return <AboutView />;
}

function PublicShell() {
  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col font-sans selection:bg-primary-container selection:text-on-primary-container transition-all duration-300">
      <AnnouncementBanner />

      {/* Top Header navbar navigation */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/articles/:articleId" element={<ArticleRoute />} />
          <Route path="/resources/:frameworkId?" element={<ResourcesRoute />} />
          <Route path="/partner" element={<PartnerRoute />} />
          <Route path="/collaborate" element={<CollaborateRoute />} />
          <Route path="/team" element={<TeamRoute />} />
          <Route path="/about" element={<AboutRoute />} />
          <Route path="/research" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer component */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ContentProvider>
      <ScrollToTop />
      <Routes>
        <Route
          path="/admin/*"
          element={
            <Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center bg-surface">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              }
            >
              <AdminApp />
            </Suspense>
          }
        />
        <Route path="*" element={<PublicShell />} />
      </Routes>
    </ContentProvider>
  );
}

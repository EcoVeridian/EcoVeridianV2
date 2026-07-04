/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import RequireAdmin from './RequireAdmin';
import RequirePermission from './RequirePermission';
import AdminLayout from './AdminLayout';
import Login from './screens/Login';
import Dashboard from './screens/Dashboard';
import ImportDefaults from './screens/ImportDefaults';
import ArticlesList from './screens/articles/ArticlesList';
import ArticleEdit from './screens/articles/ArticleEdit';
import FrameworksList from './screens/frameworks/FrameworksList';
import FrameworkEdit from './screens/frameworks/FrameworkEdit';
import TeamList from './screens/team/TeamList';
import TeamEdit from './screens/team/TeamEdit';
import Taxonomies from './screens/settings/Taxonomies';
import PagesIndex from './screens/pages/PagesIndex';
import HomeEdit from './screens/pages/HomeEdit';
import AboutEdit from './screens/pages/AboutEdit';
import InstitutionalEdit from './screens/pages/InstitutionalEdit';
import PartnerEdit from './screens/pages/PartnerEdit';
import SiteSettings from './screens/settings/SiteSettings';
import ThemeSettings from './screens/settings/ThemeSettings';
import Inbox from './screens/inquiries/Inbox';
import MediaLibrary from './screens/media/MediaLibrary';
import AdminUsers from './screens/users/AdminUsers';
import Roles from './screens/users/Roles';

export default function AdminApp() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route element={<RequireAdmin />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="articles" element={<RequirePermission perm="articles"><ArticlesList /></RequirePermission>} />
            <Route path="articles/:slug" element={<RequirePermission perm="articles"><ArticleEdit /></RequirePermission>} />
            <Route path="resources" element={<RequirePermission perm="resources"><FrameworksList /></RequirePermission>} />
            <Route path="resources/:slug" element={<RequirePermission perm="resources"><FrameworkEdit /></RequirePermission>} />
            <Route path="team" element={<RequirePermission perm="team"><TeamList /></RequirePermission>} />
            <Route path="team/:slug" element={<RequirePermission perm="team"><TeamEdit /></RequirePermission>} />
            <Route path="taxonomies" element={<RequirePermission perm="taxonomies"><Taxonomies /></RequirePermission>} />
            <Route path="pages" element={<RequirePermission perm="pages"><PagesIndex /></RequirePermission>} />
            <Route path="pages/home" element={<RequirePermission perm="pages"><HomeEdit /></RequirePermission>} />
            <Route path="pages/about" element={<RequirePermission perm="pages"><AboutEdit /></RequirePermission>} />
            <Route path="pages/collaborate" element={<RequirePermission perm="pages"><InstitutionalEdit /></RequirePermission>} />
            <Route path="pages/partner" element={<RequirePermission perm="pages"><PartnerEdit /></RequirePermission>} />
            <Route path="settings" element={<RequirePermission perm="settings"><SiteSettings /></RequirePermission>} />
            <Route path="theme" element={<RequirePermission perm="settings"><ThemeSettings /></RequirePermission>} />
            <Route path="inquiries" element={<RequirePermission perm="inquiries"><Inbox /></RequirePermission>} />
            <Route path="media" element={<RequirePermission perm="media"><MediaLibrary /></RequirePermission>} />
            {/* AdminUsers renders read-only without the users permission. */}
            <Route path="users" element={<AdminUsers />} />
            <Route path="roles" element={<RequirePermission perm="users"><Roles /></RequirePermission>} />
            <Route path="import" element={<RequirePermission perm="users"><ImportDefaults /></RequirePermission>} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AuthProvider>
  );
}

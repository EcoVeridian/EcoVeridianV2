/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Icon allowlist for CMS-managed content (About pillars, collaboration
 * tiers). Components can't live in Firestore, so docs store one of these
 * names and the UI resolves it here. The admin icon picker offers this list.
 */

import {
  Target,
  Database,
  BarChart3,
  Users,
  Landmark,
  Award,
  Sprout,
  BookOpenCheck,
  Leaf,
  Globe,
  LineChart,
  Microscope,
  Map,
  Handshake,
  Lightbulb,
  ShieldCheck,
  LucideIcon,
} from 'lucide-react';

export const ICON_MAP: Record<string, LucideIcon> = {
  target: Target,
  database: Database,
  'bar-chart-3': BarChart3,
  users: Users,
  landmark: Landmark,
  award: Award,
  sprout: Sprout,
  'book-open-check': BookOpenCheck,
  leaf: Leaf,
  globe: Globe,
  'line-chart': LineChart,
  microscope: Microscope,
  map: Map,
  handshake: Handshake,
  lightbulb: Lightbulb,
  'shield-check': ShieldCheck,
};

export function iconFor(name: string): LucideIcon {
  return ICON_MAP[name] ?? Target;
}

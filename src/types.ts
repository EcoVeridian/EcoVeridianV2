/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface EnvironmentalFramework {
  id: string;
  title: string;
  discipline: 'Ecology & Conservation' | 'Climatology Models' | 'Hydrological Systems' | 'Soil Biogeochemistry';
  domain: 'Terrestrial' | 'Marine / Oceanic' | 'Atmospheric';
  format: string;
  size: string;
  lastUpdated: string;
  status: 'Verified' | 'Archived' | 'Standard';
  description: string;
  coverage: string;
  frequency: string;
  sampleData?: Array<Record<string, string | number>>;
}

export interface ScholarlyArticle {
  id: string;
  title: string;
  category: 'Thesis' | 'Methodology' | 'Field Notes' | 'Special Report';
  author: string;
  readTime: string;
  excerpt: string;
  image: string;
  figureCaption?: string;
  abstract: string;
  introduction: string;
  methodologyText: string;
  analysisText: string;
  references: string[];
}

export interface InquiryFormState {
  investigatorName: string;
  institution: string;
  returnRelay: string;
  classification: string;
  dossier: string;
}

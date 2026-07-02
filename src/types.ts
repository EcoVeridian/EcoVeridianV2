/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface EnvironmentalFramework {
  id: string;
  title: string;
  discipline: 'Tourism Forecasting' | 'Environmental Data Analysis' | 'Sustainability Metrics' | 'Machine Learning Models' | 'Engineering Design Challenge';
  domain: 'Written Report' | 'Dataset Summary' | 'Code / Notebook';
  format: string;
  size: string;
  lastUpdated: string;
  status: 'Verified' | 'Archived' | 'Standard';
  description: string;
  coverage: string;
  frequency: string;
  sampleData?: Array<Record<string, string | number>>;
  reportContent?: Array<{ heading: string; body: string }>;
  fileUrl?: string;
}

export interface ScholarlyArticle {
  id: string;
  title: string;
  category: 'Flagship Project' | 'Case Study' | 'Methodology' | 'Team Update';
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

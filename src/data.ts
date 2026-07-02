/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EnvironmentalFramework, ScholarlyArticle } from './types';

export const ENVIRONMENTAL_FRAMEWORKS: EnvironmentalFramework[] = [
  {
    id: 'EV-TOUR-2026-01',
    title: 'Yellowstone & North Cascades Visitation Forecast (2026)',
    discipline: 'Tourism Forecasting',
    domain: 'Written Report',
    format: 'PDF',
    size: '6.8 MB',
    lastUpdated: '2026-06-21',
    status: 'Verified',
    description: 'Flagship TSA Nationals project combining time-series forecasting and machine learning to estimate monthly visitation patterns for Yellowstone and North Cascades.',
    coverage: 'Yellowstone NP + North Cascades NP',
    frequency: 'Monthly forecast horizon',
    sampleData: [
      { Park: 'Yellowstone', Month: 'Jun 2026', Forecast_Visits: 976200, Model_MAE_pct: 6.2 },
      { Park: 'Yellowstone', Month: 'Jul 2026', Forecast_Visits: 1041300, Model_MAE_pct: 6.2 },
      { Park: 'North Cascades', Month: 'Jun 2026', Forecast_Visits: 49400, Model_MAE_pct: 8.1 },
      { Park: 'North Cascades', Month: 'Jul 2026', Forecast_Visits: 56200, Model_MAE_pct: 8.1 }
    ]
  },
  {
    id: 'EV-DATA-2026-02',
    title: 'National Parks Dataset Summary & Feature Dictionary',
    discipline: 'Environmental Data Analysis',
    domain: 'Dataset Summary',
    format: 'CSV/Markdown',
    size: '2.1 MB',
    lastUpdated: '2026-06-18',
    status: 'Standard',
    description: 'Clean reference index of source datasets, feature engineering notes, and variable definitions used in our park forecasting pipeline.',
    coverage: 'Public NPS and weather-linked datasets',
    frequency: 'Updated per release',
    sampleData: [
      { Field: 'visitation_count', Type: 'integer', Source: 'NPS Stats', Notes: 'Target variable' },
      { Field: 'avg_temp_f', Type: 'float', Source: 'NOAA', Notes: 'Monthly aggregate' },
      { Field: 'holiday_index', Type: 'float', Source: 'Derived', Notes: 'Demand seasonality signal' },
      { Field: 'wildfire_smoke_days', Type: 'integer', Source: 'EPA', Notes: 'Exogenous predictor' }
    ]
  },
  {
    id: 'EV-ML-2026-03',
    title: 'Forecasting Pipeline Notebook (Replicable Methods)',
    discipline: 'Machine Learning Models',
    domain: 'Code / Notebook',
    format: 'Jupyter / Python',
    size: '1.4 MB',
    lastUpdated: '2026-06-20',
    status: 'Verified',
    description: 'Step-by-step notebook that reproduces baseline and advanced forecasting runs, including validation strategy and error analysis.',
    coverage: 'Modeling workflow',
    frequency: 'Versioned releases',
    sampleData: [
      { Step: 'Feature prep', Tool: 'pandas', Runtime_min: 4.5, Output: 'model_ready_table' },
      { Step: 'Cross validation', Tool: 'scikit-learn', Runtime_min: 9.2, Output: 'cv_metrics' },
      { Step: 'Model fit', Tool: 'xgboost', Runtime_min: 3.7, Output: 'fitted_model' },
      { Step: 'Forecast export', Tool: 'python', Runtime_min: 1.2, Output: '2026_projection.csv' }
    ]
  },
  {
    id: 'EV-METRICS-2026-04',
    title: 'Sustainability Impact Metrics Brief',
    discipline: 'Sustainability Metrics',
    domain: 'Written Report',
    format: 'PDF',
    size: '3.2 MB',
    lastUpdated: '2026-06-16',
    status: 'Standard',
    description: 'Concise brief connecting forecast outputs to practical decisions on staffing, infrastructure load, and seasonal resource planning.',
    coverage: 'Gateway communities and park operations',
    frequency: 'Quarterly',
    sampleData: [
      { Audience: 'Park planning teams', Benefit: 'Seasonal staffing signal', Typical_Lead_Weeks: 2, Confidence: 'High' },
      { Audience: 'Gateway communities', Benefit: 'Tourism readiness planning', Typical_Lead_Weeks: 3, Confidence: 'High' },
      { Audience: 'Nonprofits', Benefit: 'Grant and outreach timing', Typical_Lead_Weeks: 4, Confidence: 'Medium' }
    ]
  }
];

export const SCHOLARLY_ARTICLES: ScholarlyArticle[] = [
  {
    id: 'ART-001',
    title: 'Yellowstone & North Cascades Visitation Forecast (2026)',
    category: 'Flagship Project',
    author: 'Risith and Santhosh',
    readTime: '8 min',
    excerpt: 'Our TSA Nationals-qualifying project forecasts park visitation using time-series modeling and machine learning so organizations can plan staffing and resources earlier.',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=1600',
    figureCaption: 'Fig. 1 - Forecast dashboard preview showing visitation trend windows and uncertainty intervals.',
    abstract: 'This project predicts visitation for Yellowstone and North Cascades on a monthly horizon. We built and evaluated models using historical park counts plus weather and seasonal features, then translated results into planning-ready outputs.',
    introduction: 'EcoVeridian began as a sustainability-focused software project and evolved after our team placed first at Washington TSA and qualified for Nationals in Data Science and Analytics. The forecasting work now serves as a practical offering for organizations that need data-informed tourism planning.',
    methodologyText: 'We aggregated park visitation, weather, and calendar effects; cleaned outliers; then benchmarked baseline regressors against boosted tree models. Validation used rolling windows to avoid leakage and preserve real forecasting conditions.',
    analysisText: 'The final model captured seasonality and major trend shifts well enough to support operational planning. We package outputs as clear forecasts, confidence bands, and short implementation notes for non-technical partners.',
    references: [
      'National Park Service visitation datasets (public records).',
      'NOAA monthly weather summaries used for exogenous predictors.',
      'EcoVeridian internal validation protocol, 2026 release 1.'
    ]
  },
  {
    id: 'ART-002',
    title: 'Our Methodology in Plain Language',
    category: 'Methodology',
    author: 'Risith and Santhosh',
    readTime: '6 min',
    excerpt: 'How we collect, clean, model, and validate data so partners can trust what they are seeing.',
    image: 'https://images.unsplash.com/photo-1551281044-8b7ef7f2d3f5?auto=format&fit=crop&q=80&w=1600',
    figureCaption: 'Fig. 2 - Workflow summary from raw data to partner-ready findings.',
    abstract: 'This explainer outlines our process from problem framing through model evaluation and delivery.',
    introduction: 'We focus on transparent modeling choices and clear reporting, prioritizing usefulness over unnecessary complexity.',
    methodologyText: 'Each project starts with a scoping call, then a data audit, feature design, model baselines, and validation. We track assumptions and document tradeoffs so recommendations remain interpretable.',
    analysisText: 'Our outputs include both technical details and plain-language summaries so organizations can decide quickly without losing confidence in the underlying work.',
    references: [
      'EcoVeridian methods checklist v1.2.',
      'Scikit-learn model evaluation documentation.',
      'Forecasting best-practice notes from TSA project prep.'
    ]
  },
  {
    id: 'ART-003',
    title: 'Team Updates and Current Workstream',
    category: 'Team Update',
    author: 'EcoVeridian Team',
    readTime: '4 min',
    excerpt: 'Where we are now: current models, outreach progress, and what we are building next.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1600',
    abstract: 'A quick update page for collaborators and mentors following our progress.',
    introduction: 'We are expanding EcoVeridian from a project into a student-led research hub while keeping our approach practical and partner-focused.',
    methodologyText: 'Current work includes improving forecast uncertainty reporting, refining visual dashboards, and preparing a cleaner public technical packet.',
    analysisText: 'Early collaborator feedback has pushed us toward shorter deliverables, clearer assumptions, and stronger update cadence.',
    references: [
      'EcoVeridian team log, Summer 2026.',
      'Partner discovery notes.',
      'Internal release checklist.'
    ]
  },
  {
    id: 'ART-004',
    title: 'Additional Case Study: Seasonal Demand Signals',
    category: 'Case Study',
    author: 'Risith and Santhosh',
    readTime: '5 min',
    excerpt: 'A focused case showing how exogenous signals improved forecast reliability during peak months.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1600',
    abstract: 'A compact case study showing forecast lift from adding external data sources.',
    introduction: 'Peak-season forecasting can break when models rely only on historical counts. We tested whether external variables stabilized those peaks.',
    methodologyText: 'We compared baseline models against variants including weather and holiday-derived features using rolling validation windows.',
    analysisText: 'External features reduced peak-month error and produced more stable upper-bound estimates, which is useful for conservative staffing plans.',
    references: [
      'Internal backtesting log for feature set comparisons.',
      'Model card notes for release 2026.1.',
      'Forecast quality review checklist.'
    ]
  }
];

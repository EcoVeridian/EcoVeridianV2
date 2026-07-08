/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Bundled seed content, shaped exactly like the Firestore documents.
 *
 * Two jobs:
 *  1. The admin "Import Defaults" screen writes these into Firestore.
 *  2. The public site falls back to them when Firestore is unreachable or
 *     not yet seeded, so the site never renders blank.
 */

import {
  ArticleDoc,
  FrameworkDoc,
  TeamMemberDoc,
  TaxonomyDoc,
  PageHomeDoc,
  PageAboutDoc,
  PageInstitutionalDoc,
  PagePartnerDoc,
  SiteSettingsDoc,
  ThemeSettingsDoc,
  RoleDoc,
} from '../types';

export const SEED_ARTICLES: ArticleDoc[] = [
  {
    slug: 'ART-001',
    title: 'Yellowstone & North Cascades Visitation Forecast (2026)',
    category: 'Flagship Project',
    author: 'Risith and Santhosh',
    readTime: '8 min',
    publishedDate: 'June 2026',
    excerpt: 'Our TSA Nationals-qualifying project forecasts park visitation using time-series modeling and machine learning so organizations can plan staffing and resources earlier.',
    imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=1600',
    imagePath: '',
    figureCaption: 'Fig. 1 - Forecast dashboard preview showing visitation trend windows and uncertainty intervals.',
    abstract: 'This project predicts visitation for Yellowstone and North Cascades on a monthly horizon. We built and evaluated models using historical park counts plus weather and seasonal features, then translated results into planning-ready outputs.',
    introduction: 'EcoVeridian began as a sustainability-focused software project and evolved after our team placed first at Washington TSA and qualified for Nationals in Data Science and Analytics. The forecasting work now serves as a practical offering for organizations that need data-informed tourism planning.',
    methodologyText: 'We aggregated park visitation, weather, and calendar effects; cleaned outliers; then benchmarked baseline regressors against boosted tree models. Validation used rolling windows to avoid leakage and preserve real forecasting conditions.',
    analysisText: 'The final model captured seasonality and major trend shifts well enough to support operational planning. We package outputs as clear forecasts, confidence bands, and short implementation notes for non-technical partners.',
    references: [
      'National Park Service visitation datasets (public records).',
      'NOAA monthly weather summaries used for exogenous predictors.',
      'EcoVeridian internal validation protocol, 2026 release 1.',
    ],
    linkedResourceSlug: 'EV-TOUR-2026-01',
    publishStatus: 'published',
    order: 0,
  },
  {
    slug: 'ART-002',
    title: 'Our Methodology in Plain Language',
    category: 'Methodology',
    author: 'Risith and Santhosh',
    readTime: '6 min',
    publishedDate: 'June 2026',
    excerpt: 'How we collect, clean, model, and validate data so partners can trust what they are seeing.',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1600',
    imagePath: '',
    figureCaption: 'Fig. 2 - Workflow summary from raw data to partner-ready findings.',
    abstract: 'This explainer outlines our process from problem framing through model evaluation and delivery.',
    introduction: 'We focus on transparent modeling choices and clear reporting, prioritizing usefulness over unnecessary complexity.',
    methodologyText: 'Each project starts with a scoping call, then a data audit, feature design, model baselines, and validation. We track assumptions and document tradeoffs so recommendations remain interpretable.',
    analysisText: 'Our outputs include both technical details and plain-language summaries so organizations can decide quickly without losing confidence in the underlying work.',
    references: [
      'EcoVeridian methods checklist v1.2.',
      'Scikit-learn model evaluation documentation.',
      'Forecasting best-practice notes from TSA project prep.',
    ],
    linkedResourceSlug: '',
    publishStatus: 'published',
    order: 1,
  },
  {
    slug: 'ART-003',
    title: 'Team Updates and Current Workstream',
    category: 'Team Update',
    author: 'EcoVeridian Team',
    readTime: '4 min',
    publishedDate: 'July 2026',
    excerpt: 'Where we are now: current models, outreach progress, and what we are building next.',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1600',
    imagePath: '',
    figureCaption: '',
    abstract: 'A quick update page for collaborators and mentors following our progress.',
    introduction: 'We are expanding EcoVeridian from a project into a student-led research hub while keeping our approach practical and partner-focused.',
    methodologyText: 'Current work includes improving forecast uncertainty reporting, refining visual dashboards, and preparing a cleaner public technical packet.',
    analysisText: 'Early collaborator feedback has pushed us toward shorter deliverables, clearer assumptions, and stronger update cadence.',
    references: [
      'EcoVeridian team log, Summer 2026.',
      'Partner discovery notes.',
      'Internal release checklist.',
    ],
    linkedResourceSlug: '',
    publishStatus: 'published',
    order: 2,
  },
  {
    slug: 'ART-004',
    title: 'Additional Case Study: Seasonal Demand Signals',
    category: 'Case Study',
    author: 'Risith and Santhosh',
    readTime: '5 min',
    publishedDate: 'May 2026',
    excerpt: 'A focused case showing how exogenous signals improved forecast reliability during peak months.',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1600',
    imagePath: '',
    figureCaption: '',
    abstract: 'A compact case study showing forecast lift from adding external data sources.',
    introduction: 'Peak-season forecasting can break when models rely only on historical counts. We tested whether external variables stabilized those peaks.',
    methodologyText: 'We compared baseline models against variants including weather and holiday-derived features using rolling validation windows.',
    analysisText: 'External features reduced peak-month error and produced more stable upper-bound estimates, which is useful for conservative staffing plans.',
    references: [
      'Internal backtesting log for feature set comparisons.',
      'Model card notes for release 2026.1.',
      'Forecast quality review checklist.',
    ],
    linkedResourceSlug: '',
    publishStatus: 'published',
    order: 3,
  },
];

export const SEED_FRAMEWORKS: FrameworkDoc[] = [
  {
    slug: 'EV-TOUR-2026-01',
    title: 'Yellowstone & North Cascades Visitation Forecast (2026)',
    discipline: 'Tourism Forecasting',
    domain: 'Written Report',
    format: 'PDF',
    size: '6.8 MB',
    lastUpdated: '2026-06-21',
    badge: 'Verified',
    description: 'Flagship TSA Nationals project combining time-series forecasting and machine learning to estimate monthly visitation patterns for Yellowstone and North Cascades.',
    coverage: 'Yellowstone NP + North Cascades NP',
    frequency: 'Monthly forecast horizon',
    sampleTable: {
      columns: ['Park', 'Month', 'Forecast_Visits', 'Model_MAE_pct'],
      rows: [
        { cells: ['Yellowstone', 'Jun 2026', '976200', '6.2'] },
        { cells: ['Yellowstone', 'Jul 2026', '1041300', '6.2'] },
        { cells: ['North Cascades', 'Jun 2026', '49400', '8.1'] },
        { cells: ['North Cascades', 'Jul 2026', '56200', '8.1'] },
      ],
    },
    reportContent: [
      {
        heading: 'Overview',
        body: 'Flagship TSA Nationals project combining time-series forecasting and machine learning to estimate monthly visitation patterns for Yellowstone and North Cascades. Historical park counts were aggregated with weather and calendar-effect features, cleaned for outliers, and used to benchmark baseline regressors against boosted-tree models.',
      },
      {
        heading: 'Coverage & Update Cadence',
        body: 'Coverage: Yellowstone NP and North Cascades NP. Forecast horizon: monthly. Validation used rolling windows to avoid leakage and preserve realistic forecasting conditions.',
      },
      {
        heading: 'Sample Forecast Output',
        body: 'Yellowstone: 976,200 forecast visits in June 2026 and 1,041,300 in July 2026 (Model MAE 6.2%). North Cascades: 49,400 forecast visits in June 2026 and 56,200 in July 2026 (Model MAE 8.1%).',
      },
    ],
    fileUrl: '',
    filePath: '',
    sampleUrl: '',
    sampleLabel: '',
    publishStatus: 'published',
    order: 0,
  },
  {
    slug: 'EV-ENG-2026-05',
    title: 'TerraScan: NASA "Dream with Us" UAS Pest-Detection Engineering Notebook',
    discipline: 'Engineering Design Challenge',
    domain: 'Written Report',
    format: 'PDF',
    size: '9.1 MB',
    lastUpdated: '2026-01-23',
    badge: 'Verified',
    description: 'Full engineering notebook submitted to NASA\'s Dream with Us High School Engineering Design Challenge: a fixed-wing UAS ("TerraScan") that autonomously surveys Washington apple orchards for codling moth damage via onboard RGB imaging and collects physical fruit samples with a motorized gripper for lab confirmation. Includes systems engineering process, weight/power/CG analysis, C3 and detect-and-avoid architecture, benchmark mission energy budget, safety case, and business/economic impact analysis.',
    coverage: 'Washington apple orchards (King County, incl. Bothell/Glacier Peak) and Yakima-region context',
    frequency: 'Single design-challenge submission (Nov 2025 - Jan 2026 cycle)',
    sampleTable: {
      columns: ['Metric', 'Value', 'Category'],
      rows: [
        { cells: ['Wingspan', '1.57 m', 'Air Vehicle'] },
        { cells: ['Endurance per flight', '30-35 min', 'Air Vehicle'] },
        { cells: ['Gross weight', '5,460 g', 'Air Vehicle'] },
        { cells: ['Telemetry link margin', '33 dB (2.5 km req.)', 'C3 / Safety'] },
        { cells: ['System cost', '$2,755 (~$6,200 fielded)', 'Business Case'] },
        { cells: ['Cost per mission', '$169', 'Business Case'] },
      ],
    },
    reportContent: [
      {
        heading: 'Executive Summary',
        body: 'The Washington apple industry accounts for over two billion dollars annually, and codling moth (Cydia pomonella) left unchecked can destroy up to 80% of a crop. Team AeroField (Glacier Peak High School, lead; Bothell High School, participating) built TerraScan, an uncrewed aircraft system (UAS) that autonomously detects codling moth damage in orchards while also collecting physical fruit samples for lab analysis, allowing growers to make better-informed pest-management decisions while reducing environmental impact and cost. Overall system cost is approximately $6,200 fielded (core components $2,755) with operating costs around $90-$169 per mission.',
      },
      {
        heading: 'Local Agricultural Pest: Codling Moth',
        body: 'The team, based in Bothell, WA (King County), selected codling moth because of its severe economic impact on Washington apple and pear crops - an industry worth over $2 billion in fresh sales. Damage thresholds are only 1-2% before growers must act, and a single larva can ruin an entire apple. Unmanaged populations could destroy 80-90% of NW apple crops, with potential losses of $510-557 million if related quarantine pests such as apple maggot became established. Codling moth completes two to three generations per year in Washington, requiring continuous scouting - making it a strong candidate for UAS-based detection.',
      },
      {
        heading: 'Engineering Design Process',
        body: 'The team followed a three-phase, requirements-driven process: conceptual design (Nov 25-Dec 1, 2025), preliminary design (Dec 2-10, 2025), and detailed design (Dec 11-19, 2025). Three air vehicle configurations were traded: fixed-wing (35+ min endurance), multi-rotor quadcopter (15-18 min endurance), and hybrid VTOL (highest complexity/risk). Fixed-wing was selected for its superior endurance and lower mechanical complexity, enabling the 100-acre benchmark mission to be completed in 1-3 flights rather than 3-4.',
      },
      {
        heading: 'Air Vehicle & Subsystems',
        body: 'Final air vehicle: high-wing, fixed-wing UAV, 1.57 m wingspan, 1.10 m fuselage length, 0.35 sq m wing area, foam-core/composite construction, total mass 5,460 g with center of gravity at 27.2% MAC. Propulsion: T-motor U3 series outrunner (500 KV) with 11x7 propeller. Power: two 6S 5000 mAh Li-Po packs in series-parallel (111 Wh usable), giving 30-35 minute endurance at 188 W cruise power. C3: Pixhawk 4 Mini autopilot, RFD900x telemetry (900 MHz, ~25 km theoretical range), 2.4 GHz RC link, with onboard autonomous detect-and-avoid (ADS-B receiver plus three ultrasonic rangefinders) and automatic return-to-home on lost link. Pest-detection payload: 1080p RGB camera (~5 cm/pixel ground sample distance at 60 m) feeding a three-step computer-vision pipeline (segmentation, damage-cue extraction, GPS-tagged alerting). Sample-gathering payload: motorized linear-actuator gripper (30 cm reach) storing up to 12 fruit samples in a foam-lined compartment tray for lab confirmation.',
      },
      {
        heading: 'Mission Discussion & Safety',
        body: 'Benchmark mission: survey a 100-acre, 1.6 km x 0.64 km apple orchard block across up to three flights (~28-30 minutes each) flown at 200 ft AGL with periodic descents to 15 ft AGL for sampling, operated by a two-person crew (pilot plus mission monitor). Energy margin is roughly 20% per flight and the telemetry link carries a 33 dB margin over the 2.5 km mission radius requirement. Safety architecture is defense-in-depth: onboard autonomous detect-and-avoid (cooperative via ADS-B, non-cooperative via ultrasonic rangefinders, and altitude geofencing), a two-tier lost-link protocol culminating in automatic return-to-home and spiral-descent landing, FAA Part 107 compliance in Class G airspace, and field procedures covering propeller, battery, weather, and public-safety precautions.',
      },
      {
        heading: 'Business Case & Economic Impact',
        body: 'Fixed cost of the fielded system is $2,755 (amortized to $0.55 per mission over a 5,000-mission/5-year lifecycle), with a $169 operating cost per mission. Compared to traditional scouting ($2,000-2,250/season for a 5-acre farm), the system pays back in roughly 18 months. Scaled to a 25-farm, 125-acre cooperative sharing one UAS, projected annual benefits include $60,000-90,000 in pesticide savings, $90,000-120,000 in labor savings, and $200,000-250,000 in avoided crop loss against a ~$2,030/year operating cost - a projected 5-year ROI exceeding 750%.',
      },
      {
        heading: 'Conclusion',
        body: 'TerraScan demonstrates that a fixed-wing UAS combining RGB-based pest detection with automated fruit sampling offers a technically sound, safety-compliant, and economically viable path to earlier codling moth detection for Washington apple growers, reducing pesticide use, labor, and crop loss compared to conventional ground scouting and area-wide spraying. Submitted to NASA\'s Dream with Us High School Engineering Design Challenge by Team AeroField (Ritvik Rajkumar, Santhosh Ilaiyaraja, Risith Kankanamge), coached by Charitha Kankanamge.',
      },
    ],
    fileUrl: '/documents/NASA%20DWU%20Challenge%202026%20Team%20AeroField-%20Ritvik.pdf',
    filePath: '',
    sampleUrl: '',
    sampleLabel: '',
    publishStatus: 'published',
    order: 1,
  },
  {
    slug: 'EV-DATA-2026-02',
    title: 'National Parks Dataset Summary & Feature Dictionary',
    discipline: 'Environmental Data Analysis',
    domain: 'Dataset Summary',
    format: 'CSV/Markdown',
    size: '2.1 MB',
    lastUpdated: '2026-06-18',
    badge: 'Standard',
    description: 'Clean reference index of source datasets, feature engineering notes, and variable definitions used in our park forecasting pipeline.',
    coverage: 'Public NPS and weather-linked datasets',
    frequency: 'Updated per release',
    sampleTable: {
      columns: ['Field', 'Type', 'Source', 'Notes'],
      rows: [
        { cells: ['visitation_count', 'integer', 'NPS Stats', 'Target variable'] },
        { cells: ['avg_temp_f', 'float', 'NOAA', 'Monthly aggregate'] },
        { cells: ['holiday_index', 'float', 'Derived', 'Demand seasonality signal'] },
        { cells: ['wildfire_smoke_days', 'integer', 'EPA', 'Exogenous predictor'] },
      ],
    },
    reportContent: [],
    fileUrl: '',
    filePath: '',
    sampleUrl: '',
    sampleLabel: '',
    publishStatus: 'published',
    order: 2,
  },
  {
    slug: 'EV-ML-2026-03',
    title: 'Forecasting Pipeline Notebook (Replicable Methods)',
    discipline: 'Machine Learning Models',
    domain: 'Code / Notebook',
    format: 'Jupyter / Python',
    size: '1.4 MB',
    lastUpdated: '2026-06-20',
    badge: 'Verified',
    description: 'Step-by-step notebook that reproduces baseline and advanced forecasting runs, including validation strategy and error analysis.',
    coverage: 'Modeling workflow',
    frequency: 'Versioned releases',
    sampleTable: {
      columns: ['Step', 'Tool', 'Runtime_min', 'Output'],
      rows: [
        { cells: ['Feature prep', 'pandas', '4.5', 'model_ready_table'] },
        { cells: ['Cross validation', 'scikit-learn', '9.2', 'cv_metrics'] },
        { cells: ['Model fit', 'xgboost', '3.7', 'fitted_model'] },
        { cells: ['Forecast export', 'python', '1.2', '2026_projection.csv'] },
      ],
    },
    reportContent: [],
    fileUrl: '',
    filePath: '',
    sampleUrl: '',
    sampleLabel: '',
    publishStatus: 'published',
    order: 3,
  },
  {
    slug: 'EV-METRICS-2026-04',
    title: 'Sustainability Impact Metrics Brief',
    discipline: 'Sustainability Metrics',
    domain: 'Written Report',
    format: 'PDF',
    size: '3.2 MB',
    lastUpdated: '2026-06-16',
    badge: 'Standard',
    description: 'Concise brief connecting forecast outputs to practical decisions on staffing, infrastructure load, and seasonal resource planning.',
    coverage: 'Gateway communities and park operations',
    frequency: 'Quarterly',
    sampleTable: {
      columns: ['Audience', 'Benefit', 'Typical_Lead_Weeks', 'Confidence'],
      rows: [
        { cells: ['Park planning teams', 'Seasonal staffing signal', '2', 'High'] },
        { cells: ['Gateway communities', 'Tourism readiness planning', '3', 'High'] },
        { cells: ['Nonprofits', 'Grant and outreach timing', '4', 'Medium'] },
      ],
    },
    reportContent: [
      {
        heading: 'Overview',
        body: 'Concise brief connecting forecast outputs to practical decisions on staffing, infrastructure load, and seasonal resource planning. Published quarterly for gateway communities and park operations partners.',
      },
      {
        heading: 'Audience Lead Times',
        body: 'Park planning teams: seasonal staffing signal with roughly 2 weeks lead time (high confidence). Gateway communities: tourism readiness planning with roughly 3 weeks lead time (high confidence). Nonprofits: grant and outreach timing with roughly 4 weeks lead time (medium confidence).',
      },
    ],
    fileUrl: '',
    filePath: '',
    sampleUrl: '',
    sampleLabel: '',
    publishStatus: 'published',
    order: 4,
  },
];

export const SEED_TEAM: TeamMemberDoc[] = [
  {
    slug: 'risith-kankanamge',
    name: 'Risith Kankanamge',
    role: 'Co-Founder & Lead Full-Stack Developer',
    blurb: 'Architected the core platform and proprietary scoring engine. Engineered the browser extension end-to-end and established the web application\'s technical foundation.',
    photoUrl: '',
    photoPath: '',
    links: [
      { label: 'LinkedIn', url: 'https://www.linkedin.com/in/risith-kankanamge/' },
      { label: 'Email', url: 'mailto:risithcha@gmail.com' },
      { label: 'GitHub', url: 'https://github.com/risithcha' },
    ],
    visible: true,
    order: 0,
  },
  {
    slug: 'santhosh-ilaiyaraja',
    name: 'Santhosh Ilaiyaraja',
    role: 'Co-Founder & Lead Interface Architect',
    blurb: 'Designs and optimizes the platform\'s visual layer. Oversees interface architecture, component engineering, and end-to-end frontend performance.',
    photoUrl: '',
    photoPath: '',
    links: [
      { label: 'LinkedIn', url: 'https://www.linkedin.com/in/santhosh-ilaiyaraja-77871436a/' },
      { label: 'Email', url: 'mailto:santhosh.ilaiyaraja21@gmail.com' },
      { label: 'GitHub', url: 'https://github.com/Santhosh-Ilaiyaraja' },
    ],
    visible: true,
    order: 1,
  },
  {
    slug: 'ritvik-rajkumar',
    name: 'Ritvik Rajkumar',
    role: 'Co-Founder & Lead Product Engineer',
    blurb: 'Drives product vision across user flows and feature design. Focuses on usability, interaction patterns, prototyping, and product flows across React/Tailwind.',
    photoUrl: '',
    photoPath: '',
    links: [
      { label: 'LinkedIn', url: 'https://www.linkedin.com/in/ritvik-sujan-rajkumar' },
      { label: 'Email', url: 'mailto:rajkumarritvik1@gmail.com' },
      { label: 'GitHub', url: 'https://github.com/rajkumarritvik' },
    ],
    visible: true,
    order: 2,
  },
];

export const SEED_TAXONOMIES: Record<string, TaxonomyDoc> = {
  disciplines: {
    values: [
      { id: 'tourism-forecasting', label: 'Tourism Forecasting', order: 0 },
      { id: 'environmental-data-analysis', label: 'Environmental Data Analysis', order: 1 },
      { id: 'sustainability-metrics', label: 'Sustainability Metrics', order: 2 },
      { id: 'machine-learning-models', label: 'Machine Learning Models', order: 3 },
      { id: 'engineering-design-challenge', label: 'Engineering Design Challenge', order: 4 },
    ],
  },
  domains: {
    values: [
      { id: 'written-report', label: 'Written Report', order: 0 },
      { id: 'dataset-summary', label: 'Dataset Summary', order: 1 },
      { id: 'code-notebook', label: 'Code / Notebook', order: 2 },
    ],
  },
  categories: {
    values: [
      { id: 'flagship-project', label: 'Flagship Project', order: 0 },
      { id: 'case-study', label: 'Case Study', order: 1 },
      { id: 'methodology', label: 'Methodology', order: 2 },
      { id: 'team-update', label: 'Team Update', order: 3 },
    ],
  },
};

export const SEED_PAGE_HOME: PageHomeDoc = {
  badges: ['Student-Led Research Hub'],
  heading: 'Turning Competition-Grade Data Science\nInto Real Help',
  tagline: 'EcoVeridian is a student research team offering forecasting and data analysis support to organizations. We built this work through our TSA Data Science and Analytics project, then expanded it into a practical research hub partners can use.',
  ctaLabel: 'Read The Research',
  heroFigureCaption: 'Fig. 1 - Visitation Forecast Snapshot',
  archiveHeading: 'Curated Archives',
  archiveKicker: 'Proof Of Work',
  heroArticleSlug: 'ART-001',
  flagshipArticleSlug: 'ART-001',
  flagshipKicker: 'Flagship Project',
  card1ArticleSlug: 'ART-002',
  card1Kicker: 'Methodology',
  card2ArticleSlug: 'ART-003',
  card2Kicker: 'Team Updates',
};

export const SEED_PAGE_ABOUT: PageAboutDoc = {
  kicker: 'About Us',
  heading: 'What EcoVeridian Is For',
  intro: 'EcoVeridian is a research hub focused on making environmental and tourism data useful. We build forecasting models, clean dataset references, and reproducible methods, then publish them in one place so parks, gateway communities, and nonprofits can plan with better information.',
  whyHeading: 'Why This Platform Exists',
  whyParagraphs: [
    'National parks and the communities around them face growing visitation with limited staffing and infrastructure budgets. Most of the data needed to plan ahead already exists, but it is scattered across agencies, formats, and time scales. EcoVeridian pulls that data together, models it, and translates the results into forecasts and briefs that are easy to act on.',
    'Rather than treating forecasting as a one-off report, we publish our methodology, sample data, and update cadence alongside every resource. That means anyone using the site can trace a number back to its source and understand exactly how confident they should be in it.',
  ],
  sidebarHeading: "What You'll Find Here",
  sidebarItems: [
    'Flagship visitation forecasts for parks like Yellowstone and North Cascades',
    'Dataset summaries and feature dictionaries behind our models',
    'Reproducible notebooks documenting our modeling pipeline',
    'Plain-language briefs connecting forecasts to staffing and planning decisions',
  ],
  approachHeading: 'How We Approach the Work',
  pillars: [
    {
      icon: 'target',
      title: 'Practical, Decision-Ready Research',
      body: 'We turn raw environmental and tourism data into forecasts, briefs, and dashboards that partners can actually act on, not just academic exercises that sit on a shelf.',
    },
    {
      icon: 'database',
      title: 'Transparent Methods & Data',
      body: 'Every published resource comes with its underlying dataset summary, modeling approach, and validation notes, so organizations can see exactly how a number was produced.',
    },
    {
      icon: 'bar-chart-3',
      title: 'Forecasting for the Outdoors',
      body: 'Our flagship work models park visitation and seasonal demand so land managers, gateway communities, and nonprofits can plan staffing and resources earlier.',
    },
    {
      icon: 'users',
      title: 'Free Collaboration',
      body: 'We partner with parks, agencies, and community organizations at no cost, scoping projects together and shaping the work around what your team actually needs.',
    },
  ],
  closingNote: 'EcoVeridian started as a sustainability-focused research project and has grown into an ongoing hub for data-informed environmental and tourism planning. We are continuing to expand our resource library and welcome partners who want to put good data behind their decisions.',
};

export const SEED_PAGE_INSTITUTIONAL: PageInstitutionalDoc = {
  kicker: 'Ways To Work With Us',
  heading: 'How We Can Help Your Organization',
  intro: 'We offer free collaboration and research support at different levels of depth. Choose the engagement style that fits your needs, and we will shape the project together.',
  tiersHeading: 'Collaboration Options',
  tiers: [
    {
      icon: 'landmark',
      title: 'Quick Consultation',
      body: 'Best for focused questions and fast review. Share your context, and we provide concise findings, interpretation help, or direction for next steps.',
      bullets: [
        'Initial findings in 1-2 weeks',
        'One clear recommendation memo',
        'Direct access to our team',
        'Follow-up Q&A session',
      ],
      badge: '',
      highlighted: false,
    },
    {
      icon: 'award',
      title: 'Full Research Partnership',
      body: 'Best for ongoing collaboration. We co-design a scoped project, build custom analysis or forecasts, and support implementation discussions with your team.',
      bullets: [
        'Custom forecasting model build',
        'Custom data visualizations',
        'Milestone updates and iteration',
        'Follow-up support after delivery',
      ],
      badge: 'Deeper Engagement',
      highlighted: true,
    },
  ],
  estimator: {
    heading: 'Project Scope Estimator',
    thresholds: [
      { maxScore: 4, label: '1-2 weeks' },
      { maxScore: 7, label: '2-3 weeks' },
      { maxScore: 999, label: '3-5 weeks' },
    ],
    note: 'We do not charge for access. Scope and timeline are finalized together after first contact.',
    ctaLabel: 'Get In Touch',
  },
};

export const SEED_PAGE_PARTNER: PagePartnerDoc = {
  heading: 'Partner With Us',
  intro: 'Tell us what you are working on and where you need help. We support forecasting, analysis, and collaborative research projects with organizations focused on sustainability and public lands.',
  noticeHeading: 'RESPONSE LATENCY',
  noticeBody: 'We typically respond within a few days depending on current project volume.',
  inquiryTypes: [
    'General Inquiry',
    'Research Collaboration',
    'Data or Forecasting Request',
    'Media or Press',
    'Other',
  ],
  responseNote: 'We typically respond within a few days.',
};

export const SEED_SITE_SETTINGS: SiteSettingsDoc = {
  contactEmail: 'ecoveridian@gmail.com',
  formSubmitEmail: 'ecoveridian@gmail.com',
  socials: [
    { label: 'Instagram', url: 'https://www.instagram.com/ecoveridian' },
    { label: 'GitHub', url: 'https://github.com/EcoVeridian' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/company/ecoveridian' },
  ],
  footerTagline: 'Institute for Environmental Analysis & Research',
  copyright: '© 2026 EcoVeridian. All rights reserved.',
  nav: [
    { route: '/', label: 'Research', visible: true },
    { route: '/resources', label: 'Resource Hub', visible: true },
    { route: '/team', label: 'Team', visible: true },
    { route: '/partner', label: 'Partner With Us', visible: true },
    { route: '/collaborate', label: 'Ways to Work With Us', visible: true },
  ],
  seo: {
    title: 'EcoVeridian',
    description: 'EcoVeridian is a student-led environmental research team offering free forecasting and data analysis support to organizations.',
    ogImageUrl: '',
  },
  announcement: { enabled: false, text: '', linkUrl: '', linkLabel: '' },
};

export const SEED_THEME_SETTINGS: ThemeSettingsDoc = {
  overrides: {},
};

/**
 * Built-in roles. 'owner' is the immutable superuser (rules treat it as
 * all-permissions regardless of this map); 'editor' is a normal editable
 * role. Owners can create additional roles from the admin panel.
 */
export const SEED_ROLES: Record<string, RoleDoc> = {
  owner: {
    name: 'Owner',
    description: 'Full control, including admin users, roles, and settings. Cannot be edited.',
    permissions: {
      articles: true,
      resources: true,
      team: true,
      taxonomies: true,
      pages: true,
      settings: true,
      inquiries: true,
      media: true,
      users: true,
    },
    builtIn: true,
    order: 0,
  },
  editor: {
    name: 'Editor',
    description: 'Manages site content: articles, resources, team, taxonomies, pages, inquiries, and media.',
    permissions: {
      articles: true,
      resources: true,
      team: true,
      taxonomies: true,
      pages: true,
      settings: false,
      inquiries: true,
      media: true,
      users: false,
    },
    builtIn: true,
    order: 1,
  },
};

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
    ],
    reportContent: [
      {
        heading: 'Overview',
        body: 'Flagship TSA Nationals project combining time-series forecasting and machine learning to estimate monthly visitation patterns for Yellowstone and North Cascades. Historical park counts were aggregated with weather and calendar-effect features, cleaned for outliers, and used to benchmark baseline regressors against boosted-tree models.'
      },
      {
        heading: 'Coverage & Update Cadence',
        body: 'Coverage: Yellowstone NP and North Cascades NP. Forecast horizon: monthly. Validation used rolling windows to avoid leakage and preserve realistic forecasting conditions.'
      },
      {
        heading: 'Sample Forecast Output',
        body: 'Yellowstone: 976,200 forecast visits in June 2026 and 1,041,300 in July 2026 (Model MAE 6.2%). North Cascades: 49,400 forecast visits in June 2026 and 56,200 in July 2026 (Model MAE 8.1%).'
      }
    ]
  },
  {
    id: 'EV-ENG-2026-05',
    title: 'TerraScan: NASA "Dream with Us" UAS Pest-Detection Engineering Notebook',
    discipline: 'Engineering Design Challenge',
    domain: 'Written Report',
    format: 'PDF',
    size: '9.1 MB',
    lastUpdated: '2026-01-23',
    status: 'Verified',
    fileUrl: '/documents/NASA%20DWU%20Challenge%202026%20Team%20AeroField-%20Ritvik.pdf',
    description: 'Full engineering notebook submitted to NASA\'s Dream with Us High School Engineering Design Challenge: a fixed-wing UAS ("TerraScan") that autonomously surveys Washington apple orchards for codling moth damage via onboard RGB imaging and collects physical fruit samples with a motorized gripper for lab confirmation. Includes systems engineering process, weight/power/CG analysis, C3 and detect-and-avoid architecture, benchmark mission energy budget, safety case, and business/economic impact analysis.',
    coverage: 'Washington apple orchards (King County, incl. Bothell/Glacier Peak) and Yakima-region context',
    frequency: 'Single design-challenge submission (Nov 2025 - Jan 2026 cycle)',
    sampleData: [
      { Metric: 'Wingspan', Value: '1.57 m', Category: 'Air Vehicle' },
      { Metric: 'Endurance per flight', Value: '30-35 min', Category: 'Air Vehicle' },
      { Metric: 'Gross weight', Value: '5,460 g', Category: 'Air Vehicle' },
      { Metric: 'Telemetry link margin', Value: '33 dB (2.5 km req.)', Category: 'C3 / Safety' },
      { Metric: 'System cost', Value: '$2,755 (~$6,200 fielded)', Category: 'Business Case' },
      { Metric: 'Cost per mission', Value: '$169', Category: 'Business Case' }
    ],
    reportContent: [
      {
        heading: 'Executive Summary',
        body: 'The Washington apple industry accounts for over two billion dollars annually, and codling moth (Cydia pomonella) left unchecked can destroy up to 80% of a crop. Team AeroField (Glacier Peak High School, lead; Bothell High School, participating) built TerraScan, an uncrewed aircraft system (UAS) that autonomously detects codling moth damage in orchards while also collecting physical fruit samples for lab analysis, allowing growers to make better-informed pest-management decisions while reducing environmental impact and cost. Overall system cost is approximately $6,200 fielded (core components $2,755) with operating costs around $90-$169 per mission.'
      },
      {
        heading: 'Local Agricultural Pest: Codling Moth',
        body: 'The team, based in Bothell, WA (King County), selected codling moth because of its severe economic impact on Washington apple and pear crops - an industry worth over $2 billion in fresh sales. Damage thresholds are only 1-2% before growers must act, and a single larva can ruin an entire apple. Unmanaged populations could destroy 80-90% of NW apple crops, with potential losses of $510-557 million if related quarantine pests such as apple maggot became established. Codling moth completes two to three generations per year in Washington, requiring continuous scouting - making it a strong candidate for UAS-based detection.'
      },
      {
        heading: 'Engineering Design Process',
        body: 'The team followed a three-phase, requirements-driven process: conceptual design (Nov 25-Dec 1, 2025), preliminary design (Dec 2-10, 2025), and detailed design (Dec 11-19, 2025). Three air vehicle configurations were traded: fixed-wing (35+ min endurance), multi-rotor quadcopter (15-18 min endurance), and hybrid VTOL (highest complexity/risk). Fixed-wing was selected for its superior endurance and lower mechanical complexity, enabling the 100-acre benchmark mission to be completed in 1-3 flights rather than 3-4.'
      },
      {
        heading: 'Air Vehicle & Subsystems',
        body: 'Final air vehicle: high-wing, fixed-wing UAV, 1.57 m wingspan, 1.10 m fuselage length, 0.35 sq m wing area, foam-core/composite construction, total mass 5,460 g with center of gravity at 27.2% MAC. Propulsion: T-motor U3 series outrunner (500 KV) with 11x7 propeller. Power: two 6S 5000 mAh Li-Po packs in series-parallel (111 Wh usable), giving 30-35 minute endurance at 188 W cruise power. C3: Pixhawk 4 Mini autopilot, RFD900x telemetry (900 MHz, ~25 km theoretical range), 2.4 GHz RC link, with onboard autonomous detect-and-avoid (ADS-B receiver plus three ultrasonic rangefinders) and automatic return-to-home on lost link. Pest-detection payload: 1080p RGB camera (~5 cm/pixel ground sample distance at 60 m) feeding a three-step computer-vision pipeline (segmentation, damage-cue extraction, GPS-tagged alerting). Sample-gathering payload: motorized linear-actuator gripper (30 cm reach) storing up to 12 fruit samples in a foam-lined compartment tray for lab confirmation.'
      },
      {
        heading: 'Mission Discussion & Safety',
        body: 'Benchmark mission: survey a 100-acre, 1.6 km x 0.64 km apple orchard block across up to three flights (~28-30 minutes each) flown at 200 ft AGL with periodic descents to 15 ft AGL for sampling, operated by a two-person crew (pilot plus mission monitor). Energy margin is roughly 20% per flight and the telemetry link carries a 33 dB margin over the 2.5 km mission radius requirement. Safety architecture is defense-in-depth: onboard autonomous detect-and-avoid (cooperative via ADS-B, non-cooperative via ultrasonic rangefinders, and altitude geofencing), a two-tier lost-link protocol culminating in automatic return-to-home and spiral-descent landing, FAA Part 107 compliance in Class G airspace, and field procedures covering propeller, battery, weather, and public-safety precautions.'
      },
      {
        heading: 'Business Case & Economic Impact',
        body: 'Fixed cost of the fielded system is $2,755 (amortized to $0.55 per mission over a 5,000-mission/5-year lifecycle), with a $169 operating cost per mission. Compared to traditional scouting ($2,000-2,250/season for a 5-acre farm), the system pays back in roughly 18 months. Scaled to a 25-farm, 125-acre cooperative sharing one UAS, projected annual benefits include $60,000-90,000 in pesticide savings, $90,000-120,000 in labor savings, and $200,000-250,000 in avoided crop loss against a ~$2,030/year operating cost - a projected 5-year ROI exceeding 750%.'
      },
      {
        heading: 'Conclusion',
        body: 'TerraScan demonstrates that a fixed-wing UAS combining RGB-based pest detection with automated fruit sampling offers a technically sound, safety-compliant, and economically viable path to earlier codling moth detection for Washington apple growers, reducing pesticide use, labor, and crop loss compared to conventional ground scouting and area-wide spraying. Submitted to NASA\'s Dream with Us High School Engineering Design Challenge by Team AeroField (Ritvik Rajkumar, Santhosh Ilaiyaraja, Risith Kankanamge), coached by Charitha Kankanamge.'
      }
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
    ],
    reportContent: [
      {
        heading: 'Overview',
        body: 'Concise brief connecting forecast outputs to practical decisions on staffing, infrastructure load, and seasonal resource planning. Published quarterly for gateway communities and park operations partners.'
      },
      {
        heading: 'Audience Lead Times',
        body: 'Park planning teams: seasonal staffing signal with roughly 2 weeks lead time (high confidence). Gateway communities: tourism readiness planning with roughly 3 weeks lead time (high confidence). Nonprofits: grant and outreach timing with roughly 4 weeks lead time (medium confidence).'
      }
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

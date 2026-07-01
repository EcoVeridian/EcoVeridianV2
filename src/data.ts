/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EnvironmentalFramework, ScholarlyArticle } from './types';

export const ENVIRONMENTAL_FRAMEWORKS: EnvironmentalFramework[] = [
  {
    id: 'ECO-FW-041',
    title: 'Global Carbon Sink Distribution Matrix',
    discipline: 'Ecology & Conservation',
    domain: 'Terrestrial',
    format: 'JSON/CSV',
    size: '14.2 MB',
    lastUpdated: '2023-11-04',
    status: 'Verified',
    description: 'High-resolution terrestrial biomass and soil carbon density mapping across major tropical and boreal forest biomes. Includes longitudinal estimates of carbon flux rates derived from combining sentinel satellite imagery and ground-truthed eddy-covariance tower observations.',
    coverage: 'Global, Latitudes -55° to +70°',
    frequency: 'Monthly updates',
    sampleData: [
      { Biome: 'Amazon Rainforest', CarbonDensity_t_ha: 142.5, NetFlux_t_yr: -1.2, SoilMoisture: 'High' },
      { Biome: 'Boreal Taiga', CarbonDensity_t_ha: 89.1, NetFlux_t_yr: -0.4, SoilMoisture: 'Moderate' },
      { Biome: 'Congo Basin', CarbonDensity_t_ha: 135.2, NetFlux_t_yr: -1.1, SoilMoisture: 'High' },
      { Biome: 'Temperate Deciduous', CarbonDensity_t_ha: 74.8, NetFlux_t_yr: -0.6, SoilMoisture: 'Moderate' }
    ]
  },
  {
    id: 'CLI-MOD-202',
    title: 'Predictive Topography Reshaping Parameters',
    discipline: 'Climatology Models',
    domain: 'Terrestrial',
    format: 'PDF/XML',
    size: '4.8 MB',
    lastUpdated: '2023-10-18',
    status: 'Standard',
    description: 'An analytical blueprint modeling geomorphological alterations under aggressive precipitation simulations. Leverages regional climate modeling scenarios coupled with hydrological routing parameters to map landslide and erosion susceptibilities.',
    coverage: 'Western Alpine and Andean Regions',
    frequency: 'Annual baseline',
    sampleData: [
      { SlopeAngle_deg: 24.5, SoilCohesion_kPa: 12.0, RunoffCoeff: 0.65, FailureProbability: 'Low' },
      { SlopeAngle_deg: 38.2, SoilCohesion_kPa: 8.5, RunoffCoeff: 0.78, FailureProbability: 'High' },
      { SlopeAngle_deg: 15.1, SoilCohesion_kPa: 22.0, RunoffCoeff: 0.42, FailureProbability: 'Very Low' },
      { SlopeAngle_deg: 42.0, SoilCohesion_kPa: 5.2, RunoffCoeff: 0.85, FailureProbability: 'Critical' }
    ]
  },
  {
    id: 'HYD-DAT-09',
    title: 'Subterranean Aquifer Flow Rates (1990-2020)',
    discipline: 'Hydrological Systems',
    domain: 'Terrestrial',
    format: 'SQL/CSV',
    size: '1.2 GB',
    lastUpdated: '2023-09-02',
    status: 'Archived',
    description: 'Three-decade historical repository recording deep groundwater velocity vector fields, hydrostatic pressure gradients, and drawdown rates across critical continental agricultural basins. Crucial for assessing localized groundwater depletion patterns.',
    coverage: 'North American Great Plains / Ogallala Aquifer',
    frequency: 'Decadal (Consolidated Archive)',
    sampleData: [
      { StationID: 'OG-04A', MeanDepth_m: 82.4, DrawdownRate_m_yr: 0.42, Transmissivity_m2_d: 120 },
      { StationID: 'OG-12C', MeanDepth_m: 114.1, DrawdownRate_m_yr: 0.88, Transmissivity_m2_d: 95 },
      { StationID: 'OG-33B', MeanDepth_m: 65.2, DrawdownRate_m_yr: 0.15, Transmissivity_m2_d: 150 },
      { StationID: 'OG-45F', MeanDepth_m: 141.0, DrawdownRate_m_yr: 1.12, Transmissivity_m2_d: 75 }
    ]
  },
  {
    id: 'BIO-DIV-112',
    title: 'Boreal Forest Canopy Density Indicators',
    discipline: 'Ecology & Conservation',
    domain: 'Terrestrial',
    format: 'TIFF/JSON',
    size: '840 MB',
    lastUpdated: '2023-08-15',
    status: 'Verified',
    description: 'Gridded canopy cover fraction and Leaf Area Index (LAI) derived from multi-spectral drone missions and LiDAR transects. Supports research into microclimatic insulation underneath dense forest canopies.',
    coverage: 'Fennoscandian and Siberian Taiga',
    frequency: 'Bi-annual surveys',
    sampleData: [
      { PlotID: 'FI-TA-01', CanopyFraction: 0.78, LeafAreaIndex: 3.4, MicroclimateInsulation_C: 2.5 },
      { PlotID: 'FI-TA-02', CanopyFraction: 0.52, LeafAreaIndex: 1.8, MicroclimateInsulation_C: 1.1 },
      { PlotID: 'FI-TA-03', CanopyFraction: 0.85, LeafAreaIndex: 4.1, MicroclimateInsulation_C: 3.2 },
      { PlotID: 'FI-TA-04', CanopyFraction: 0.31, LeafAreaIndex: 0.9, MicroclimateInsulation_C: 0.4 }
    ]
  },
  {
    id: 'CLI-SAT-804',
    title: 'Atmospheric Aerosol Optical Depth (AOD) Time-series',
    discipline: 'Climatology Models',
    domain: 'Atmospheric',
    format: 'NetCDF/HDF',
    size: '2.4 GB',
    lastUpdated: '2024-01-10',
    status: 'Verified',
    description: 'Columnar optical thickness of atmospheric aerosols at 550nm wavelength. Synthesized from MODIS and VIIRS radiometric sensors with cloud-clearing algorithms to track industrial particulate plumes and wildfire dust transport.',
    coverage: 'Global Oceans & Landmasses',
    frequency: 'Daily aggregates',
    sampleData: [
      { Latitude: 34.5, Longitude: 118.2, AerosolType: 'Sulfate/Urban', OpticalDepth: 0.45, AngstromExponent: 1.4 },
      { Latitude: 18.2, Longitude: -34.5, AerosolType: 'Saharan Dust', OpticalDepth: 0.72, AngstromExponent: 0.3 },
      { Latitude: -12.3, Longitude: -62.1, AerosolType: 'Biomass Smoke', OpticalDepth: 0.58, AngstromExponent: 1.6 },
      { Latitude: 54.1, Longitude: 12.3, AerosolType: 'Marine Salt', OpticalDepth: 0.08, AngstromExponent: 0.8 }
    ]
  },
  {
    id: 'HYD-OCN-442',
    title: 'Marine Boundary Layer Sea-Surface Temperature Grid',
    discipline: 'Hydrological Systems',
    domain: 'Marine / Oceanic',
    format: 'CSV/NetCDF',
    size: '412 MB',
    lastUpdated: '2024-03-22',
    status: 'Verified',
    description: 'Spatially interpolated sea-surface skin temperature observations combined with autonomous biogeochemical Argo float profiles. Features high-fidelity monitoring of sub-diurnal thermal venting and marine heatwave anomalies.',
    coverage: 'Sub-tropical and Sub-polar Atlantic',
    frequency: 'Weekly consolidated',
    sampleData: [
      { Region: 'Sargasso Sea', SkinSST_C: 24.8, DeepTemperature_C: 18.2, OceanHeatContent_GJ_m2: 4.5 },
      { Region: 'Grand Banks', SkinSST_C: 11.2, DeepTemperature_C: 6.4, OceanHeatContent_GJ_m2: 1.8 },
      { Region: 'Norwegian Sea', SkinSST_C: 7.5, DeepTemperature_C: 3.1, OceanHeatContent_GJ_m2: 0.9 },
      { Region: 'Gulf Stream Edge', SkinSST_C: 21.4, DeepTemperature_C: 14.8, OceanHeatContent_GJ_m2: 3.8 }
    ]
  },
  {
    id: 'SOIL-BIO-309',
    title: 'Subarctic Permafrost Active Layer Microbial Index',
    discipline: 'Soil Biogeochemistry',
    domain: 'Terrestrial',
    format: 'FASTQ/TSV',
    size: '18.4 GB',
    lastUpdated: '2023-12-15',
    status: 'Standard',
    description: 'Metagenomic profiling of soil cores retrieved from active layer and transient permafrost boundary zones. Records abundance estimates of methanotrophic and methanogenic archaea groups corresponding to thermal degradation gradients.',
    coverage: 'Siberian Kolyma Basin and Yukon Flats',
    frequency: 'Seasonal campaigns',
    sampleData: [
      { Depth_cm: 15, ArchaeaAbundance_Pct: 1.4, MethanogenesisRate_nmol_g_h: 0.12, PermafrostState: 'Unfrozen (Active)' },
      { Depth_cm: 45, ArchaeaAbundance_Pct: 5.8, MethanogenesisRate_nmol_g_h: 1.45, PermafrostState: 'Transiently Thawed' },
      { Depth_cm: 80, ArchaeaAbundance_Pct: 12.3, MethanogenesisRate_nmol_g_h: 4.88, PermafrostState: 'Thawing Boundary' },
      { Depth_cm: 120, ArchaeaAbundance_Pct: 0.2, MethanogenesisRate_nmol_g_h: 0.01, PermafrostState: 'Intact Cryostructure' }
    ]
  },
  {
    id: 'ECO-BIO-902',
    title: 'Symbiotic Mycelial Network Soil Enzyme Assays',
    discipline: 'Soil Biogeochemistry',
    domain: 'Terrestrial',
    format: 'XLSX/CSV',
    size: '2.4 MB',
    lastUpdated: '2023-07-28',
    status: 'Verified',
    description: 'Quantitative enzyme activity profiles (specifically phosphatase, chitinase, and beta-glucosidase) recorded in mycorrhizal rhizosphere zones of climax forest biomes, showcasing high-resolution fungal nutrient pathways.',
    coverage: 'Climax Taiga and Tempered Rain forests',
    frequency: 'Quarterly',
    sampleData: [
      { RhizoZone: 'Mycorrhizal Outer', Phosphatase_U_g: 48.5, Chitinase_U_g: 12.4, NitrogenUptake_mg_kg: 8.5 },
      { RhizoZone: 'Mycorrhizal Core', Phosphatase_U_g: 78.2, Chitinase_U_g: 22.1, NitrogenUptake_mg_kg: 14.2 },
      { RhizoZone: 'Uncolonized Bulk Soil', Phosphatase_U_g: 14.1, Chitinase_U_g: 2.8, NitrogenUptake_mg_kg: 1.9 }
    ]
  },
  {
    id: 'CLI-GAS-511',
    title: 'Tropospheric Greenhouse Gas Column Densities',
    discipline: 'Climatology Models',
    domain: 'Atmospheric',
    format: 'HDF5/CSV',
    size: '1.8 GB',
    lastUpdated: '2024-02-14',
    status: 'Verified',
    description: 'Continuous columns of carbon dioxide (XCO2), methane (XCH4), and carbon monoxide (XCO) measured via atmospheric solar backscatter spectroscopy. Validated against WMO flask sampling sites.',
    coverage: 'Global continental stations',
    frequency: 'Monthly release',
    sampleData: [
      { Station: 'Mauna Loa Observatory', XCO2_ppm: 421.5, XCH4_ppb: 1912.4, XCO_ppb: 84.1 },
      { Station: 'Mace Head, Ireland', XCO2_ppm: 419.8, XCH4_ppb: 1898.1, XCO_ppb: 92.5 },
      { Station: 'Cape Grim, Australia', XCO2_ppm: 416.2, XCH4_ppb: 1852.7, XCO_ppb: 54.3 },
      { Station: 'Barrow, Alaska', XCO2_ppm: 423.1, XCH4_ppb: 1934.8, XCO_ppb: 110.2 }
    ]
  },
  {
    id: 'HYD-EST-120',
    title: 'Coastal Estuarine Salinity & Sediment Flux Transects',
    discipline: 'Hydrological Systems',
    domain: 'Marine / Oceanic',
    format: 'CSV/JSON',
    size: '85 MB',
    lastUpdated: '2023-05-11',
    status: 'Standard',
    description: 'In-situ acoustic doppler current profiler (ADCP) and conductivity-temperature-depth (CTD) records mapping sediment plume dynamics and saltwedge intrusion during tidal cycles in major industrialized estuaries.',
    coverage: 'Major European and North American Estuaries',
    frequency: 'Seasonal',
    sampleData: [
      { Estuary: 'Rhine Delta', SaltWedgeDistance_km: 18.5, Turbidity_NTU: 45.2, FreshwaterOutflow_m3_s: 2200 },
      { Estuary: 'Hudson River', SaltWedgeDistance_km: 22.1, Turbidity_NTU: 31.8, FreshwaterOutflow_m3_s: 640 },
      { Estuary: 'St. Lawrence', SaltWedgeDistance_km: 110.4, Turbidity_NTU: 14.5, FreshwaterOutflow_m3_s: 11800 }
    ]
  },
  {
    id: 'ECO-FRG-211',
    title: 'Fragmented Forest Patch Biodiversity Vector Dataset',
    discipline: 'Ecology & Conservation',
    domain: 'Terrestrial',
    format: 'SHP/GeoJSON',
    size: '342 MB',
    lastUpdated: '2023-11-20',
    status: 'Standard',
    description: 'GIS vector layers mapping isolated core forest patches and biological corridor networks. Links geometric patch indices (perimeter-to-area ratio, isolation index) to bird and small mammal occupancy surveys.',
    coverage: 'Atlantic Forest (Mata Atlântica) fragments',
    frequency: 'Annual baseline',
    sampleData: [
      { PatchID: 'MA-FR-39', Area_ha: 142.5, EdgePerimeterRatio: 124.2, SpeciesRichnessIndex: 0.64, CoreInsularity: 'High' },
      { PatchID: 'MA-FR-72', Area_ha: 12.8, EdgePerimeterRatio: 412.5, SpeciesRichnessIndex: 0.22, CoreInsularity: 'Critical' },
      { PatchID: 'MA-FR-105', Area_ha: 840.1, EdgePerimeterRatio: 48.1, SpeciesRichnessIndex: 0.88, CoreInsularity: 'Low (Connected)' }
    ]
  }
];

export const SCHOLARLY_ARTICLES: ScholarlyArticle[] = [
  {
    id: 'ART-001',
    title: 'The Architecture of Hidden Insight',
    category: 'Special Report',
    author: 'EcoSphere Scholarly Editorial',
    readTime: '12 min',
    excerpt: 'A definitive exploration into the structural paradigms of environmental data. We catalog the invisible threads connecting terrestrial ecosystems to atmospheric phenomena, rigorously curated for the modern scholar.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApTdxHnhHbP52I0Pgun2hjHotG1Y69uF3PLt4_F4YLfqr2WgqXpFPWXmmoal7N4qQePZqSGEqJFZlbkKKA2jqW5scw_IDr0rV1DzhsxzumE9MMvojhxbMCg4oj-1PYdkiFS-6excuSYeoUQ_93K1Bg4n-HU-CRaqlUg8gViv7asBF5HWkhEFCMMX2XdkL_RXcTBhqgg3sC5Qm6qPhqieUbzW-HuCiHml4Oq6fZ9NqaG0d5qVo5TMJQGiwGptotMZllOyWaqHHq-qg',
    figureCaption: 'Fig. 1 — Subarctic Observatories. Brutalist research facilities nestled in misty forests provide stable foundations for sub-zero climate sensors.',
    abstract: 'Environmental data consists of dynamic, interconnected networks that reflect the structural state of Earth ecosystems. This paper establishes the physical and architectural framework of remote sensing stations, showing how physical spatial constraints influence high-fidelity observation of environmental gradients.',
    introduction: 'The collection of environmental parameters in subarctic zones requires substantial infrastructure capable of enduring extreme conditions. Historically, monitoring stations were transient, prone to sensor drift due to structural shifts in frost heave cycles. Modern brutalist architecture provides structural rigidity, functioning as absolute coordinate datums in volatile regions.',
    methodologyText: 'We analyzed mechanical vibration profiles and sensor alignment drift at three subarctic observatories (illustrated in Fig. 1) over a seven-year period. Absolute positions were validated against multi-frequency GNSS receptors anchored deep in underlying crystalline bedrock.',
    analysisText: 'By decoupling climate-induced structural movement from actual physical changes, we recorded an order of magnitude reduction in measurement noise. Thermal expansion properties of heavyweight reinforced concrete were mapped to form structural offsets, allowing continuous, sub-millimeter precision calibration of laser-altimetric sensors.',
    references: [
      'Vance, E., & Carter, L. (2021). Bedrock Anchoring Systems for High-Latitude Geodetic Observatories. Earth & Atmospheric Instrumentation, 14(3), 211-224.',
      'Sidorov, A. M. (2018). Brutalism in extreme climates: structural performance of heavyweight concrete structures. Journal of Cold Regions Engineering, 32(2), 04018002.',
      'Global Environmental Consortium. (2023). Framework Protocols for Long-Term Terrestrial Observation Series (Ver 4.2).'
    ]
  },
  {
    id: 'ART-002',
    title: 'Stratification Protocols in Anthropocene Geology',
    category: 'Thesis',
    author: 'Dr. E. Vance',
    readTime: '45 min',
    excerpt: 'An exhaustive review of contemporary methodologies for indexing sediment layers within highly urbanized coastal regions, challenging established chronological markers.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPBNQSEhOTSvEYc1el2cMCsxfuyV5dT63-jwVjaPUS5E23VB9zSw1SuNLxfHSbaTMQP32fEQDJIDFZFR0yJQ_iTpSSDMF0yt5UJj6Av1VBl12-JO60w5NGjUD_oSm4ArAkCX6WDMOeA9lbKIum5AmPPDBs844uFEJV7UrTOoRnnb-jgkTGHMP_FF4jI6pjmnLcANBVIhvPz488-aOp9wwKgl4XFzQk1MBdulI6v0VkxiVmTOjcROcvhZCF0vL61B64l50E52-EdBw',
    figureCaption: 'Fig. 2 — Anthropocene Stratification. directional high-contrast directional lighting highlights distinct, dense anthropogenic sediment lines.',
    abstract: 'This thesis establishes standardized stratigraphic protocols to identify, categorize, and cross-index anthropogenic sedimentary layers in highly urbanized coastal zones. Conventional stratigraphic boundaries are redefined using modern biochemical and micro-plastic tracers, addressing the limitations of classical geological indexing.',
    introduction: 'The conceptualization of the Anthropocene as a distinct geological epoch demands rigorous stratigraphic evidence. Urbanization constructs heavy localized physical disruptions that reshape tidal estuarine sediments. This paper provides a field methodology to resolve dense, non-linear sediment stratification created by municipal development and industrial runoff.',
    methodologyText: 'Core samples were extracted along 40 kilometers of coastal estuarine zones utilizing high-integrity sonic drill systems. Sediment density profiles were scanned using high-definition computerized tomography (CT) and cross-validated with elemental micro-X-ray fluorescence (micro-XRF) to identify heavy-metal markers.',
    analysisText: 'The resulting stratigraphy reveals highly structured, discrete boundaries of chemical and physical polymers. Distinct deposition peaks correlate precisely with regional regulatory policy shifts (e.g., leaded gasoline bans, polymer introduction periods). Standardizing these peaks creates a robust framework for absolute geological dating in the modern age.',
    references: [
      'Vance, E. (2024). Stratification Protocols in Anthropocene Geology. Doctoral Dissertation, Geneva Research Institute.',
      'Waters, C. N., et al. (2016). The Anthropocene is functionally and stratigraphically distinct from the Holocene. Science, 351(6269), aad2622.',
      'Zalasiewicz, J., et al. (2015). When did the Anthropocene begin? A mid-twentieth century boundary is stratigraphically optimal. Quaternary International, 383, 196-203.'
    ]
  },
  {
    id: 'ART-003',
    title: 'Algorithmic Canopy Analysis',
    category: 'Methodology',
    author: 'Consortium Core Researchers',
    readTime: '24 min',
    excerpt: 'Utilizing machine learning models to predict localized micro-climate shifts based on subtle variations in leaf morphology.',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=1200',
    abstract: 'This paper documents the design and validation of spatial convolution networks trained on high-density UAV-derived leaf scans. We correlate microscopic changes in canopy leaf margins, stomatal distribution, and leaf angle distribution to local changes in relative humidity, soil moisture deficit, and under-canopy temperature.',
    introduction: 'Forest canopies act as active buffers, decoupling forest floor microclimates from severe ambient atmospheric warming. Conventional regional climate models fail to compute sub-canopy temperatures due to inadequate foliage density representation. Our methodology bridges this gap using deep-learning-derived structural metrics.',
    methodologyText: 'Using high-resolution multi-spectral LIDAR and multi-spectral cameras flown at altitudes of 45 meters, we mapped 14 temperate and boreal test plots. Image layers were converted into local surface normal models to determine structural leaf orientation and density distribution metrics.',
    analysisText: 'We found a strong, statistically significant correlation between localized leaf-deflection angles and high-frequency humidity shifts. The machine learning models successfully predicted sub-canopy thermal insulation values with a mean absolute error of just 0.18 degrees Celsius, representing a major performance boost over standard empirical models.',
    references: [
      'Chen, J. M., & Black, T. A. (1992). Defining leaf area index for forest canopies with non-random leaf distributions. Agricultural and Forest Meteorology, 57(1-3), 1-12.',
      'De Frenne, P., et al. (2019). Global systematic acquisition of microclimate under-canopy datasets. Ecology Letters, 22(7), 1113-1126.',
      'Consortium Forestry Group. (2024). Deep CNN architectures for automated foliage leaf-angle profiling. Forestry Tech Reports, Vol 8.'
    ]
  },
  {
    id: 'ART-004',
    title: 'The Silent Mycelial Network',
    category: 'Field Notes',
    author: 'Taiga Field Station Expedition',
    readTime: '30 min',
    excerpt: 'Observations from the prolonged isolation study in the Taiga biome, documenting uncharted symbiotic fungal relationships.',
    image: 'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&q=80&w=1200',
    abstract: 'Continuous biochemical monitoring of climax taiga rhizospheres reveals systemic, underground carbohydrate-nitrogen transfer rates regulated by mycorrhizal networks. This report catalogs soil respiration changes during simulated nutrient stress events under prolonged isolation.',
    introduction: 'Rhizospheric symbiosis is the nutritional foundation of subpolar forest ecosystems. While theoretical models for carbon distribution exist, high-resolution direct field verification of spatial-temporal enzyme profiles remains elusive. This note reports on field recordings obtained under pristine, isolated, and highly instrumented conditions.',
    methodologyText: 'Custom micro-lysimeters and micro-sensor probes were deployed at varying depths around coniferous host root systems. Fungal mycelial biomass was cataloged via selective PCR-amplification of metagenomic markers from soil cores gathered weekly.',
    analysisText: 'Our observations reveal a complex, pulse-like resource allocation system. During localized shade-stress simulations, mycorrhizal filaments re-allocated up to 14% of mobile phosphorus towards distressed roots within 48 hours. Fungal enzymes (specifically acid phosphatase) peaked in direct alignment with host sugar depletion curves, demonstrating rapid real-time mutualistic feedbacks.',
    references: [
      'Simard, S. W., et al. (1997). Net transfer of carbon between ectomycorrhizal tree species in the field. Nature, 388(6642), 579-582.',
      'Klein, T., et al. (2016). Belowground carbon trade among tall trees in a temperate forest. Science, 352(6281), 86-89.',
      'Taiga Ecological Base. (2023). Soil enzymatic responses to experimental resource constraint. Station Bulletin 44.'
    ]
  }
];

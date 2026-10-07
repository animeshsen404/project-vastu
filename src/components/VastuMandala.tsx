import React, { useState } from 'react';
import { Compass, Sparkles, Shield, Flame, Droplets, Wind, Mountain, Eye, Info, CheckCircle2, AlertOctagon, ArrowRight } from 'lucide-react';
import { PageType } from '../types';

interface VastuMandalaProps {
  onNavigate?: (page: PageType, subTab?: string) => void;
}

interface MandalaZoneData {
  id: string;
  code: string;
  name: string;
  sanskrit: string;
  direction: string;
  col: number;
  row: number;
  element: string;
  elementIconName: 'water' | 'fire' | 'air' | 'earth' | 'space';
  deity: string;
  purushaAnatomy: {
    part: string;
    sanskritPart: string;
    description: string;
    significance: string;
  };
  attributes: string;
  recommendation: string;
  caution: string;
  classicalQuote: string;
  source: string;
  colorTheme: {
    bg: string;
    border: string;
    accent: string;
    highlight: string;
  };
}

export const MANDALA_9_ZONES: MandalaZoneData[] = [
  {
    id: 'NW',
    code: 'NW',
    name: 'Vayavya',
    sanskrit: 'वायव्य',
    direction: 'North-West',
    col: 0,
    row: 0,
    element: 'Air (वायु · Vayu)',
    elementIconName: 'air',
    deity: 'Vayu Deva (Lord of Winds)',
    purushaAnatomy: {
      part: 'Left Hand & Forearm',
      sanskritPart: 'वामहस्तः (Vama-Hasta)',
      description: 'The active left hand of the Purusha expressing kinetic motion, release, and ongoing exchange with the outer world.',
      significance: 'Governs transit and mobility; things placed here do not remain stagnant. Ideal for visitors and guest quarters.'
    },
    attributes: 'Kinetic movement, circulation, mental agility, dynamic transactions',
    recommendation: 'Guest bedroom, dispatch storage, transit garage, married daughter room, dynamic sales team',
    caution: 'Avoid master bedroom, heavy cash vaults, or anchoring heavy machinery here (causes restlessness)',
    classicalQuote: '“वायव्ये वायुदेवत्यं चलं सर्वत्र संस्मृतम्॥” — Samarāṅgaṇa Sūtradhāra',
    source: 'Samarāṅgaṇa Sūtradhāra, Ch. 14',
    colorTheme: {
      bg: 'from-[#1E3048] to-[#142338]',
      border: 'border-[#5A9CB5]',
      accent: '#64B5F6',
      highlight: 'rgba(100, 181, 246, 0.4)'
    }
  },
  {
    id: 'N',
    code: 'N',
    name: 'Uttara',
    sanskrit: 'उत्तर',
    direction: 'North',
    col: 1,
    row: 0,
    element: 'Water & Magnetic (जल / चुम्बकीय)',
    elementIconName: 'water',
    deity: 'Kuber (Lord of Wealth & Treasures)',
    purushaAnatomy: {
      part: 'Chest & Vital Ribs',
      sanskritPart: 'वक्षःस्थलम् (Vakshasthalam)',
      description: 'The upper torso and lungs of the Purusha, breathing in the nourishing magnetic prana from the cosmic North.',
      significance: 'Requires openness and lightness so the dwelling breathes unobstructed financial vitality and mental peace.'
    },
    attributes: 'Wealth inflow, career trajectory, intellectual clarity, magnetic harmony',
    recommendation: 'Accounts department, cash lockers, main office entrance, green lawn, water fountains',
    caution: 'Avoid heavy masonry obstructions, clutter, toilets, or overhead solid walls that block the northern flow',
    classicalQuote: '“उत्तरे धनदः प्रोक्तः सर्वसम्पत्प्रदायकः॥” — Mayamatam',
    source: 'Mayamatam, Ch. 7',
    colorTheme: {
      bg: 'from-[#0C3B37] to-[#072825]',
      border: 'border-[#26A69A]',
      accent: '#4DB6AC',
      highlight: 'rgba(77, 182, 172, 0.4)'
    }
  },
  {
    id: 'NE',
    code: 'NE',
    name: 'Ishanya',
    sanskrit: 'ईशान्य',
    direction: 'North-East',
    col: 2,
    row: 0,
    element: 'Water & Ether (जल / आकाश)',
    elementIconName: 'water',
    deity: 'Ishana (Lord Shiva / Supreme Consciousness)',
    purushaAnatomy: {
      part: 'Crown & Third Eye (Head)',
      sanskritPart: 'शिरः / ललाटम् (Shiras & Mastaka)',
      description: 'The sacred head and crown chakra of the Vastu Purusha, turned towards the dawn of solar and cosmic illumination.',
      significance: 'Placing heavy weight, toilets, or fire on the head causes severe cognitive stress, lack of clarity, and discord.'
    },
    attributes: 'Spiritual clarity, pure wisdom, cosmic consciousness, undisturbed serenity',
    recommendation: 'Meditation hall, puja sanctuary, library, underground freshwater sump, open terrace',
    caution: 'Strictly avoid toilets, kitchen stoves, heavy staircases, or tall boundary walls blocking sunrise',
    classicalQuote: '“ईशाने देवतागारं जलस्थानं तथैव च॥” — Bṛhat Saṃhitā',
    source: 'Bṛhat Saṃhitā, Ch. 53',
    colorTheme: {
      bg: 'from-[#2A3556] to-[#171E36]',
      border: 'border-[#D4A72C]',
      accent: '#FFD54F',
      highlight: 'rgba(212, 167, 44, 0.5)'
    }
  },
  {
    id: 'W',
    code: 'W',
    name: 'Pashchima',
    sanskrit: 'पश्चिम',
    direction: 'West',
    col: 0,
    row: 1,
    element: 'Water / Air (जल / वायु)',
    elementIconName: 'air',
    deity: 'Varuna (Lord of Waters & Cosmic Cosmic Order)',
    purushaAnatomy: {
      part: 'Left Thigh & Hip',
      sanskritPart: 'वामोरू (Vamoru)',
      description: 'The left thigh and hip of the Purusha, providing solid seated equilibrium during the setting of the sun.',
      significance: 'Governs sustenance, assimilation of nutrition, joy of evening gatherings, and secondary stability.'
    },
    attributes: 'Sustenance, family dining, professional stability, social reputation',
    recommendation: 'Dining hall, children’s study bedroom, overhead secondary water tanks, conference desks',
    caution: 'Do not keep it significantly lower than the East; avoid sunken ditches or primary front gates without shielding',
    classicalQuote: '“वरुणे भोजनस्थानं पश्चिमे सम्यगुच्यते॥” — Mānasāra',
    source: 'Mānasāra, Ch. 9',
    colorTheme: {
      bg: 'from-[#1A2E3B] to-[#121F28]',
      border: 'border-[#4DB6AC]',
      accent: '#80CBC4',
      highlight: 'rgba(128, 203, 196, 0.4)'
    }
  },
  {
    id: 'CENTER',
    code: 'CENTER',
    name: 'Brahmasthana',
    sanskrit: 'ब्रह्मस्थान',
    direction: 'Center / Cosmic Core',
    col: 1,
    row: 1,
    element: 'Pure Ether / Space (आकाश · Akasha)',
    elementIconName: 'space',
    deity: 'Lord Brahma (The Creator & Cosmic Origin)',
    purushaAnatomy: {
      part: 'Navel & Heart Nexus',
      sanskritPart: 'नाभिः तथा हृदयम् (Nabhi & Hridaya)',
      description: 'The sacred umbilical lotus and spiritual heart of the Purusha, from which all spatial energy radiates outward.',
      significance: 'Must remain completely unburdened and open to sky or luminous light. Structural load on Brahmasthana crushes the life of the building.'
    },
    attributes: 'Universal equilibrium, wholeness, life breath (Prana), multidirectional harmony',
    recommendation: 'Open-to-sky courtyard (Angana), central skylight atrium, clean unencumbered circulation zone',
    caution: 'Never place structural pillars, staircases, toilets, septic tanks, kitchens, or heavy load-bearing columns here',
    classicalQuote: '“मध्यं तु ब्रह्मणः स्थानं तत्र दोषो महाभयः॥” — Mayamatam',
    source: 'Mayamatam, Ch. 12',
    colorTheme: {
      bg: 'from-[#3A220F] to-[#251408]',
      border: 'border-[#E88A16]',
      accent: '#FFB74D',
      highlight: 'rgba(232, 138, 22, 0.5)'
    }
  },
  {
    id: 'E',
    code: 'E',
    name: 'Purva',
    sanskrit: 'पूर्व',
    direction: 'East',
    col: 2,
    row: 1,
    element: 'Solar Light & Fire (सूर्य / तेजस्)',
    elementIconName: 'fire',
    deity: 'Indra (King of Devas) & Surya (Sun God)',
    purushaAnatomy: {
      part: 'Right Hand & Arm',
      sanskritPart: 'दक्षिणहस्तः (Dakshina-Hasta)',
      description: 'The right hand of the Purusha greeting the morning sun, channeling solar prana into life vitality and purposeful action.',
      significance: 'Directly absorbs ultraviolet and beneficial infrared spectrums of dawn; governs physical health and social influence.'
    },
    attributes: 'Solar vitality, leadership, enlightenment, righteous governance, life force',
    recommendation: 'Main entrance portico, spacious veranda, morning tea terrace, expansive windows, living room',
    caution: 'Avoid tall boundary walls or opaque utility sheds that obstruct early dawn sunlight and fresh east breeze',
    classicalQuote: '“पूर्वे सूर्यस्य सामीप्यं प्राणिनां प्राणवर्धनम्॥” — Bṛhat Saṃhitā',
    source: 'Bṛhat Saṃhitā, Ch. 53',
    colorTheme: {
      bg: 'from-[#3B1F0A] to-[#261305]',
      border: 'border-[#FFA726]',
      accent: '#FFCC80',
      highlight: 'rgba(255, 167, 38, 0.4)'
    }
  },
  {
    id: 'SW',
    code: 'SW',
    name: 'Nairutya',
    sanskrit: 'नैऋत्य',
    direction: 'South-West',
    col: 0,
    row: 2,
    element: 'Heavy Earth (पृथ्वी · Prithvi)',
    elementIconName: 'earth',
    deity: 'Nirriti (Lord of Dissolution & Foundational Stability)',
    purushaAnatomy: {
      part: 'Feet & Base of Spine',
      sanskritPart: 'पादौ (Padau)',
      description: 'The feet and base of the Purusha firmly anchored into the earth, bearing the entire gravitational posture of the body.',
      significance: 'Must be the highest in level, thickest in walls, and heaviest in structural weight to ensure rock-solid stability.'
    },
    attributes: 'Anchorage, supreme authority, financial retention, deep regenerative sleep',
    recommendation: 'Master bedroom for head of family/CEO, highest building elevation, heavy master wardrobes, structural mass',
    caution: 'Never dig underground water sumps, wells, basements, or place the main entrance here (leads to continuous instability)',
    classicalQuote: '“नैऋत्ये स्वामिनो वासः स्थैर्यं कीर्तिश्च वर्धते॥” — Samarāṅgaṇa Sūtradhāra',
    source: 'Samarāṅgaṇa Sūtradhāra, Ch. 18',
    colorTheme: {
      bg: 'from-[#33180D] to-[#1E0D06]',
      border: 'border-[#B94E2C]',
      accent: '#FF8A65',
      highlight: 'rgba(185, 78, 44, 0.5)'
    }
  },
  {
    id: 'S',
    code: 'S',
    name: 'Dakshina',
    sanskrit: 'दक्षिण',
    direction: 'South',
    col: 1,
    row: 2,
    element: 'Earth & Thermal Fire (पृथ्वी / अग्नि)',
    elementIconName: 'earth',
    deity: 'Yama (Lord of Dharma, Justice & Restraint)',
    purushaAnatomy: {
      part: 'Right Thigh & Knees',
      sanskritPart: 'दक्षिणोरू (Dakshinoru)',
      description: 'The right thigh and knees supporting the foundational stance of the Purusha under midday heat.',
      significance: 'Shields the dwelling from harsh south afternoon radiation and preserves accumulated energy and resources.'
    },
    attributes: 'Discipline, justice, fame, longevity, protection against external depletion',
    recommendation: 'Secondary bedrooms, heavy machinery, overhead storage lofts, elevated boundary walls',
    caution: 'Avoid deep sunken depressions, water sumps, open swimming pools, or low boundary fences on the south',
    classicalQuote: '“दक्षिणे यमराजा च शयनाय प्रशस्यते॥” — Mānasāra',
    source: 'Mānasāra, Ch. 14',
    colorTheme: {
      bg: 'from-[#3A1414] to-[#240A0A]',
      border: 'border-[#EF5350]',
      accent: '#E57373',
      highlight: 'rgba(239, 83, 80, 0.4)'
    }
  },
  {
    id: 'SE',
    code: 'SE',
    name: 'Agneya',
    sanskrit: 'आग्नेय',
    direction: 'South-East',
    col: 2,
    row: 2,
    element: 'Fire (अग्नि · Agni)',
    elementIconName: 'fire',
    deity: 'Agni Deva (The Sacred Fire)',
    purushaAnatomy: {
      part: 'Solar Plexus & Stomach (Digestive Fire)',
      sanskritPart: 'जठराग्निः (Jathara-Agni)',
      description: 'The digestive solar plexus of the Purusha transforming raw matter into nourishment and metabolic energy.',
      significance: 'Governs all combustion, culinary prep, thermal equipment, and metabolic vitality of the inhabitants.'
    },
    attributes: 'Transformation, energetic action, culinary vitality, metabolic fire',
    recommendation: 'Kitchen culinary hearth (cook facing East), electrical switchboards, boiler units, inverters, transformers',
    caution: 'Strictly avoid water sumps, wells, master bedrooms, or damp storage (water destroys fire, causing health disorders)',
    classicalQuote: '“आग्नेये पचनस्थानं ज्वलनस्य च कीर्तितम्॥” — Bṛhat Saṃhitā',
    source: 'Bṛhat Saṃhitā, Ch. 53',
    colorTheme: {
      bg: 'from-[#421706] to-[#260B02]',
      border: 'border-[#FF7043]',
      accent: '#FFAB91',
      highlight: 'rgba(255, 112, 67, 0.5)'
    }
  }
];

export const VastuMandala: React.FC<VastuMandalaProps> = ({ onNavigate }) => {
  const [selectedZoneId, setSelectedZoneId] = useState<string>('CENTER');
  const [showPurushaOverlay, setShowPurushaOverlay] = useState<boolean>(true);
  const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null);

  const activeZoneId = hoveredZoneId || selectedZoneId;
  const currentZone = MANDALA_9_ZONES.find((z) => z.id === activeZoneId) || MANDALA_9_ZONES[4];

  // Helper for rendering element icons
  const renderElementIcon = (type: MandalaZoneData['elementIconName'], className = 'w-4 h-4') => {
    switch (type) {
      case 'water':
        return <Droplets className={className} />;
      case 'fire':
        return <Flame className={className} />;
      case 'air':
        return <Wind className={className} />;
      case 'earth':
        return <Mountain className={className} />;
      case 'space':
        return <Sparkles className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  return (
    <div className="section-teal-heritage rounded-3xl p-6 sm:p-10 border-2 border-[#D4A72C] shadow-2xl golden-aura-glow text-[#FFF7ED] relative overflow-hidden">
      {/* Decorative Traditional Corner Accents */}
      <div className="absolute top-4 left-4 text-[#D4A72C]/40 text-xs font-serif tracking-widest hidden sm:block select-none">
        ॥ नवखण्ड वास्तु मण्डल ॥
      </div>
      <div className="absolute top-4 right-4 text-[#D4A72C]/40 text-xs font-serif tracking-widest hidden sm:block select-none">
        ॥ वास्तु पुरुष सन्निधानम् ॥
      </div>

      {/* Header & Context */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1A0F0A]/60 border border-[#D4A72C]/50 text-xs font-serif uppercase tracking-widest text-[#D4A72C] font-bold">
          <Compass className="w-3.5 h-3.5 text-[#E88A16]" />
          <span>Interactive 9-Fold Vastu Mandala (Navakhanda)</span>
        </div>

        <h2 className="font-['Cinzel_Decorative'] text-2xl sm:text-3xl md:text-4xl text-[#FFF7ED] font-black leading-tight drop-shadow-md">
          Spatial Zones & The Living Vastu Purusha
        </h2>

        <p className="font-['Marcellus'] text-[#E8D3A8] text-sm sm:text-base leading-relaxed">
          Hover or tap on any spatial zone below to understand how the classical 9-fold grid aligns the <strong className="text-[#FFF7ED]">Vastu Purusha (Cosmic Dwelling Presence)</strong> with elemental forces, directional deities, and human well-being.
        </p>

        {/* View Mode Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setShowPurushaOverlay(!showPurushaOverlay)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-serif font-bold transition-all flex items-center gap-2 cursor-pointer border ${
              showPurushaOverlay
                ? 'bg-[#E88A16] text-[#2D1B14] border-[#D4A72C] shadow-md shadow-[#E88A16]/30'
                : 'bg-[#2D1B14]/70 text-[#E8D3A8] border-[#D4A72C]/50 hover:border-[#D4A72C]'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>{showPurushaOverlay ? 'Purusha Anatomy Overlay: ON' : 'Show Purusha Anatomy Overlay'}</span>
          </button>

          <span className="text-xs font-serif text-[#D4A72C]/80 hidden md:inline">
            (North is oriented upward · Head in North-East, Feet in South-West)
          </span>
        </div>
      </div>

      {/* Main Interactive Grid & Detailed Inspector Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (5 cols): The 3x3 Vastu Mandala Interactive Grid */}
        <div className="lg:col-span-6 flex flex-col items-center">
          
          {/* Compass Orientation Indicator */}
          <div className="w-full max-w-[420px] mb-2 flex items-center justify-between text-xs font-serif text-[#D4A72C] px-2 font-bold">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#5A9CB5]" /> NW
            </span>
            <span className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#2D1B14] border border-[#D4A72C]">
              <span>▲ NORTH (उत्तर · Kuber)</span>
            </span>
            <span className="flex items-center gap-1">
              NE <span className="w-2 h-2 rounded-full bg-[#FFD54F]" />
            </span>
          </div>

          {/* The 3x3 Grid Wrapper with Sacred Borders */}
          <div className="relative w-full max-w-[420px] aspect-square rounded-3xl p-3 bg-[#1A0F0A]/90 border-2 border-[#D4A72C] shadow-2xl relative overflow-hidden">
            
            {/* Background SVG Grid Geometry & Vastu Purusha Overlay */}
            <div className="absolute inset-0 pointer-events-none z-0">
              <svg className="w-full h-full" viewBox="0 0 300 300">
                <defs>
                  {/* Subtle golden grid glow */}
                  <filter id="golden-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <linearGradient id="purusha-grad" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFD54F" stopOpacity={showPurushaOverlay ? 0.35 : 0.08} />
                    <stop offset="50%" stopColor="#E88A16" stopOpacity={showPurushaOverlay ? 0.3 : 0.05} />
                    <stop offset="100%" stopColor="#B94E2C" stopOpacity={showPurushaOverlay ? 0.35 : 0.08} />
                  </linearGradient>
                </defs>

                {/* 3x3 Grid Lines */}
                <line x1="100" y1="0" x2="100" y2="300" stroke="#D4A72C" strokeOpacity="0.35" strokeWidth="1.5" />
                <line x1="200" y1="0" x2="200" y2="300" stroke="#D4A72C" strokeOpacity="0.35" strokeWidth="1.5" />
                <line x1="0" y1="100" x2="300" y2="100" stroke="#D4A72C" strokeOpacity="0.35" strokeWidth="1.5" />
                <line x1="0" y1="200" x2="300" y2="200" stroke="#D4A72C" strokeOpacity="0.35" strokeWidth="1.5" />

                {/* Concentric Sacred Mandala Circles */}
                <circle cx="150" cy="150" r="135" fill="none" stroke="#D4A72C" strokeOpacity="0.15" strokeDasharray="3 3" />
                <circle cx="150" cy="150" r="45" fill="none" stroke="#E88A16" strokeOpacity="0.25" />
                
                {/* Diagonal Axis (Ishanya to Nairutya) */}
                <line x1="270" y1="30" x2="30" y2="270" stroke="#D4A72C" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="4 4" />

                {/* Vastu Purusha Classical Silhouette (Head in NE / 250,50, Feet in SW / 50,250) */}
                {showPurushaOverlay && (
                  <g className="transition-opacity duration-500">
                    {/* Head / Agnya in North-East (top-right quadrant) */}
                    <ellipse
                      cx="245"
                      cy="55"
                      rx="26"
                      ry="24"
                      fill="url(#purusha-grad)"
                      stroke="#FFD54F"
                      strokeWidth={activeZoneId === 'NE' ? '2.5' : '1.2'}
                      filter={activeZoneId === 'NE' ? 'url(#golden-glow)' : undefined}
                    />
                    {/* Crown Halo */}
                    <circle cx="245" cy="55" r="32" fill="none" stroke="#FFD54F" strokeOpacity="0.3" strokeDasharray="2 2" />

                    {/* Torso & Spine diagonal line towards center */}
                    <path
                      d="M 230,70 Q 195,115 150,150 Q 105,190 70,230"
                      fill="none"
                      stroke="url(#purusha-grad)"
                      strokeWidth={activeZoneId === 'CENTER' ? '38' : '28'}
                      strokeLinecap="round"
                    />

                    {/* Heart & Navel Lotus in Brahmasthana Center */}
                    <circle
                      cx="150"
                      cy="150"
                      r="20"
                      fill="#E88A16"
                      fillOpacity={activeZoneId === 'CENTER' ? '0.6' : '0.25'}
                      stroke="#D4A72C"
                      strokeWidth={activeZoneId === 'CENTER' ? '2.5' : '1'}
                      filter={activeZoneId === 'CENTER' ? 'url(#golden-glow)' : undefined}
                    />

                    {/* Right Arm extending to North-West & East */}
                    <path
                      d="M 195,100 Q 160,50 90,60"
                      fill="none"
                      stroke="url(#purusha-grad)"
                      strokeWidth="12"
                      strokeLinecap="round"
                    />

                    {/* Left Arm extending to South-East */}
                    <path
                      d="M 190,120 Q 230,170 240,240"
                      fill="none"
                      stroke="url(#purusha-grad)"
                      strokeWidth="12"
                      strokeLinecap="round"
                    />

                    {/* Feet in South-West (bottom-left quadrant) */}
                    <ellipse
                      cx="55"
                      cy="245"
                      rx="22"
                      ry="18"
                      fill="url(#purusha-grad)"
                      stroke="#B94E2C"
                      strokeWidth={activeZoneId === 'SW' ? '2.5' : '1.2'}
                      filter={activeZoneId === 'SW' ? 'url(#golden-glow)' : undefined}
                    />
                  </g>
                )}
              </svg>
            </div>

            {/* 3x3 Interactive Clickable / Hoverable Cells */}
            <div className="grid grid-cols-3 grid-rows-3 gap-2 w-full h-full relative z-10">
              {MANDALA_9_ZONES.map((zone) => {
                const isSelected = activeZoneId === zone.id;
                const isCenter = zone.id === 'CENTER';

                return (
                  <button
                    key={zone.id}
                    onClick={() => setSelectedZoneId(zone.id)}
                    onMouseEnter={() => setHoveredZoneId(zone.id)}
                    onMouseLeave={() => setHoveredZoneId(null)}
                    aria-label={`Zone ${zone.name} (${zone.direction})`}
                    className={`relative rounded-2xl p-2 sm:p-2.5 flex flex-col justify-between text-left transition-all duration-300 cursor-pointer overflow-hidden border ${
                      zone.colorTheme.border
                    } ${
                      isSelected
                        ? 'ring-2 ring-[#FFD54F] scale-102 shadow-2xl z-20 ' + zone.colorTheme.border
                        : 'opacity-90 hover:opacity-100 hover:scale-101'
                    } bg-gradient-to-br ${zone.colorTheme.bg}`}
                    style={{
                      boxShadow: isSelected ? `0 0 25px ${zone.colorTheme.highlight}` : undefined,
                    }}
                  >
                    {/* Top Row in Cell: Direction & Element Icon */}
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[11px] sm:text-xs font-bold font-mono px-1.5 py-0.5 rounded bg-black/40 text-[#FFF7ED] border border-white/20">
                        {zone.code}
                      </span>
                      <div
                        className="p-1 rounded-full bg-black/30 text-white/90"
                        title={zone.element}
                      >
                        {renderElementIcon(zone.elementIconName, 'w-3 h-3 sm:w-3.5 sm:h-3.5')}
                      </div>
                    </div>

                    {/* Center Zone Name & Sanskrit */}
                    <div className="my-auto py-1">
                      <span className="font-['Cinzel_Decorative'] font-bold text-xs sm:text-sm text-[#FFF7ED] block truncate">
                        {zone.name}
                      </span>
                      <span className="font-['Yatra_One'] text-[11px] sm:text-xs text-[#D4A72C] block">
                        {zone.sanskrit}
                      </span>
                    </div>

                    {/* Bottom Pill: Purusha Anatomical Link */}
                    <div className="w-full text-[10px] sm:text-[11px] font-serif text-[#FFF7ED]/85 truncate border-t border-white/10 pt-1 flex items-center justify-between">
                      <span className="truncate">{zone.purushaAnatomy.sanskritPart.split(' ')[0]}</span>
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FFD54F] animate-ping" />
                      )}
                    </div>

                    {/* Active Golden Corner Accent */}
                    {isSelected && (
                      <div className="absolute top-0 right-0 w-3 h-3 bg-[#FFD54F] rounded-bl-lg" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Compass Orientation Indicator Bottom */}
          <div className="w-full max-w-[420px] mt-2 flex items-center justify-between text-xs font-serif text-[#D4A72C] px-2 font-bold">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#FF8A65]" /> SW
            </span>
            <span className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#2D1B14] border border-[#D4A72C]">
              <span>▼ SOUTH (दक्षिण · Yama)</span>
            </span>
            <span className="flex items-center gap-1">
              SE <span className="w-2 h-2 rounded-full bg-[#FF7043]" />
            </span>
          </div>

          <p className="text-[11px] text-[#E8D3A8]/80 font-serif mt-3 text-center">
            Tip: Click or hover over any quadrant to inspect its architectural recommendations and classical Vastu Purusha anatomy.
          </p>
        </div>

        {/* Right Column (7 cols): Rich Zone Inspector Card */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#2D1B14] rounded-3xl p-6 sm:p-8 border-2 border-[#D4A72C] shadow-2xl relative overflow-hidden text-left">
            
            {/* Top Bar: Sanskrit Direction & Deity Badges */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D4A72C]/40 pb-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-[#E88A16] text-[#2D1B14] font-mono font-bold text-xs">
                    {currentZone.direction} ({currentZone.code})
                  </span>
                  <span className="font-['Yatra_One'] text-lg text-[#D4A72C]">
                    {currentZone.sanskrit}
                  </span>
                </div>
                <h3 className="font-['Cinzel_Decorative'] text-2xl sm:text-3xl text-[#FFF7ED] font-black mt-1">
                  {currentZone.name}
                </h3>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-[11px] font-serif uppercase tracking-wider text-[#D4A72C]">
                  Presiding Cosmic Deity
                </span>
                <span className="font-['Rozha_One'] text-sm sm:text-base text-[#FFF7ED]">
                  {currentZone.deity}
                </span>
              </div>
            </div>

            {/* Element & Purusha Anatomical Link (Crucial user requirement) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              
              {/* Element Card */}
              <div className="p-3.5 rounded-2xl bg-[#1A0F0A]/80 border border-[#D4A72C]/50 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#E88A16]/20 text-[#E88A16] border border-[#E88A16]/40 mt-0.5 shrink-0">
                  {renderElementIcon(currentZone.elementIconName, 'w-5 h-5')}
                </div>
                <div>
                  <span className="text-[11px] font-serif text-[#D4A72C] uppercase tracking-wider block font-bold">
                    Pancha Mahabhuta
                  </span>
                  <span className="text-sm font-['Marcellus'] text-[#FFF7ED] font-bold">
                    {currentZone.element}
                  </span>
                  <span className="text-xs text-[#E8D3A8] block mt-0.5">
                    {currentZone.attributes}
                  </span>
                </div>
              </div>

              {/* Vastu Purusha Anatomical Link Card */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#3B1F0A]/90 to-[#2D1B14] border border-[#E88A16] flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#FFD54F]/20 text-[#FFD54F] border border-[#FFD54F]/40 mt-0.5 shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-serif text-[#FFD54F] uppercase tracking-wider block font-bold">
                      Purusha Anatomy
                    </span>
                    <span className="text-[11px] font-['Yatra_One'] text-[#D4A72C]">
                      {currentZone.purushaAnatomy.sanskritPart}
                    </span>
                  </div>
                  <span className="text-sm font-['Marcellus'] text-[#FFF7ED] font-bold block">
                    {currentZone.purushaAnatomy.part}
                  </span>
                  <span className="text-xs text-[#E8D3A8] block mt-0.5">
                    {currentZone.purushaAnatomy.description}
                  </span>
                </div>
              </div>
            </div>

            {/* Why This Anatomy Matters in Space */}
            <div className="mb-5 p-3.5 rounded-xl bg-[#1A0F0A]/60 border border-[#D4A72C]/40 text-xs sm:text-sm font-['Marcellus'] text-[#E8D3A8] leading-relaxed">
              <span className="text-[#D4A72C] font-bold block mb-1 font-serif uppercase tracking-wider text-[11px]">
                ✦ Spatial-Anatomical Principle:
              </span>
              {currentZone.purushaAnatomy.significance}
            </div>

            {/* Architectural Recommendations vs Cautions */}
            <div className="space-y-3 mb-5">
              {/* Recommendations */}
              <div className="p-3.5 rounded-2xl bg-[#0F5C55]/30 border border-[#26A69A]/60">
                <div className="flex items-center gap-2 text-xs font-bold font-serif text-[#4DB6AC] uppercase tracking-wider mb-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#26A69A]" />
                  <span>Harmonious Functions (अनुशंसित योजना)</span>
                </div>
                <p className="text-xs sm:text-sm font-['Marcellus'] text-[#FFF7ED] leading-relaxed">
                  {currentZone.recommendation}
                </p>
              </div>

              {/* Cautions */}
              <div className="p-3.5 rounded-2xl bg-[#6B1F1F]/30 border border-[#EF5350]/50">
                <div className="flex items-center gap-2 text-xs font-bold font-serif text-[#E57373] uppercase tracking-wider mb-1.5">
                  <AlertOctagon className="w-4 h-4 text-[#EF5350]" />
                  <span>Classical Cautions & Incompatibilities (वर्ज्यम्)</span>
                </div>
                <p className="text-xs sm:text-sm font-['Marcellus'] text-[#FCA5A5] leading-relaxed">
                  {currentZone.caution}
                </p>
              </div>
            </div>

            {/* Classical Sanskrit Inscription Citation */}
            <div className="border-t border-[#D4A72C]/40 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="italic text-[#D4A72C] font-serif">
                {currentZone.classicalQuote}
                <span className="text-[11px] block not-italic text-[#E8D3A8]/70 mt-0.5">
                  Source: {currentZone.source}
                </span>
              </div>

              {onNavigate && (
                <button
                  onClick={() => onNavigate('what-we-do')}
                  className="px-3.5 py-1.5 rounded-xl bg-[#E88A16] hover:bg-[#D97706] text-[#2D1B14] font-bold text-xs transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  <span>Detailed Guidelines</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

export interface HandbookSeed {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  targetAudience: string;
  pages: number;
  topics: string[];
  summary: string;
  chapters: Array<{
    title: string;
    sanskritTag: string;
    content: string[];
  }>;
}

export const INITIAL_HANDBOOKS_SEED: HandbookSeed[] = [
  {
    id: '1',
    slug: 'vastu-for-contemporary-architects',
    title: 'Vastu for Contemporary Architects',
    subtitle: 'A Field Guide to Seamless Integration with Modern CAD & BIM Workflows',
    targetAudience: 'Architects & Urban Planners',
    pages: 48,
    topics: [
      'Solar Vector Mapping',
      'Brahmasthan in Multi-Story Apartments',
      'Facade Openings vs Dik-Bala',
      'Non-Destructive Layout Optimization',
    ],
    summary:
      'Written specifically for registered architects who want to respect client Vastu sentiments while preserving aesthetic integrity and building code compliance.',
    chapters: [
      {
        title: 'I. The Metaphysical Foundation & Spatial Geometry',
        sanskritTag: 'VASTU PURUSHA MANDALA VINYASA',
        content: [
          'Classical Vastu Vidya as outlined in the Samarangana Sutradhara and Mayamatam is fundamentally an advanced environmental science based on orthogonal coordinate geometry, solar trajectory, and geomagnetism.',
          'The 81-pada (Paramashayika) and 64-pada (Manduka) grids establish energetic zones where functional mass, fenestrations, and openings are balanced to sustain biological vitality and mental clarity in inhabitants.',
          'In contemporary BIM and CAD drafting, the Vastu Purusha Mandala is translated as a parametric coordinate layer overlaid on the structural grid, ensuring load-bearing columns and HVAC cores do not pierce vulnerable marmas (vital intersection nodes).'
        ],
      },
      {
        title: 'II. Solar Vector Mapping & Dik-Bala (Directional Potency)',
        sanskritTag: 'DIG-BALA EVAM SAURA VIKIRANA',
        content: [
          'Ishanya (North-East) represents the ultra-violet, highly energising morning solar wave corridor. Consequently, classical canons strictly mandate low mass, transparent fenestration, and light water features in this quadrant.',
          'Nairutya (South-West) absorbs intense infrared thermal radiation during peak afternoon azimuths. Vastu commands heavy masonry, minimum openings, and maximum structural dead-weight in this zone to prevent thermal destabilisation.',
          'Agni (South-East) and Vayu (North-West) represent thermodynamic conversion and convective ventilation corridors respectively, ideal for electrical hubs and kinetic circulation cores.'
        ],
      },
      {
        title: 'III. Brahmasthan in Multi-Story High-Rise Design',
        sanskritTag: 'BRAHMASTHANA SAMRAKSHANA',
        content: [
          'The central nonic (9 padas of 81-pada grid) is designated as the Brahmasthan--the spatial zero-point and etheric breathing lung of any constructed perimeter.',
          'In modern multi-story residential towers, the Brahmasthan cannot always be a completely open-to-sky courtyard. The shastric solution lies in creating continuous vertical shafts, double-height atriums, or unobstructed living lobbies devoid of structural shear walls and wet-area utility drops.',
          'Preserving luminosity and air passage in the central zone prevents sick building syndrome and ensures acoustic harmony throughout surrounding apartments.'
        ],
      },
      {
        title: 'IV. Facade Openings, Ayadi Shadvarga & Solutions',
        sanskritTag: 'AYADI SHADVARGA EVAM SHASTRA VIDHANA',
        content: [
          'The Ayadi Shadvarga comprises mathematical formulas (Aya, Vyaya, Yoni, Rashi, Vara, Tithi) that align the gross perimeter dimensions of a dwelling with the astronomical resonant frequencies of the occupants.',
          'Non-destructive remedies allow architects to harmonize flawed existing layouts without breaking load-bearing walls. Interventions include copper helix energy conduits, elemental color balancing, brass thresholds, and intentional material weighting.',
          'By incorporating canonical alignments during the schematic design phase, architects deliver dwellings that satisfy discerning clients without compromising contemporary design languages.'
        ],
      },
    ],
  },
  {
    id: '2',
    slug: 'homebuyers-vastu-checklist',
    title: "The Informed Homebuyer's Vastu Checklist",
    subtitle: 'What to Observe Before Signing Property Deeds',
    targetAudience: 'Home Buyers & Real Estate Investors',
    pages: 36,
    topics: [
      'Evaluating Main Entrance Pada',
      'Slope & Drainage Verification',
      'Surrounding Negative Structures',
      'Separating Remediable Flaws from Critical Defects',
    ],
    summary:
      'A transparent, easy-to-follow guide to protect your life savings from high-risk property purchases without being misled by sensationalist claims.',
    chapters: [
      {
        title: 'I. The Main Entrance (Maha-Dwara) Pada Verification',
        sanskritTag: 'MAHADWARA PADA VISHLESHANA',
        content: [
          'Contrary to common superstition, not all South-facing or West-facing properties are unfavorable. Classical texts divide each perimeter direction into 8 equal entrance zones called Padas.',
          'In the North: Mukhya (3rd pada) and Bhallata (4th pada) yield exceptional prosperity and intellectual growth.',
          'In the East: Jayanta (3rd pada) and Indra (4th pada) bring societal recognition and leadership vitality.',
          'In the South: Vitatha (3rd pada) and Grihakshata (4th pada) are highly praised for discipline, courage, and executive success.',
          'In the West: Pushpadanta (3rd pada) and Varuna (4th pada) facilitate substantial financial accumulation and commercial renown.'
        ],
      },
      {
        title: 'II. Topography, Slope & Water Drainage Dynamics',
        sanskritTag: 'BHOOMI DHALA EVAM JALA NIKASI',
        content: [
          'The natural gradient of the land determines how subtle bio-energies flow across the property. An ideal plot slopes toward the North-East, allowing rainwater and solar vectors to nourish the dwelling.',
          'Beware of high-risk plots where the land drops severely toward the South-West (Nairutya Nimna), which classical treatises correlate with persistent expenditure, chronic fatigue, and emotional instability.',
          'Verify that subterranean water reservoirs or borewells are situated exclusively in the North or North-East, and never under the master bedroom or South-West foundation.'
        ],
      },
      {
        title: 'III. Surrounding Environmental Influences & Veedhi Shula',
        sanskritTag: 'VEEDHI SHULA EVAM BAHYA VEDHA',
        content: [
          'Veedhi Shula refers to a road or alley terminating directly perpendicular to the boundary of a property like an energetic arrow. Certain directional strikes are intensely beneficial, while others disrupt peace.',
          'Inspect proximity to high-voltage transmission towers, hospital morgues, cemetery borders, and dilapidated structures that generate intense disharmony.',
          'Large shadowing structures towering immediately to the North-East block life-giving morning light; conversely, tall buildings to the South-West act as natural windbreakers and protective earth barriers.'
        ],
      },
      {
        title: 'IV. Critical Incurable Defects vs Easily Remediable Flaws',
        sanskritTag: 'DOSHA VARGIKARANA: SADHYA VS ASADHYA',
        content: [
          'Category A (High Severity / Demanding Extreme Caution): Underground water tank or septic tank directly in the South-West or Brahmasthan; toilet core directly in the Ishanya (North-East).',
          'Category B (Easily Remediable with Zero Structural Damage): Minor kitchen placement offsets, color palette discordance, mirror orientation, and bed headboard alignment.',
          'Never permit fear-mongering vendors to persuade you to demolish walls prematurely. Real Vastu wisdom begins with functional understanding, elemental balance, and peaceful discernment.'
        ],
      },
    ],
  },
  {
    id: '3',
    slug: 'industrial-factory-spatial-harmonics',
    title: 'Industrial & Factory Spatial Harmonics',
    subtitle: 'Aligning Heavy Machinery, Substations, and Inventory Logistics',
    targetAudience: 'Plant Managers & Civil Engineers',
    pages: 54,
    topics: [
      'Earth-Bearing Capacity in Nairutya',
      'Hazardous Chemical Storage in Agni',
      'Raw Material Inflow vs Finished Goods Outflow',
      'Workforce Well-being',
    ],
    summary:
      'A practical technical treatise for manufacturing facilities, warehouse logistics, and corporate processing plants.',
    chapters: [
      {
        title: 'I. Structural Weight Allocation & Nairutya Earth Anchoring',
        sanskritTag: 'NAIRUTYA BHARA STHAPANA',
        content: [
          'Industrial manufacturing units thrive on structural stability and consistent operational rhythm. The South-West (Nairutya) represents Prithvi Tattva (Earth Element)--the domain of maximum gravimetric mass.',
          'Heavy stamping presses, CNC fabrication machines, primary generators, overhead crane gantry anchor points, and highest storage silos must be clustered in the Southern and South-Western zones.',
          'Installing massive machinery in the North-East causes severe vibrational dissonance, frequent machine breakdown, and high maintenance costs.'
        ],
      },
      {
        title: 'II. Thermodynamic Corridors & High-Voltage Transformers',
        sanskritTag: 'AGNEYA URJA KENDRA',
        content: [
          'The South-East (Agneya) is governed by Agni Deva and represents all high-temperature and electrical conversion systems.',
          'Main electrical incoming HT substations, steam boilers, furnaces, diesel generator setups, and hot smelting zones operate optimally in the South-East quadrant.',
          'Locating water cooling towers or primary chemical effluent treatment pits in the South-East causes dangerous water-fire elemental clashes, leading to frequent short circuits and worker unrest.'
        ],
      },
      {
        title: 'III. Raw Material Inflow vs Finished Goods Outflow Logistics',
        sanskritTag: 'PRADAKSHINA SAMCHALANA VIDHANA',
        content: [
          'Logistics fluidity mirrors the natural cosmic circulation of Prana. Raw materials and unprocessed inventory should enter via the South or South-West storage bays.',
          'The manufacturing process should flow clockwise (Pradakshina) through processing and assembly stages.',
          'Finished goods, packaging terminals, and final dispatch docks must be situated in the North-West (Vayavya--domain of wind and motion), ensuring swift inventory turnover, rapid client fulfillment, and zero dead stock accumulation.'
        ],
      },
      {
        title: 'IV. Administrative Chambers, Boardrooms & Safety',
        sanskritTag: 'PRASHASANIKA SANKULA EVAM SURAKSHA',
        content: [
          'The Managing Director and Plant Head cabin must be situated in the South-West looking North or East, providing authoritative oversight and strategic foresight.',
          'Accountancy and financial archives reside best in the North (Kuber zone), guarding cash reserves and profitability.',
          'Worker restrooms and dining cafeterias should be located in the North-West or East-South-East. Proper directional ergonomics reduces industrial accidents, boosts morale, and ensures cohesive management.'
        ],
      },
    ],
  },
];

const PROTECTED_STORAGE_DIR = path.resolve(process.cwd(), 'protected_storage', 'handbooks');

export async function ensureHandbookPdf(seed: HandbookSeed): Promise<{
  filePath: string;
  fileName: string;
  fileSizeBytes: number;
}> {
  if (!fs.existsSync(PROTECTED_STORAGE_DIR)) {
    fs.mkdirSync(PROTECTED_STORAGE_DIR, { recursive: true });
  }

  const fileName = `${seed.slug}-official-handbook.pdf`;
  const filePath = path.join(PROTECTED_STORAGE_DIR, fileName);

  // If already exists and is non-empty, return it
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    if (stats.size > 1000) {
      return {
        filePath,
        fileName,
        fileSizeBytes: stats.size,
      };
    }
  }

  // Generate clean, authoritative, multi-page PDF using pdf-lib
  const pdfDoc = await PDFDocument.create();
  const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const timesItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Color palette
  const darkMaroon = rgb(0.42, 0.12, 0.12);
  const goldColor = rgb(0.83, 0.65, 0.17);
  const warmAmber = rgb(0.91, 0.54, 0.09);
  const darkCharcoal = rgb(0.18, 0.11, 0.08);
  const mutedText = rgb(0.35, 0.35, 0.35);
  const pageBg = rgb(0.99, 0.98, 0.96);

  // Helper function to sanitize text for WinAnsi standard font
  function cleanText(str: string): string {
    return (str || '')
      .replace(/[·•]/g, '-')
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'")
      .replace(/[—–]/g, '--')
      .replace(/[^\x20-\x7E]/g, '');
  }

  // Helper function to wrap text
  function wrapText(text: string, maxCharsPerLine: number): string[] {
    const cleaned = cleanText(text);
    const words = cleaned.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      if ((currentLine + ' ' + word).trim().length > maxCharsPerLine) {
        if (currentLine) lines.push(currentLine.trim());
        currentLine = word;
      } else {
        currentLine = (currentLine + ' ' + word).trim();
      }
    }
    if (currentLine) lines.push(currentLine.trim());
    return lines;
  }

  // PAGE 1: COVER PAGE
  const coverPage = pdfDoc.addPage([595.28, 841.89]); // A4
  const { width: pWidth, height: pHeight } = coverPage.getSize();

  // Background tint
  coverPage.drawRectangle({
    x: 0,
    y: 0,
    width: pWidth,
    height: pHeight,
    color: pageBg,
  });

  // Double decorative border
  coverPage.drawRectangle({
    x: 25,
    y: 25,
    width: pWidth - 50,
    height: pHeight - 50,
    borderColor: goldColor,
    borderWidth: 2,
  });
  coverPage.drawRectangle({
    x: 32,
    y: 32,
    width: pWidth - 64,
    height: pHeight - 64,
    borderColor: darkMaroon,
    borderWidth: 1,
  });

  // Top Crest / Organization Header
  coverPage.drawText(cleanText('VASTU RITAM - SHILPA VIDYA SANSTHAN'), {
    x: 95,
    y: pHeight - 80,
    size: 14,
    font: timesBold,
    color: darkMaroon,
  });

  coverPage.drawText(cleanText('AUTHORIZED MONOGRAPH & CLASSICAL REFERENCE MANUAL'), {
    x: 120,
    y: pHeight - 100,
    size: 9,
    font: helveticaBold,
    color: warmAmber,
  });

  // Decorative gold rule
  coverPage.drawLine({
    start: { x: 80, y: pHeight - 115 },
    end: { x: pWidth - 80, y: pHeight - 115 },
    thickness: 1.5,
    color: goldColor,
  });

  // Target Audience Badge
  coverPage.drawRectangle({
    x: 70,
    y: pHeight - 170,
    width: 250,
    height: 24,
    color: darkMaroon,
  });
  coverPage.drawText(cleanText(`TARGET AUDIENCE: ${seed.targetAudience.toUpperCase()}`), {
    x: 82,
    y: pHeight - 163,
    size: 8.5,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });

  // Title
  const titleLines = wrapText(seed.title, 34);
  let yTitle = pHeight - 230;
  for (const line of titleLines) {
    coverPage.drawText(cleanText(line), {
      x: 70,
      y: yTitle,
      size: 26,
      font: timesBold,
      color: darkCharcoal,
    });
    yTitle -= 34;
  }

  // Subtitle
  const subtitleLines = wrapText(seed.subtitle, 48);
  let ySubtitle = yTitle - 15;
  for (const line of subtitleLines) {
    coverPage.drawText(cleanText(line), {
      x: 70,
      y: ySubtitle,
      size: 13,
      font: timesItalic,
      color: darkMaroon,
    });
    ySubtitle -= 20;
  }

  // Summary box
  coverPage.drawRectangle({
    x: 70,
    y: ySubtitle - 110,
    width: pWidth - 140,
    height: 95,
    color: rgb(0.96, 0.94, 0.9),
    borderColor: goldColor,
    borderWidth: 1,
  });

  coverPage.drawText(cleanText('TREATISE SYNOPSIS & SCOPE:'), {
    x: 85,
    y: ySubtitle - 35,
    size: 9,
    font: helveticaBold,
    color: darkMaroon,
  });

  const summaryLines = wrapText(seed.summary, 70);
  let ySum = ySubtitle - 55;
  for (const line of summaryLines) {
    coverPage.drawText(cleanText(line), {
      x: 85,
      y: ySum,
      size: 10,
      font: timesRoman,
      color: darkCharcoal,
    });
    ySum -= 16;
  }

  // Included Modules list
  coverPage.drawText(cleanText('CURATED SHULBA & SHILPA TOPICS COVERED:'), {
    x: 70,
    y: ySubtitle - 140,
    size: 10,
    font: helveticaBold,
    color: darkMaroon,
  });

  let yTopic = ySubtitle - 165;
  for (const t of seed.topics) {
    coverPage.drawCircle({
      x: 80,
      y: yTopic + 4,
      size: 3,
      color: warmAmber,
    });
    coverPage.drawText(cleanText(t), {
      x: 95,
      y: yTopic,
      size: 11,
      font: timesRoman,
      color: darkCharcoal,
    });
    yTopic -= 22;
  }

  // Folio pages badge & verification seal
  coverPage.drawRectangle({
    x: 70,
    y: 70,
    width: pWidth - 140,
    height: 60,
    borderColor: goldColor,
    borderWidth: 1,
    color: rgb(0.98, 0.96, 0.92),
  });

  coverPage.drawText(cleanText(`OFFICIAL COMPILATION - ${seed.pages} FOLIO PAGES - PEER REVIEWED`), {
    x: 100,
    y: 105,
    size: 9.5,
    font: helveticaBold,
    color: darkMaroon,
  });

  coverPage.drawText(cleanText('Vastu Ritam Research Foundation - Institute of Sacred Vedic Architecture'), {
    x: 105,
    y: 85,
    size: 9,
    font: timesItalic,
    color: mutedText,
  });

  // CHAPTER PAGES
  for (let cIdx = 0; cIdx < seed.chapters.length; cIdx++) {
    const chapter = seed.chapters[cIdx];
    const page = pdfDoc.addPage([595.28, 841.89]);

    // Border
    page.drawRectangle({
      x: 30,
      y: 30,
      width: pWidth - 60,
      height: pHeight - 60,
      borderColor: goldColor,
      borderWidth: 1,
    });

    // Running Header
    page.drawText(cleanText('VASTU RITAM - CLASSICAL MONOGRAPHS & FIELD GUIDES'), {
      x: 45,
      y: pHeight - 55,
      size: 8,
      font: helveticaBold,
      color: darkMaroon,
    });

    page.drawText(cleanText(`${seed.title.toUpperCase()}`), {
      x: pWidth - 260,
      y: pHeight - 55,
      size: 7.5,
      font: helvetica,
      color: mutedText,
    });

    page.drawLine({
      start: { x: 45, y: pHeight - 62 },
      end: { x: pWidth - 45, y: pHeight - 62 },
      thickness: 0.8,
      color: goldColor,
    });

    // Chapter Number and Sanskrit Title
    page.drawText(cleanText(chapter.sanskritTag), {
      x: 50,
      y: pHeight - 95,
      size: 11,
      font: timesItalic,
      color: warmAmber,
    });

    page.drawText(cleanText(chapter.title), {
      x: 50,
      y: pHeight - 120,
      size: 15,
      font: timesBold,
      color: darkMaroon,
    });

    page.drawLine({
      start: { x: 50, y: pHeight - 130 },
      end: { x: 280, y: pHeight - 130 },
      thickness: 1.5,
      color: goldColor,
    });

    // Chapter Content paragraphs
    let yPos = pHeight - 165;
    for (const paragraph of chapter.content) {
      const wrapped = wrapText(paragraph, 66);
      for (const line of wrapped) {
        if (yPos < 70) break;
        page.drawText(cleanText(line), {
          x: 50,
          y: yPos,
          size: 10.5,
          font: timesRoman,
          color: darkCharcoal,
        });
        yPos -= 17;
      }
      yPos -= 14; // Paragraph gap
    }

    // Callout box on each chapter
    if (yPos > 170) {
      page.drawRectangle({
        x: 50,
        y: yPos - 85,
        width: pWidth - 100,
        height: 75,
        color: rgb(0.97, 0.95, 0.9),
        borderColor: goldColor,
        borderWidth: 1,
      });

      page.drawText(cleanText('SHILPA SHASTRA COROLLARY & ARCHITECTURAL AXIOM:'), {
        x: 65,
        y: yPos - 25,
        size: 8.5,
        font: helveticaBold,
        color: darkMaroon,
      });

      const axiomText =
        '"Prasade sadane vaapi sargadau yadi nirmite, Vastu-deva-prasidena samridhir jayate dhruvam." -- Alignment with spatial vectors nurtures biological equanimity and perpetual organizational growth.';
      const axiomWrapped = wrapText(axiomText, 68);
      let yAx = yPos - 45;
      for (const axLine of axiomWrapped) {
        page.drawText(cleanText(axLine), {
          x: 65,
          y: yAx,
          size: 9.5,
          font: timesItalic,
          color: darkCharcoal,
        });
        yAx -= 15;
      }
    }

    // Running Footer
    page.drawLine({
      start: { x: 45, y: 55 },
      end: { x: pWidth - 45, y: 55 },
      thickness: 0.8,
      color: goldColor,
    });

    page.drawText(cleanText('Vastu Ritam Digital Archive - Confidential Client Copy'), {
      x: 45,
      y: 42,
      size: 7.5,
      font: helvetica,
      color: mutedText,
    });

    page.drawText(cleanText(`Folio Page ${cIdx + 2} of ${seed.chapters.length + 1}`), {
      x: pWidth - 140,
      y: 42,
      size: 8,
      font: helveticaBold,
      color: darkMaroon,
    });
  }

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(filePath, Buffer.from(pdfBytes));

  const stats = fs.statSync(filePath);
  return {
    filePath,
    fileName,
    fileSizeBytes: stats.size,
  };
}

export async function initializeAllHandbookPdfs(): Promise<void> {
  for (const seed of INITIAL_HANDBOOKS_SEED) {
    try {
      await ensureHandbookPdf(seed);
    } catch (err) {
      console.error(`Failed to initialize PDF for handbook ${seed.id}:`, err);
    }
  }
}

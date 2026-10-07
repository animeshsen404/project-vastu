import { PageType } from '../types';
import {
  Compass,
  Sparkles,
  PhoneCall,
  GraduationCap,
  Building,
  BookOpen,
  Home,
  MessageSquareQuote,
  Mail,
  ChevronDown,
  Layers,
  LucideIcon,
} from 'lucide-react';

export interface NavChildItem {
  id: string;
  label: string;
  page: PageType;
  subTab?: string;
  description?: string;
  sanskritLabel?: string;
  badge?: string;
  badgeType?: 'default' | 'accent' | 'interactive';
  icon?: LucideIcon;
  highlight?: boolean;
}

export interface NavDropdownSection {
  title: string;
  sanskritTitle?: string;
  icon?: LucideIcon;
  items: NavChildItem[];
  footerAction?: NavChildItem;
}

export interface NavItemConfig {
  id: string;
  label: string;
  shortLabel?: string;
  page: PageType;
  subTab?: string;
  icon?: LucideIcon;
  sanskritLabel?: string;
  badge?: string;
  activeMatches?: PageType[];
  dropdown?: NavDropdownSection;
}

export interface PrimaryCtaConfig {
  label: string;
  shortLabel: string;
  page: PageType;
  subTab?: string;
  icon: LucideIcon;
  ariaLabel: string;
}

export interface UtilityItemConfig {
  id: string;
  label: string;
  shortLabel?: string;
  icon: LucideIcon;
  title: string;
  type: 'navigation' | 'action';
  page?: PageType;
  subTab?: string;
  actionKey?: 'replayIntro' | 'togglePetals';
}

export interface NavigationConfig {
  mainNav: NavItemConfig[];
  primaryCta: PrimaryCtaConfig;
  utilityItems: UtilityItemConfig[];
  quickDrawerLinks: NavChildItem[];
}

export const NAV_CONFIG: NavigationConfig = {
  // Main Primary Navigation Tabs (Desktop Center Nav & Mobile Drawer)
  mainNav: [
    {
      id: 'home',
      label: 'Home',
      page: 'home',
      icon: Home,
    },
    {
      id: 'discover',
      label: 'Discover Vastu Ritam',
      shortLabel: 'Discover',
      page: 'discover',
      icon: GraduationCap,
      dropdown: {
        title: 'Origins & Epistemology',
        icon: GraduationCap,
        items: [
          {
            id: 'meaning',
            label: 'The Meaning (वास्तु + रितम्)',
            page: 'discover',
            subTab: 'meaning',
            sanskritLabel: 'वास्तु + रितम्',
          },
          {
            id: 'philosophy',
            label: 'Our Philosophy (3 Principles)',
            page: 'discover',
            subTab: 'philosophy',
          },
          {
            id: 'why-us',
            label: 'Why Vastu Ritam?',
            page: 'discover',
            subTab: 'why-us',
          },
          {
            id: 'collaborators',
            label: 'Our Collaborators',
            page: 'discover',
            subTab: 'collaborators',
          },
          {
            id: 'mission-vision',
            label: 'Mission & Vision',
            page: 'discover',
            subTab: 'mission-vision',
          },
          {
            id: 'founder',
            label: 'Founder & Research Scholar',
            page: 'discover',
            subTab: 'founder',
          },
        ],
        footerAction: {
          id: 'emblem',
          label: 'Our Emblem · Identity',
          page: 'discover',
          subTab: 'emblem',
          icon: Sparkles,
          badge: 'Interactive',
          badgeType: 'interactive',
          highlight: true,
        },
      },
    },
    {
      id: 'what-we-do',
      label: 'What We Do',
      page: 'what-we-do',
      icon: Building,
      dropdown: {
        title: 'Consultation Services',
        icon: Building,
        items: [
          {
            id: 'residential',
            label: 'Residential Vastu',
            page: 'what-we-do',
            subTab: 'residential',
          },
          {
            id: 'commercial',
            label: 'Commercial Vastu',
            page: 'what-we-do',
            subTab: 'commercial',
          },
          {
            id: 'industrial',
            label: 'Industrial Vastu',
            page: 'what-we-do',
            subTab: 'industrial',
          },
          {
            id: 'before-you-buy',
            label: 'Vastu Before You Buy',
            page: 'what-we-do',
            subTab: 'before-you-buy',
          },
        ],
        footerAction: {
          id: 'consultation',
          label: 'Consult Vastu Ritam',
          page: 'what-we-do',
          subTab: 'consultation',
          icon: PhoneCall,
          highlight: true,
        },
      },
    },
    {
      id: 'gyan-kosh',
      label: 'Vastu Gyan-Kosh',
      shortLabel: 'Gyan-Kosh',
      page: 'gyan-kosh',
      icon: BookOpen,
      activeMatches: ['gyan-kosh', 'knowledge', 'topics', 'categories'],
      dropdown: {
        title: 'Knowledge Repository',
        icon: BookOpen,
        items: [
          {
            id: 'all-articles',
            label: 'Canonical Treatises (All Articles)',
            page: 'knowledge',
            badge: 'Archive →',
            badgeType: 'accent',
            highlight: true,
          },
          {
            id: 'topics',
            label: 'Topics & Canonical Entities',
            page: 'topics',
            sanskritLabel: 'देवता / स्थान',
          },
          {
            id: 'categories',
            label: 'Knowledge Classifications',
            page: 'categories',
            sanskritLabel: 'वर्ग',
          },
          {
            id: 'shabd-kosh',
            label: 'Vastu Shabd-Kosh (Dictionary)',
            page: 'gyan-kosh',
            subTab: 'shabd-kosh',
            sanskritLabel: 'शब्दकोश',
          },
          {
            id: 'prakaran',
            label: 'Prakaran (Scholarly Treatises)',
            page: 'gyan-kosh',
            subTab: 'prakaran',
            sanskritLabel: 'प्रकरण',
          },
          {
            id: 'handbooks',
            label: 'Handbooks & Guides',
            page: 'gyan-kosh',
            subTab: 'handbooks',
          },
          {
            id: 'videos',
            label: 'Videos & Visual Learning',
            page: 'gyan-kosh',
            subTab: 'videos',
          },
        ],
        footerAction: {
          id: 'myths',
          label: 'Vastu Myths & Misconceptions',
          page: 'gyan-kosh',
          subTab: 'myths',
          icon: Sparkles,
          highlight: true,
        },
      },
    },
    {
      id: 'compass',
      label: 'Vastu Compass',
      shortLabel: 'Compass',
      page: 'compass',
      icon: Compass,
      sanskritLabel: 'दिक्-साधन चक्र',
      badge: 'Interactive Tool',
    },
    {
      id: 'testimonials',
      label: 'Testimonials',
      page: 'testimonials',
      icon: MessageSquareQuote,
    },
    {
      id: 'contact',
      label: 'Contact',
      page: 'contact',
      icon: Mail,
    },
  ],

  // Primary Call-To-Action Button
  primaryCta: {
    label: 'Consult Vastu Ritam',
    shortLabel: 'Consult',
    page: 'contact',
    subTab: 'consultation',
    icon: PhoneCall,
    ariaLabel: 'Consult Vastu Ritam for Vedic Architectural Assessment',
  },

  // Slender Top Bar Utility Items
  utilityItems: [
    {
      id: 'compass',
      label: 'Compass',
      shortLabel: 'Compass',
      icon: Compass,
      title: 'Digital Vastu Compass (वास्तु दिशा सूचक चक्र)',
      type: 'navigation',
      page: 'compass',
    },
    {
      id: 'entities',
      label: 'Entities',
      shortLabel: 'Entities',
      icon: Layers,
      title: 'Canonical Entities & Topics',
      type: 'navigation',
      page: 'topics',
    },
    {
      id: 'replay-intro',
      label: 'Heavenly Entry',
      shortLabel: 'Intro',
      icon: Sparkles,
      title: 'Replay Heavenly Sanctuary Entry (स्वर्गे प्रवेशः)',
      type: 'action',
      actionKey: 'replayIntro',
    },
    {
      id: 'toggle-petals',
      label: 'Petals',
      shortLabel: 'Petals',
      icon: Layers,
      title: 'Floating Marigold Petals',
      type: 'action',
      actionKey: 'togglePetals',
    },
  ],

  // Quick secondary navigation links shown inside the mobile drawer
  quickDrawerLinks: [
    {
      id: 'quick-compass',
      label: 'Digital Vastu Compass & Matrix',
      page: 'compass',
      badge: 'Interactive',
      sanskritLabel: 'दिक्-साधन चक्र',
    },
    {
      id: 'quick-treatises',
      label: 'Canonical Treatises (All Articles)',
      page: 'knowledge',
      badge: 'Archive →',
    },
    {
      id: 'quick-entities',
      label: 'Topics & Canonical Entities',
      page: 'topics',
      sanskritLabel: 'देवता / स्थान',
    },
    {
      id: 'quick-categories',
      label: 'Knowledge Classifications',
      page: 'categories',
      sanskritLabel: 'वर्ग',
    },
  ],
};

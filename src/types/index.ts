export type Locale = 'en' | 'te';

export type NavId =
  | 'overview'
  | 'templates'
  | 'studio'
  | 'designs'
  | 'moodboards'
  | 'budget'
  | 'decorators'
  | 'bookings'
  | 'settings';

export type LibraryCategory =
  | 'flowers'
  | 'backdrops'
  | 'furniture'
  | 'lighting'
  | 'fabrics'
  | 'props';

export type ThemeId =
  | 'blush-romance'
  | 'ivory-elegance'
  | 'sage-garden'
  | 'royal-gold'
  | 'traditional-marigold';

export type ArrangementStyle = 'cascade' | 'symmetrical' | 'asymmetric' | 'minimal';

export interface LibraryItem {
  id: string;
  name: string;
  category: LibraryCategory;
  color: string;
  accent?: string;
  baseCost: number;
  icon: string;
  description: string;
}

export interface CanvasElement {
  id: string;
  libraryId: string;
  category: LibraryCategory;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
  accent?: string;
  zIndex: number;
}

export interface StudioSettings {
  themeId: ThemeId;
  flowerDensity: number;
  lightingIntensity: number;
  arrangementStyle: ArrangementStyle;
}

export interface VenuePlan {
  enabled: boolean;
  imageDataUrl: string | null;
  widthFt: number;
  depthFt: number;
  showGrid: boolean;
}

export interface Design {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  thumbnailTheme: ThemeId;
  elements: CanvasElement[];
  settings: StudioSettings;
  estimatedBudget: number;
  isFavorite: boolean;
  eventDate?: string;
  notes?: string;
  venuePlan?: VenuePlan;
}

export interface Template {
  id: string;
  name: string;
  themeId: ThemeId;
  style: string;
  eventType: string;
  budgetRange: [number, number];
  description: string;
  tags: string[];
  elements: Omit<CanvasElement, 'id'>[];
  settings: StudioSettings;
  isDemo: true;
}

export interface MoodboardItem {
  id: string;
  title: string;
  colors: string[];
  notes: string;
  tags: string[];
  isFavorite: boolean;
  isDemo: boolean;
  createdAt: string;
}

export interface Decorator {
  id: string;
  name: string;
  city: string;
  specialties: string[];
  rating: number;
  priceBand: '₹' | '₹₹' | '₹₹₹';
  yearsExperience: number;
  bio: string;
  isDemo: true;
}

export interface Booking {
  id: string;
  decoratorId: string;
  decoratorName: string;
  eventDate: string;
  eventType: string;
  venue: string;
  status: 'inquiry' | 'confirmed' | 'completed' | 'cancelled';
  notes: string;
  isDemo: boolean;
  createdAt: string;
  designId?: string;
  designName?: string;
  estimatedBudget?: number;
}

export interface ShareComment {
  id: string;
  author: string;
  body: string;
  createdAt: string;
}

export type ShareStatus = 'pending' | 'approved' | 'changes';

export interface SharedDesign {
  id: string;
  designId: string;
  name: string;
  elements: CanvasElement[];
  settings: StudioSettings;
  venuePlan?: VenuePlan;
  estimatedBudget: number;
  createdAt: string;
  status: ShareStatus;
  comments: ShareComment[];
  approvedAt?: string;
  approvedBy?: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  planned: number;
  spent: number;
}

export interface BudgetPlan {
  id: string;
  eventName: string;
  totalBudget: number;
  categories: BudgetCategory[];
  updatedAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  email: string;
  city: string;
  preferredLanguage: Locale;
}

export interface StudioSnapshot {
  elements: CanvasElement[];
  settings: StudioSettings;
  selectedId: string | null;
}

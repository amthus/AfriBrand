
export type GenerationStyle = 'natural' | 'professional' | 'anime' | 'manga' | '3d-render' | 'illustration';

export interface BrandDNA {
  name: string;
  colors: string[];
  fonts: string[];
  tone: string;
  imageStyle: string;
  keywords: string[];
  localContext: string;
  insights: string[];
  improvements: string[];
  logoUrl?: string; // Brand Guidelines: Logo
  secondaryColors?: string[]; // Brand Guidelines: Secondary Palette
}

export interface Campaign {
  id: string;
  title: string;
  concept: string;
  culturalHook: string;
  cta: string;
  goal: string;
  suggestedPlatforms: string[];
  videoScript?: string;
  scheduledDate?: string;
}

export type AspectRatio = '1:1' | '9:16' | '16:9' | '4:5' | '1.91:1' | '2:3' | '3:4';

export type VideoQualityMode = 'fast' | 'high-quality';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
}

export type SocialPlatform = 'facebook' | 'instagram' | 'whatsapp';

export interface SocialAccount {
  platform: SocialPlatform;
  connected: boolean;
  name?: string;
  lastSync?: string;
}

export type AssetType = 'post' | 'story' | 'banner' | 'video' | 'carousel' | 'gif' | 'flyer' | 'poster' | 'thumbnail';

export interface Asset {
  id: string;
  campaignId: string;
  type: AssetType;
  imageUrl?: string;
  videoUrl?: string;
  gifUrl?: string;
  carouselImages?: string[];
  caption: string;
  headline: string;
  language: string;
  style: GenerationStyle;
  aspectRatio: AspectRatio;
  postedTo?: SocialPlatform[];
  metrics?: {
    reach: number;
    engagement: number;
    conversions: number;
    lastUpdated: string;
  };
  feedback?: {
    rating: number;
    comment: string;
  };
}

export type AppStep = 'landing' | 'auth' | 'welcome' | 'analysis' | 'dna' | 'ideation' | 'assets' | 'editor' | 'calendar' | 'settings' | 'analytics' | 'legal' | 'support' | 'studio';

export interface UserInput {
  businessName: string;
  url: string;
  description: string;
  country: string;
  targetAudience: string;
  demographics?: {
    ageRange: string;
    specificLocations: string[];
    interests: string[];
  };
  campaignGoal: string;
  preferredLanguages: string[];
  currency?: string;
  defaultStyle?: GenerationStyle;
}

export type PreviewPlatform = 'instagram' | 'tiktok' | 'facebook' | 'whatsapp' | 'linkedin' | 'youtube-shorts' | 'youtube' | 'print';

export interface RegionSchedule {
  region: 'West Africa' | 'East Africa' | 'North Africa' | 'Southern Africa' | 'Central Africa';
  bestTimes: string[];
  bestDays: string[];
  platformSpecifics: {
    instagram: string;
    tiktok: string;
    linkedin: string;
    whatsapp: string;
  };
}

export type Role = 'Admin' | 'Editor' | 'Viewer';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
}

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  type: 'creation' | 'connection' | 'edit' | 'export';
}

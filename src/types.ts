export interface Customer {
  id: string;
  name: string;
  email: string;
  age: number;
  location: string;
  income: number;
  profession: string;
  behaviorScore: number; // 0-100
  lastPurchaseDate: string;
}

export interface SegmentFilter {
  ageRange?: [number, number];
  geographicRegion?: string[];
  incomeLevel?: [number, number];
  professions?: string[];
  behaviorMin?: number;
}

export interface Segment {
  id: string;
  name: string;
  websiteUrl?: string;
  filters: SegmentFilter;
  customerCount: number;
  createdAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  segmentId: string;
  status: 'draft' | 'active' | 'completed';
  type: 'email' | 'sms' | 'social';
  performance: {
    sent: number;
    opened: number;
    clicked: number;
    converted: number;
  };
  abTest?: {
    variantA: {
      subject: string;
      conversionRate: number;
    };
    variantB: {
      subject: string;
      conversionRate: number;
    };
  };
  automatedAdjustments: boolean;
}

export interface AnalyticsData {
  daily: {
    date: string;
    impressions: number;
    clicks: number;
    conversions: number;
  }[];
}

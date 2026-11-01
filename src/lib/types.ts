export type Locale = "he" | "ru" | "en";
export const locales: Locale[] = ["he", "ru", "en"];
export type DialValues = {
  temperature: number;
  energy: number;
  landscape: number;
  comfort: number;
};
export type TripOption = {
  id: string;
  title: string;
  destination: string;
  description: string;
  why: string;
  priceMin: number;
  priceMax: number;
  priceUnit: string;
  checks: string[];
  days: number;
  tag: string;
};
export type PlannerResult = {
  options: TripOption[];
  followUps: string[];
  mode: "demo" | "live";
  disclaimer: string;
};
export type RibbonDay = {
  id: string;
  title: string;
  destination: string;
  hotel: "simple" | "boutique";
  price: number;
  distance: number;
  weather: string;
  notes: string;
};
export type Brief = {
  locale: Locale;
  source: string;
  travellerWords: string;
  selections: Record<string, unknown>;
  options?: TripOption[];
  notes: string;
  name?: string;
  contact?: string;
  consent: boolean;
};
export type Lead = {
  id: string;
  createdAt: string;
  source: string;
  status: "new" | "reviewed";
  brief: Brief;
  webhook: "not-configured" | "delivered" | "failed";
};
export type VisaResult = {
  destination: string;
  document: string;
  steps: string[];
  warning: string;
  sourceUrl: string;
  sourceLabel: string;
  mode: "demo" | "live";
};

export type UsageRef = { file: string; line: number; context: string; prop?: string };
export type IndexData = {
  generated: boolean;
  managed: Record<string, UsageRef[]>;
  hardcoded: Array<UsageRef & { text: string }>;
  dynamic: Array<UsageRef & { expression: string; parts: string[]; confidence: 'traceable' | 'review' }>;
};
export type ManagedStore = Record<string, unknown> & { product_name: string; deprecated_terms?: Record<string, string>; indexed?: Record<string, string> };
export type TermsStore = Record<string, any> & { guidelines?: { intro?: string; rules?: Array<{ title: string; body: string }> } };

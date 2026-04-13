export const SCROLL_ZONE_VH = 600;
export const SCROLL_ZONE_SCROLLABLE_FACTOR = 5; // 600vh - 100vh viewport = 5 * innerHeight

// Prefix for public assets — empty in local dev, '/SkyCielo' on GitHub Pages
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
export const asset = (path: string) => `${BASE_PATH}${path}`;

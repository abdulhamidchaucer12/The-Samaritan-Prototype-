export interface CivicCategory {
  id: string;
  name: {
    en: string;
    sw: string;
  };
  isCustom?: boolean;
}

const CATEGORIES_STORAGE_KEY = 'the_samaritan_custom_categories_v1';

export const DEFAULT_CATEGORIES: CivicCategory[] = [
  { id: 'constitution', name: { en: 'Constitution & Bill of Rights', sw: 'Katiba na Hati ya Haki' } },
  { id: 'devolution', name: { en: 'Devolution & County Governance', sw: 'Ugatuzi na Serikali za Kaunti' } },
  { id: 'human_rights', name: { en: 'Fundamental Human Rights', sw: 'Haki za Msingi za Kibinadamu' } },
  { id: 'government', name: { en: 'Government Organs & Separation of Powers', sw: 'Mihimili ya Serikali' } },
  { id: 'elections', name: { en: 'Elections & Citizen Voting', sw: 'Uchaguzi na Upigaji Kura' } },
  { id: 'integrity', name: { en: 'Leadership & Integrity (Chapter Six)', sw: 'Uongozi na Uadilifu (Sura ya Sita)' } },
  { id: 'participation', name: { en: 'Public Participation & Petitions', sw: 'Ushiriki wa Umma na Maombi' } },
];

/**
 * Returns all available course categories (built-in + any custom ones added by admins)
 */
export function getAllCategories(): CivicCategory[] {
  if (typeof window === 'undefined') return DEFAULT_CATEGORIES;

  try {
    const raw = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    const customList: CivicCategory[] = raw ? JSON.parse(raw) : [];

    // Combine default with custom, avoiding duplicates by id
    const map = new Map<string, CivicCategory>();
    DEFAULT_CATEGORIES.forEach((cat) => map.set(cat.id, cat));
    customList.forEach((cat) => map.set(cat.id, cat));

    return Array.from(map.values());
  } catch (err) {
    console.error('Failed to load categories:', err);
    return DEFAULT_CATEGORIES;
  }
}

/**
 * Allows an admin to add any new category that does not already exist.
 */
export function addCustomCategory(nameEn: string, nameSw?: string): CivicCategory {
  const trimmedEn = nameEn.trim();
  if (!trimmedEn) {
    throw new Error('Category name cannot be empty.');
  }

  // Generate a clean slug id
  const slug = trimmedEn
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

  const id = slug || `cat_${Date.now()}`;
  const trimmedSw = nameSw?.trim() || trimmedEn;

  const newCat: CivicCategory = {
    id,
    name: {
      en: trimmedEn,
      sw: trimmedSw,
    },
    isCustom: true,
  };

  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      const customList: CivicCategory[] = raw ? JSON.parse(raw) : [];

      // Check if already exists
      const existingIdx = customList.findIndex((c) => c.id === id);
      if (existingIdx !== -1) {
        customList[existingIdx] = newCat;
      } else {
        customList.push(newCat);
      }

      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(customList));
    } catch (err) {
      console.error('Failed to persist custom category:', err);
    }
  }

  return newCat;
}

/**
 * Formats a category identifier into a readable string in the active language
 */
export function getCategoryLabel(categoryId: string, language: 'en' | 'sw' = 'en'): string {
  const all = getAllCategories();
  const found = all.find((c) => c.id.toLowerCase() === categoryId.toLowerCase());
  if (found) {
    return found.name[language] || found.name.en;
  }

  // Fallback: title case the string
  return categoryId
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

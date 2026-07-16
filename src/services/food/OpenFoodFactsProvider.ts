// LevelOne — OpenFoodFacts food provider
//
// One concrete implementation of FoodProvider. Talks to the public OpenFoodFacts
// search API and normalizes results into FoodSearchResult. All OpenFoodFacts-specific
// parsing/quirks live in this file only — nothing else in the app knows the shape
// of an OpenFoodFacts response.

import { FoodProvider, FoodSearchResult } from './FoodProvider';

const SEARCH_URL = 'https://world.openfoodfacts.org/cgi/search.pl';

interface OpenFoodFactsProduct {
  code?: string;
  product_name?: string;
  brands?: string;
  nutriments?: {
    'energy-kcal_100g'?: number;
    proteins_100g?: number;
    carbohydrates_100g?: number;
    fat_100g?: number;
  };
}

interface OpenFoodFactsResponse {
  products?: OpenFoodFactsProduct[];
}

export class OpenFoodFactsProvider implements FoodProvider {
  async search(query: string): Promise<FoodSearchResult[]> {
    const trimmed = query.trim();
    if (!trimmed) return [];

    const url = new URL(SEARCH_URL);
    url.searchParams.set('search_terms', trimmed);
    url.searchParams.set('search_simple', '1');
    url.searchParams.set('action', 'process');
    url.searchParams.set('json', '1');
    url.searchParams.set('page_size', '20');
    url.searchParams.set(
      'fields',
      'code,product_name,brands,nutriments'
    );

    try {
      const response = await fetch(url.toString());
      if (!response.ok) return [];

      const data = (await response.json()) as OpenFoodFactsResponse;
      const products = data.products ?? [];

      return products
        .filter((p) => p.product_name && p.nutriments?.['energy-kcal_100g'] !== undefined)
        .map((p, index) => ({
          id: p.code ?? `off_${index}_${p.product_name}`,
          name: p.product_name as string,
          brand: p.brands?.split(',')[0]?.trim() || undefined,
          caloriesPer100: round(p.nutriments?.['energy-kcal_100g']),
          proteinPer100: round(p.nutriments?.proteins_100g),
          carbsPer100: round(p.nutriments?.carbohydrates_100g),
          fatPer100: round(p.nutriments?.fat_100g),
        }))
        .slice(0, 20);
    } catch {
      // Network failure, CORS issue, malformed JSON, etc. — never let a food search crash the app.
      return [];
    }
  }
}

function round(value: number | undefined): number {
  return Math.round((value ?? 0) * 10) / 10;
}

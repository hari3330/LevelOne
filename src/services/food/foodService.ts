// LevelOne — foodService
//
// The UI (AddFoodSheet, Nutrition page) imports ONLY from this file, never from a
// provider directly. To switch data sources later — a different API, a bundled local
// database, an on-device cache — implement `FoodProvider` in a new file and change
// the single line below. No component or page needs to be touched.

import { FoodProvider, FoodSearchResult } from './FoodProvider';
import { OpenFoodFactsProvider } from './OpenFoodFactsProvider';

const provider: FoodProvider = new OpenFoodFactsProvider();

export async function searchFood(query: string): Promise<FoodSearchResult[]> {
  return provider.search(query);
}

export type { FoodSearchResult };

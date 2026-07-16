// LevelOne — Food provider contract
//
// This is the ONLY shape the rest of the app knows about. The UI (Nutrition page,
// AddFoodSheet) talks to `foodService`, which talks to whatever `FoodProvider`
// implementation is currently configured. Swapping data sources later (a different
// nutrition API, a local food database, etc.) means writing a new class that
// implements `FoodProvider` and pointing foodService.ts at it — nothing in
// components or pages needs to change.

/** A single food search result, with nutrition normalized to "per 100g/ml". */
export interface FoodSearchResult {
  id: string;
  name: string;
  brand?: string;
  caloriesPer100: number;
  proteinPer100: number;
  carbsPer100: number;
  fatPer100: number;
}

export interface FoodProvider {
  /** Searches for foods matching a free-text query. Must never throw — return [] on failure. */
  search(query: string): Promise<FoodSearchResult[]>;
}

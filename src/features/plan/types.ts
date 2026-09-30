export type MealSlot = 'Desayuno' | 'Almuerzo' | 'Merienda' | 'Cena';
export type MealAvailability = 'ready' | 'missing';

export type PlannedMeal = {
  id: string;
  slot: MealSlot;
  time: string;
  name: string;
  description: string;
  availability: MealAvailability;
  missingIngredients?: string[];
};

export type WeekDay = {
  id: string;
  shortName: string;
  date: string;
  isToday?: boolean;
  plannedMeals: number;
};

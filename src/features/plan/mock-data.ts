import { PlannedMeal, WeekDay } from './types';

export const mockWeek: WeekDay[] = [
  { id: 'mon', shortName: 'Lun', date: '18', plannedMeals: 4 },
  { id: 'tue', shortName: 'Mar', date: '19', plannedMeals: 4 },
  { id: 'wed', shortName: 'Mié', date: '20', isToday: true, plannedMeals: 4 },
  { id: 'thu', shortName: 'Jue', date: '21', plannedMeals: 3 },
  { id: 'fri', shortName: 'Vie', date: '22', plannedMeals: 2 },
  { id: 'sat', shortName: 'Sáb', date: '23', plannedMeals: 1 },
  { id: 'sun', shortName: 'Dom', date: '24', plannedMeals: 0 },
];

export const mockMeals: PlannedMeal[] = [
  {
    id: 'breakfast',
    slot: 'Desayuno',
    time: '08:30',
    name: 'Tostadas con palta y huevo',
    description: '2 porciones · Preparado por Martín',
    availability: 'ready',
  },
  {
    id: 'lunch',
    slot: 'Almuerzo',
    time: '13:30',
    name: 'Tarta de verdura y queso',
    description: 'Almuerzo familiar · 4 porciones',
    availability: 'missing',
    missingIngredients: ['Acelga fresca', 'Huevos x 4'],
  },
  {
    id: 'snack',
    slot: 'Merienda',
    time: '17:30',
    name: 'Yogur con granola',
    description: '1 porción individual rápida',
    availability: 'ready',
  },
  {
    id: 'dinner',
    slot: 'Cena',
    time: '21:00',
    name: 'Sopa cremosa de calabaza',
    description: 'Ligera y reconfortante · 3 porciones',
    availability: 'ready',
  },
];

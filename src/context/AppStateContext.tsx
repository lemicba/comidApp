import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';

export type PantryStatus = 'hay' | 'poco' | 'nohay';
export type StorageLocation = 'Heladera' | 'Freezer' | 'Alacena';

export type PantryItem = {
  id: string;
  name: string;
  location: StorageLocation;
  status: PantryStatus;
  detail: string;
};

export type ShoppingItem = {
  id: string;
  name: string;
  quantity: string;
  source: string;
  purchased: boolean;
  storage?: StorageLocation;
};

type AppState = {
  pantry: PantryItem[];
  shopping: ShoppingItem[];
  addMissingIngredients: () => void;
  addPantryItem: (name: string, location: StorageLocation, status: PantryStatus) => void;
  addShoppingItem: (name: string) => void;
  updatePantryStatus: (id: string, status: PantryStatus) => void;
  markPurchased: (id: string) => void;
  storeShoppingItem: (id: string, location?: StorageLocation) => void;
};

const initialPantry: PantryItem[] = [
  { id: 'eggs', name: 'Huevos', location: 'Heladera', status: 'poco', detail: '6 unidades aprox.' },
  { id: 'cheese', name: 'Queso cremoso', location: 'Heladera', status: 'nohay', detail: 'Se terminó anoche' },
  { id: 'milk', name: 'Leche entera', location: 'Heladera', status: 'hay', detail: '1 sachet cerrado' },
  { id: 'pumpkin', name: 'Calabaza', location: 'Freezer', status: 'hay', detail: '2 porciones listas' },
  { id: 'rice', name: 'Arroz', location: 'Alacena', status: 'hay', detail: 'Frasco lleno' },
  { id: 'oil', name: 'Aceite de oliva', location: 'Alacena', status: 'poco', detail: 'Menos de un cuarto' },
];

const initialShopping: ShoppingItem[] = [
  { id: 'chard', name: 'Acelga fresca', quantity: '2 atados', source: 'Para tarta · miércoles', purchased: false },
  { id: 'eggs-shop', name: 'Huevos', quantity: '1 docena', source: 'Para tarta · miércoles', purchased: false },
  { id: 'cheese-shop', name: 'Queso cremoso', quantity: '500 g', source: 'Casa · no hay', purchased: false },
  { id: 'coffee', name: 'Café molido', quantity: '250 g', source: 'Agregado por Ana', purchased: false },
  { id: 'yogurt', name: 'Yogur natural', quantity: '4 unidades', source: 'Agregado por Martín', purchased: true },
];

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: PropsWithChildren) {
  const [pantry, setPantry] = useState(initialPantry);
  const [shopping, setShopping] = useState(initialShopping);

  const value = useMemo<AppState>(() => ({
    pantry,
    shopping,
    addMissingIngredients: () => {
      setShopping((current) => current.map((item) =>
        item.id === 'chard' || item.id === 'eggs-shop' || item.id === 'cheese-shop'
          ? { ...item, purchased: false }
          : item,
      ));
    },
    addPantryItem: (name, location, status) => {
      setPantry((current) => [...current, {
        id: `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
        name,
        location,
        status,
        detail: status === 'hay' ? 'Agregado recién' : status === 'poco' ? 'Para revisar pronto' : 'Pendiente de compra',
      }]);
    },
    addShoppingItem: (name) => {
      setShopping((current) => [...current, {
        id: `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
        name,
        quantity: 'A definir',
        source: 'Agregado por vos',
        purchased: false,
      }]);
    },
    updatePantryStatus: (id, status) => {
      setPantry((current) => current.map((item) => item.id === id ? { ...item, status } : item));
    },
    markPurchased: (id) => {
      setShopping((current) => current.map((item) => item.id === id ? { ...item, purchased: true } : item));
    },
    storeShoppingItem: (id, location) => {
      const item = shopping.find((candidate) => candidate.id === id);
      setShopping((current) => current.map((candidate) => candidate.id === id ? { ...candidate, storage: location } : candidate));
      if (item && location) {
        setPantry((current) => [...current, {
          id: `stored-${item.id}`,
          name: item.name,
          location,
          status: 'hay',
          detail: `${item.quantity} · Comprado hoy`,
        }]);
      }
    },
  }), [pantry, shopping]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) throw new Error('useAppState debe usarse dentro de AppStateProvider');
  return context;
}

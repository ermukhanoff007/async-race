export type Car = {
  id: number;
  name: string;
  color: string;
};

export type AppState = {
  cars: Car[];
  currentPage: number;
  selectedCar: Car | null;
  winners: Car[];
};

export const state: AppState = {
  cars: [],
  currentPage: 1,
  selectedCar: null,
  winners: [],
};
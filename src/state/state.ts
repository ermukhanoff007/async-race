export type Car = {
  id: number;
  name: string;
  color: string;
};

export type AppState = {
  isRaced: boolean;
  cars: Car[];
  currentPage: number;
  selectedCar: Car | null;
  winners: { car: Car; finishTime: number }[];
};

export const state: AppState = {
  isRaced: false,
  cars: [],
  currentPage: 1,
  selectedCar: null,
  winners: [],
};
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
  winnersPage: number;
  isRaceRunning: boolean;
};

export type Winner = {
  id: number;
  wins: number;
  time: number;
};

export const state: AppState = {
  isRaced: false,
  cars: [],
  currentPage: 1,
  selectedCar: null,
  winners: [],
  winnersPage: 1,
  isRaceRunning: false,
};

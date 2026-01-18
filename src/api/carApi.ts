import type { Car } from "../state/state";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getCars(page = 1, limit = 7): Promise<Car[]> {
  const res = await fetch(`${BASE_URL}/garage?_page=${page}&_limit=${limit}`);

  if (!res.ok) {
    throw new Error(`Failed to fetch cars: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

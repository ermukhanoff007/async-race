import type { Car } from "../state/state";

const BASE_URL: string = (import.meta as any).env.VITE_API_BASE_URL;

export const CARS_PER_PAGE = 7;

export async function carStarted(carId: number): Promise<{ distance: number; velocity: number }> {
  const res = await fetch(`${BASE_URL}/engine?id=${carId}&status=started`, {
    method: "PATCH"
  })
  if (!res.ok) {
    throw new Error(`Failed to start car`);
  }
  return res.json();
}

export async function carStopped(carId: number): Promise<{ distance: number; velocity: number }> {
  const res = await fetch(`${BASE_URL}/engine?id=${carId}&status=stopped`, {
    method: "PATCH"
  })
  if (!res.ok) {
    throw new Error(`Failed to start car`);
  }
  
  return res.json();
}


export async function carDrive(carId: number): Promise<{success: boolean}> {
  const res = await fetch(`${BASE_URL}/engine?id=${carId}&status=drive`, {
    method: "PATCH"
  })
  if(!res.ok) {
    throw new Error(`Failed to drive car`);
  }
  return res.json();
}

export async function getCars(
  page = 1,
  limit = CARS_PER_PAGE
): Promise<{ cars: Car[]; total: number }> {
  const res = await fetch(`${BASE_URL}/garage?_page=${page}&_limit=${limit}`);

  if (!res.ok) {
    throw new Error(`Failed to fetch cars: ${res.status} ${res.statusText}`);
  }
  const cars: Car[] = await res.json();
  const total = Number(res.headers.get("X-Total-Count") ?? cars.length);
  return { cars, total };
}

export async function createCar(car: Omit<Car, 'id'>): Promise<Car> {
  const res = await fetch(`${BASE_URL}/garage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(car),
  });
  if (!res.ok) {
    throw new Error(`Failed to create car: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function updateCar(id: number, car: Partial<Car>): Promise<Car> {
  const res = await fetch(`${BASE_URL}/garage/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(car),
  });

  if (!res.ok) {
    throw new Error(`Failed to update car: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function deleteCar(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/garage/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(`Failed to delete car: ${res.status} ${res.statusText}`);
  }
}

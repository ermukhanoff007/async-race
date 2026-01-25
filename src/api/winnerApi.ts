import type { Car, Winner } from '../state/state.ts';

const viteEnv = import.meta?.env;
const BASE_URL = viteEnv?.VITE_API_BASE_URL ?? process.env.VITE_API_BASE_URL;

export async function getWinner(id: number): Promise<Winner | null> {
  const res = await fetch(`${BASE_URL}/winners/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Winner with ID ${id} not found`);
  }
  return res.json();
}

export async function getCarById(id: number): Promise<Car | null> {
  const res = await fetch(`${BASE_URL}/garage/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Car with ID ${id} not found`);
  }

  return res.json();
}

export async function getWinners(
  page: number,
  limit: number,
): Promise<{ winners: Winner[]; total: number }> {
  const res = await fetch(`${BASE_URL}/winners?_page=${page}&_limit=${limit}`);

  if (!res.ok) throw new Error('Failed to load winners');

  const total = Number(res.headers.get('X-Total-Count') || 0);
  const winners = await res.json();

  return { winners, total };
}

export async function createWinner(id: number, time: number): Promise<Winner> {
  const body = { id, wins: 1, time };

  const res = await fetch(`${BASE_URL}/winners`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  return res.json();
}

export async function updateWinner(id: number, wins: number, time: number): Promise<Winner> {
  const body = { wins, time };

  const res = await fetch(`${BASE_URL}/winners/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  return res.json();
}

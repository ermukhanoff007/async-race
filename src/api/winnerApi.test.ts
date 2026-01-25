import { getWinner, getCarById, getWinners, createWinner, updateWinner } from './winnerApi.ts';

import { jest, describe, it, expect, beforeEach } from '@jest/globals';

jest.mock('../config', () => ({
  BASE_URL: 'http://localhost:3000',
}));

const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
globalThis.fetch = mockFetch;

beforeAll(() => {
  process.env.VITE_API_BASE_URL = 'http://localhost:3000';
});

describe('Winners & Garage API functions', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('getWinner', () => {
    it('returns winner data when found', async () => {
      const mockWinner = { id: 5, wins: 3, time: 12.34 };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockWinner,
      } as Response);

      const result = await getWinner(5);

      expect(result).toEqual(mockWinner);
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/winners/5');
    });

    it('returns null when 404', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response);

      const result = await getWinner(999);

      expect(result).toBeNull();
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/winners/999');
    });

    it('throws error on other non-404 failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response);

      await expect(getWinner(5)).rejects.toThrow('Winner with ID 5 not found');
    });
  });

  describe('getCarById', () => {
    it('returns car data when found', async () => {
      const mockCar = { id: 42, name: 'Ferrari', color: 'red' };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockCar,
      } as Response);

      const result = await getCarById(42);

      expect(result).toEqual(mockCar);
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/garage/42');
    });

    it('returns null when 404', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response);

      const result = await getCarById(999);

      expect(result).toBeNull();
    });

    it('throws error on other failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 503,
      } as Response);

      await expect(getCarById(42)).rejects.toThrow('Car with ID 42 not found');
    });
  });

  describe('getWinners', () => {
    it('returns winners and total count from header', async () => {
      const mockWinners = [
        { id: 1, wins: 2, time: 10.5 },
        { id: 2, wins: 1, time: 15.2 },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: {
          get: (name: string) => (name.toLowerCase() === 'x-total-count' ? '42' : null),
        },
        json: async () => mockWinners,
      } as unknown as Response);

      const result = await getWinners(2, 10);

      expect(result).toEqual({ winners: mockWinners, total: 42 });
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/winners?_page=2&_limit=10');
    });

    it('throws error when request fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response);

      await expect(getWinners(1, 7)).rejects.toThrow('Failed to load winners');
    });

    it('handles missing X-Total-Count header gracefully', async () => {
      const mockWinners = [{ id: 3, wins: 4, time: 9.1 }];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: { get: () => null },
        json: async () => mockWinners,
      } as unknown as Response);

      const result = await getWinners(1, 10);

      expect(result.total).toBe(0);
      expect(result.winners).toEqual(mockWinners);
    });
  });

  describe('createWinner', () => {
    it('creates and returns new winner', async () => {
      const newWinner = { id: 100, wins: 1, time: 14.88 };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => newWinner,
      } as Response);

      const result = await createWinner(100, 14.88);

      expect(result).toEqual(newWinner);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/winners',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: 100, wins: 1, time: 14.88 }),
        }),
      );
    });
  });

  describe('updateWinner', () => {
    it('updates and returns winner', async () => {
      const updated = { id: 7, wins: 5, time: 11.22 };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => updated,
      } as Response);

      const result = await updateWinner(7, 5, 11.22);

      expect(result).toEqual(updated);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/winners/7',
        expect.objectContaining({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ wins: 5, time: 11.22 }),
        }),
      );
    });
  });
});

import {
  carStarted,
  carStopped,
  carDrive,
  getCars,
  createCar,
  updateCar,
  deleteCar,
} from './carApi.ts';

import type { Car } from '../state/state.js';

import { jest, describe, it, expect, beforeEach } from '@jest/globals';

const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
globalThis.fetch = mockFetch;

const mockCar: Car = { id: 1, name: 'Test Car', color: 'red' };

describe('carApi', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('carStarted should return distance and velocity', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ distance: 100, velocity: 50 }),
    } as Response);

    const result = await carStarted(1);
    expect(result).toEqual({ distance: 100, velocity: 50 });

    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/engine?id=1&status=started', {
      method: 'PATCH',
    });
  });

  it('carStarted should throw on error', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false } as Response);

    await expect(carStarted(1)).rejects.toThrow('Failed to start car');
  });

  it('carStopped should return distance and velocity', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ distance: 50, velocity: 0 }),
    } as Response);

    const result = await carStopped(1);
    expect(result).toEqual({ distance: 50, velocity: 0 });
  });

  it('carStopped should throw on error', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false } as Response);

    await expect(carStopped(1)).rejects.toThrow('Failed to start car');
  });

  it('carDrive should return success', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);

    const result = await carDrive(1);
    expect(result).toEqual({ success: true });
  });

  it('carDrive should throw on error', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false } as Response);

    await expect(carDrive(1)).rejects.toThrow('Failed to drive car');
  });

  it('getCars should return cars and total', async () => {
    const cars = [mockCar];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => cars,
      headers: { get: (name: string) => (name === 'X-Total-Count' ? '1' : null) },
    } as unknown as Response); // headers.get needs slight cast sometimes

    const result = await getCars();
    expect(result).toEqual({ cars, total: 1 });
  });

  it('getCars should throw on error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Error',
    } as Response);

    await expect(getCars()).rejects.toThrow('Failed to fetch cars: 500 Error');
  });

  it('createCar should return created car', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCar,
    } as Response);

    const result = await createCar({ name: 'Test Car', color: 'red' });
    expect(result).toEqual(mockCar);
  });

  it('createCar should throw on error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
    } as Response);

    await expect(createCar({ name: 'Test Car', color: 'red' })).rejects.toThrow(
      'Failed to create car: 400 Bad Request',
    );
  });

  it('updateCar should return updated car', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCar,
    } as Response);

    const result = await updateCar(1, { color: 'blue' });
    expect(result).toEqual(mockCar);
  });

  it('updateCar should throw on error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    } as Response);

    await expect(updateCar(1, { color: 'blue' })).rejects.toThrow(
      'Failed to update car: 404 Not Found',
    );
  });

  it('deleteCar should succeed', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true } as Response);

    await expect(deleteCar(1)).resolves.toBeUndefined();
  });

  it('deleteCar should throw on error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Error',
    } as Response);

    await expect(deleteCar(1)).rejects.toThrow('Failed to delete car: 500 Error');
  });
});

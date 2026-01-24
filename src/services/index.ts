import { createCar, updateCar, deleteCar, carStarted, carStopped, carDrive } from "../api/carApi";
import { renderGarage } from "../pages/garage";
import { state } from "../state/state";
import { getCarFormDataCreate, getCarFormDataUpdate, generateRandomCarName, generateRandomColor } from "../utils";
import {showWinnerModal} from "./modal.ts";

export async function handleAccelerateCar(carId: number): Promise<boolean> {
  try {
    const result = await carStarted(carId);

    const carParent = document.querySelector(`.carParent-${carId}`) as HTMLElement;
    if (carParent) {
      carParent.classList.add('racing');

      const duration = result.distance / result.velocity;
      carParent.style.transition = `transform ${duration}ms linear`;
      carParent.style.transform = 'translateX(calc(100vw - 150px))';

      try {
        await carDrive(carId);
        return true;
      } catch (error) {
        const computedStyle = window.getComputedStyle(carParent);
        const currentTransform = computedStyle.transform;

        carParent.style.transition = 'none';
        carParent.style.transform = currentTransform;
        carParent.classList.remove('racing');

        console.log(error);
        return false;
      }
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function handleBrakeCar(carId: number): Promise<void> {
  try {
    await carStopped(carId);

    const carParent = document.querySelector(`.carParent-${carId}`) as HTMLElement;
    if (carParent) {
      carParent.classList.remove('racing');

      carParent.style.transition = 'none';
      carParent.style.transform = 'translateX(0)';
    }
  } catch (error) {
    throw error;
  }
}

export async function handleRaceCars(): Promise<void> {
  try {
    const racePromises = state.cars.map(async (car) => {
      const startTime = Date.now();
      const isFinished = await handleAccelerateCar(car.id);
      const finishTime = Date.now() - startTime;
      return { car,  finishTime: isFinished ? finishTime : Number.MAX_VALUE };
    });

    const results = await Promise.all(racePromises);
    results.sort((a, b) => a.finishTime - b.finishTime);
    state.winners = results;
    const winner = results[0];
    showWinnerModal(winner.car.name, winner.finishTime);

  } catch (error) {
    throw error
  }
}

export async function handleResetCars(): Promise<void> {
  try {
    const promises = state.cars.map((car) => handleBrakeCar(car.id));
    await Promise.all(promises);
  } catch (error) {
    throw error
  }
}

export async function handleCreateCar(): Promise<void> {
  const carData = getCarFormDataCreate();
  if (!carData) return;

  try {
    await createCar(carData as any);
    await renderGarage();
  } catch (error) {
    throw error;
  }
}

export async function handleUpdateCar(): Promise<void> {
  if (!state.selectedCar) return;

  const carData = getCarFormDataUpdate();
  if (!carData) return;

  try {
    await updateCar(state.selectedCar.id, carData as any);
    state.selectedCar = null;
    await renderGarage();
  } catch (error) {
    throw error;
  }
}

export async function handleDeleteCar(carId: number): Promise<void> {
  try {
    await deleteCar(carId);
    await renderGarage();
  } catch (error) {
    throw error;
  }
}

export async function handleGenerateCars(): Promise<void> {
  try {
    const promises = [];
    for (let i = 0; i < 100; i++) {
      const carData = {
        name: generateRandomCarName(),
        color: generateRandomColor()
      };
      promises.push(createCar(carData as any));
    }

    await Promise.all(promises);
    state.currentPage = 1;
    await renderGarage();
  } catch (error) {
    throw error;
  }
}
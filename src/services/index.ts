import { createCar, updateCar, deleteCar, carStarted, carStopped } from "../api/carApi";
import { renderGarage } from "../pages/garage";
import { state } from "../state/state";
import { getCarFormDataCreate, getCarFormDataUpdate, generateRandomCarName, generateRandomColor } from "../utils";

export async function handleAccelerateCar(carId: number): Promise<{distance: number; velocity: number}> {
  try {
    return await carStarted(carId);
  } catch (error) {
    alert("Failed to accelerate car");
    throw error;
  }
}

export async function handleBrakeCar(carId: number): Promise<{distance: number; velocity: number}> {
  try {
    return await carStopped(carId);
  } catch (error) {
    alert("Failed to brake car");
    throw error;
  }
}

export async function handleCreateCar(): Promise<void> {
  const carData = getCarFormDataCreate();
  if (!carData) return;

  try {
    await createCar(carData as any);
    await renderGarage();
  } catch (error) {
    alert("Failed to create car");
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
    alert("Failed to update car");
  }
}

export async function handleDeleteCar(carId: number): Promise<void> {
  try {
    await deleteCar(carId);
    await renderGarage();
  } catch (error) {
    alert("Failed to delete car");
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
    alert("Failed to generate cars");
  }
}
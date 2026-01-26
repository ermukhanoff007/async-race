import type { Car } from "../state/state";

export function getCarFormDataCreate(): Omit<Car,'id'> | null {
  const nameInput = document.getElementById("create-car-input") as HTMLInputElement;
  const colorInput = document.getElementById("create-car-color") as HTMLInputElement;

  const name = nameInput.value.trim();
  const color = colorInput.value;

  if (!name) {
    alert("Please enter a car name");
    return null;
  }

  return { name, color };
}

export function getCarFormDataUpdate(): Omit<Car,'id'> | null {
  const nameInput = document.getElementById("update-car-input") as HTMLInputElement;
  const colorInput = document.getElementById("update-car-color") as HTMLInputElement;

  const name = nameInput.value.trim();
  const color = colorInput.value;

  if (!name) {
    alert("Please enter a car name");
    return null;
  }

  return { name, color };
}

export function generateRandomColor(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function generateRandomCarName(): string {
  const adjectives = ['Fast', 'Slow', 'Red', 'Blue', 'Green', 'Yellow', 'Black', 'White', 'Silver', 'Gold', 'Electric', 'Diesel', 'Sport', 'Luxury', 'Classic', 'Modern', 'Vintage', 'Retro', 'Future', 'Stealth'];
  const models = ['Car', 'Vehicle', 'Auto', 'Racer', 'Speedster', 'Coupe', 'Sedan', 'SUV', 'Truck', 'Van', 'Hatchback', 'Convertible', 'Roadster', 'Limousine', 'Wagon', 'Crossover', 'Pickup', 'Minivan', 'Sports', 'Super'];
  const numbers = Math.floor(Math.random() * 9999) + 1;
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const model = models[Math.floor(Math.random() * models.length)];
  
  return `${adjective} ${model} ${numbers}`;
}
import { getCars, CARS_PER_PAGE } from '../api/carApi';
import { state } from '../state/state';
import { createCarIcon } from '../components/car';
import {
  handleCreateCar,
  handleGenerateCars,
  handleUpdateCar,
  handleDeleteCar,
  handleBrakeCar,
  handleAccelerateCar,
  handleRaceCars,
  handleResetCars,
} from '../services';

export async function renderGarage() {
  const app = document.getElementById('app')!;
  app.innerHTML = `
    <h1>Garage</h1>
    <section aria-label="Create new car">
      <div style="margin-bottom: 12px">
        <label for="create-car-input" class="sr-only">Car name</label>
        <input type="text" id="create-car-input" placeholder="Enter car name" aria-label="Enter car name" />
        <label for="create-car-color" class="sr-only">Car color</label>
        <input type="color" id="create-car-color" value="#FFFFFF" aria-label="Select car color" />
        <button class="button button-blue" id="create-car-btn" aria-label="Create new car">Create Car</button>
      </div>
    </section>
    <section aria-label="Update selected car">
      <div style="margin-bottom: 12px">
        <label for="update-car-input" class="sr-only">Car name to update</label>
        <input type="text" id="update-car-input" placeholder="Update selected car name" ${!state.selectedCar ? 'disabled' : ''} aria-label="Update selected car name" />
        <label for="update-car-color" class="sr-only">Car color to update</label>
        <input type="color" id="update-car-color" value="#FFFFFF" ${!state.selectedCar ? 'disabled' : ''} aria-label="Update selected car color" />
        <button class="button button-blue" id="update-car-btn" ${!state.selectedCar ? 'disabled' : ''} aria-label="Update selected car">Update Car</button>
      </div>
    </section>
    <section aria-label="Race controls">
      <div>
        <button class="button button-green" id="race-cars-btn" aria-label="Start race with all cars">Race Cars</button>
        <button class="button button-red" id="reset-cars-btn" aria-label="Reset all cars to start position">Reset</button>
        <button class="button button-blue" id="generate-cars-btn" aria-label="Generate random cars">Generate Cars</button>
      </div>
    </section>
    <p>Garage <span id="cars-count-span" aria-live="polite"></span></p>
    <p>Page <span id="current-page-span" aria-live="polite"></span></p>
    <div id="cars-list" role="list" aria-label="List of cars">...Loading</div>
  `;

  try {
    const { cars, total } = await getCars(state.currentPage);
    state.cars = cars;
    const totalPages = Math.ceil(total / CARS_PER_PAGE) || 1;

    const currentPageSpan = document.getElementById('current-page-span');
    if (currentPageSpan) {
      currentPageSpan.textContent = `#${state.currentPage.toString()}/${totalPages.toString()}`;
    }

    const carsCountSpan = document.getElementById('cars-count-span');
    if (carsCountSpan) {
      carsCountSpan.textContent = `(${total.toString()})`;
    }

    const list = document.getElementById('cars-list')!;
    list.innerHTML = cars
      .map(
        (car, index) => `
      <div role="listitem" aria-label="Car ${car.name}">
        <div>
          <button class="button" id="select-car-btn-${index}" aria-label="Select car ${car.name}">Select</button>
          <button class="button" id="delete-car-btn-${index}" aria-label="Remove car ${car.name}">Remove</button>
          <span>${car.name}</span>
        </div>
        <div class="way" role="region" aria-label="Race track for ${car.name}">
          <button class="carActionButton" id="accelerate-car-btn-${index}" aria-label="Accelerate ${car.name}">A</button>
          <button class="carActionButton" id="brake-car-btn-${index}" aria-label="Brake ${car.name}">B</button>
          <div class="carContainer">
            <div class="carParent carParent-${car.id}" aria-label="Car ${car.name}">
              ${createCarIcon({ fill: car.color, ariaLabel: `Car ${car.name}` })}
            </div>
          </div>
          <div class="flag">
            <img src="public/flag.png" alt="Finish Flag" />
          </div>
        </div>
      </div>
    `,
      )
      .join('');

    const prevDisabled = state.currentPage <= 1;
    const nextDisabled = state.currentPage >= totalPages;

    const pagination = document.createElement('div');
    pagination.className = 'pagination';
    pagination.setAttribute('role', 'navigation');
    pagination.setAttribute('aria-label', 'Pagination');
    pagination.innerHTML = `
      <button class="button" id="btn-prev" ${prevDisabled ? 'disabled' : ''} aria-label="Go to previous page">Prev</button>
      <button class="button" id="btn-next" ${nextDisabled ? 'disabled' : ''} aria-label="Go to next page">Next</button>
    `;
    app.append(pagination);

    document.getElementById('btn-prev')!.onclick = () => {
      if (state.currentPage > 1) {
        state.currentPage--;
        state.selectedCar = null;
        renderGarage();
      }
    };
    document.getElementById('btn-next')!.onclick = () => {
      if (state.currentPage < totalPages) {
        state.currentPage++;
        state.selectedCar = null;
        renderGarage();
      }
    };

    document.getElementById('create-car-btn')!.onclick = handleCreateCar;
    document.getElementById('generate-cars-btn')!.onclick = handleGenerateCars;
    document.getElementById('race-cars-btn')!.onclick = handleRaceCars;

    document.getElementById('reset-cars-btn')!.onclick = handleResetCars;

    if (state.selectedCar) {
      document.getElementById('update-car-btn')!.onclick = handleUpdateCar;
    }

    if (state.selectedCar) {
      const updateNameInput = document.getElementById('update-car-input') as HTMLInputElement;
      const updateColorInput = document.getElementById('update-car-color') as HTMLInputElement;
      updateNameInput.value = state.selectedCar.name;
      updateColorInput.value = state.selectedCar.color;
    }

    cars.forEach((car, index) => {
      document.getElementById(`delete-car-btn-${index}`)!.onclick = () => handleDeleteCar(car.id);
      document.getElementById(`select-car-btn-${index}`)!.onclick = () => {
        state.selectedCar = car;
        renderGarage();
      };
      document.getElementById(`accelerate-car-btn-${index}`)!.onclick = () => {
        handleAccelerateCar(car.id);
      };
      document.getElementById(`brake-car-btn-${index}`)!.onclick = () => {
        handleBrakeCar(car.id);
      };
    });
  } catch (error) {
    const list = document.getElementById('cars-list')!;
    list.innerHTML = 'Failed to load cars';
  }
}

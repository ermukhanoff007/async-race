import { getCars, CARS_PER_PAGE } from "../api/carApi";
import { state } from "../state/state";
import { createCarIcon } from "../components/car";
import { handleCreateCar, handleGenerateCars, handleUpdateCar, handleDeleteCar, handleBrakeCar, handleAccelerateCar, handleRaceCars, handleResetCars } from "../services";

export async function renderGarage() {
  const app = document.getElementById("app")!;
  app.innerHTML = `
    <div style="margin-bottom: 12px">
      <input type="text" id="create-car-input" placeholder="Enter car name" />
      <input type="color" id="create-car-color" value="#FFFFFF" />
      <button class="button button-blue" id="create-car-btn">Create Car</button>
    </div>
    <div style="margin-bottom: 12px">
      <input type="text" id="update-car-input" placeholder="Update selected car name" ${!state.selectedCar ? "disabled" : ""} />
      <input type="color" id="update-car-color" value="#FFFFFF" ${!state.selectedCar ? "disabled" : ""} />
      <button class="button button-blue" id="update-car-btn" ${!state.selectedCar ? "disabled" : ""}>Update Car</button>
    </div>
    <div>
      <button class="button button-green" id="race-cars-btn">Race Cars</button>
      <button class="button button-red" id="reset-cars-btn">Reset</button>
      <button class="button button-blue" id="generate-cars-btn">Generate Cars</button>
    </div>
    <p>Garage <span id="cars-count-span"></span></p>
    <p>Page <span id="current-page-span"></span></p>
    <p id="cars-list">...Loading</p>
  `;

  try {
    const { cars, total } = await getCars(state.currentPage);
    state.cars = cars;
    const totalPages = Math.ceil(total / CARS_PER_PAGE) || 1;

    const currentPageSpan = document.getElementById("current-page-span");
    if (currentPageSpan) {
      currentPageSpan.textContent = `#${state.currentPage.toString()}/${totalPages.toString()}`;
    }

    const carsCountSpan = document.getElementById("cars-count-span");
    if (carsCountSpan) {
      carsCountSpan.textContent = `(${total.toString()})`;
    }

    const list = document.getElementById("cars-list")!;
    list.innerHTML = cars
      .map(
        (car, index) => `
      <div>
        <div>
          <button class="button" id="select-car-btn-${index}">Select</button>
          <button class="button" id="delete-car-btn-${index}">Remove</button>
          ${car.name}
        </div>
        <div class="way">
          <button class="carActionButton" id="accelerate-car-btn-${index}">A</button>
          <button class="carActionButton" id="brake-car-btn-${index}">B</button>
          <div class="carContainer">
            <div class="carParent carParent-${car.id}">
              ${createCarIcon({ fill: car.color })}
            </div>
          </div>
          <div class="flag">
            <img src="public/flag.png" alt="Finish Flag" />
          </div>
        </div>
      </div>
    `,
      )
      .join("");


    const prevDisabled = state.currentPage <= 1;
    const nextDisabled = state.currentPage >= totalPages;

    const pagination = document.createElement("div");
    pagination.className = "pagination";
    pagination.innerHTML = `
      <button class="button" id="btn-prev" ${prevDisabled ? "disabled" : ""}>Prev</button>
      <button class="button" id="btn-next" ${nextDisabled ? "disabled" : ""}>Next</button>
    `;
    app.append(pagination);

    document.getElementById("btn-prev")!.onclick = () => {
      if (state.currentPage > 1) {
        state.currentPage--;
        state.selectedCar = null
        renderGarage();
      }
    };
    document.getElementById("btn-next")!.onclick = () => {
      if (state.currentPage < totalPages) {
        state.currentPage++;
        state.selectedCar = null
        renderGarage();
      }
    };

    document.getElementById("create-car-btn")!.onclick = handleCreateCar;
    document.getElementById("generate-cars-btn")!.onclick = handleGenerateCars;
    document.getElementById('race-cars-btn')!.onclick = handleRaceCars;

    document.getElementById('reset-cars-btn')!.onclick = handleResetCars;

    if (state.selectedCar) {
      document.getElementById("update-car-btn")!.onclick = handleUpdateCar;
    }

    if (state.selectedCar) {
      const updateNameInput = document.getElementById("update-car-input") as HTMLInputElement;
      const updateColorInput = document.getElementById("update-car-color") as HTMLInputElement;
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
    const list = document.getElementById("cars-list")!;
    list.innerHTML = "Failed to load cars";
  }
}

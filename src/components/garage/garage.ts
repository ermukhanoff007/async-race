import { createCar, deleteCar, getCars, updateCar } from "../../api/carApi";
import { state, type Car } from "../../state/state";
import { createCarIcon } from "../car/car";

const getCarsAction = async () => {
  try {
    const res = await getCars(state.currentPage);
    state.cars = res;
    return res;
  } catch (error) {
    console.log(error)
  }
}

const createCarAction = async (car: Car) => {
  try {
    await createCar(car);
    await getCarsAction();
  } catch (error) {
    console.log(error)
  }
}

const updateCarAction = async (id: number, car: Partial<Car>) => {
  try {
    await updateCar(id, car)
    await getCarsAction()
  } catch (error) {
    console.log(error)
  }
}

const deleteCarAction = async (id: number) => {
  try {
    await deleteCar(id);
    await getCarsAction();
  } catch (error) {
    console.log(error)
  }
}

export async function renderGarage() {
  const app = document.getElementById("app")!;
  app.innerHTML = `
    <div style="margin-bottom: 12px">
      <input type="text" id="create-car-input" placeholder="Enter car name" />
      <button class="button button-blue" id="create-car-btn">Create Car</button>
    </div>
    <div style="margin-bottom: 12px">
      <input type="text" id="update-car-input" placeholder="Update selected car name" />
      <button class="button button-blue" id="update-car-btn">Update Car</button>
    </div>
    <div>
      <button class="button button-green" id="race-cars-btn">Race Cars</button>
      <button class="button button-red" id="reset-cars-btn">Reset</button>
      <button class="button button-blue" id="generate-cars-btn">Generate Cars</button>
    </div>
    <p>Garage <span id="cars-count-span"></span></p>
    <p>Page <span id="current-page-span"></span></p>
    <p id="cars-list">...Loading</p>
    <div>
      <button class="button" id="prev-page-btn">Prev</button>
      <button class="button" id="next-page-cars-btn">Next</button>
    </div>
    <p id="error-paragraph"></p>
  `;

  try {
    await getCarsAction();
    const cars = await getCars(state.currentPage);
    state.cars = cars;

    const currentPageSpan = document.getElementById("current-page-span");
    if (currentPageSpan) {
      currentPageSpan.textContent = `#${state.currentPage.toString()}`;
    }

    const carsCountSpan = document.getElementById("cars-count-span");
    if (carsCountSpan) {
      carsCountSpan.textContent = `(${cars.length.toString()})`;
    }

    const list = document.getElementById("cars-list");
    list!.innerHTML = cars
      .map(
        (car) => `
      <div>
        <div>
          <button class="button" id="select-car-btn">Select</button>
          <button class="button" id="delete-car-btn">Remove</button>
          ${car.name}
        </div>
        <div class="way">
          <button class="carActionButton" id="accelerate-car-btn">A</button>
          <button class="carActionButton" id="brake-car-btn">B</button>
          <div class="carContainer">
            ${createCarIcon({ fill: car.color })}
          </div>
        </div>
      </div>
    `,
      )
      .join("");
  } catch (error) {
    console.error("Failed to render garage:", error);
    const list = document.getElementById("cars-list");
    if (list) list.innerHTML = "Failed to load cars"
  }
}

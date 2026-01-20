import { getCars, CARS_PER_PAGE } from "../../api/carApi";
import { state } from "../../state/state";
import { createCarIcon } from "../car/car";

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
  `;

  try {
    const { cars, total } = await getCars(state.currentPage);
    state.cars = cars;
    const totalPages = Math.ceil(total / CARS_PER_PAGE) || 1;

    const currentPageSpan = document.getElementById("current-page-span");
    if (currentPageSpan) {
      currentPageSpan.textContent = `#${state.currentPage.toString()}`;
    }

    const carsCountSpan = document.getElementById("cars-count-span");
    if (carsCountSpan) {
      carsCountSpan.textContent = `(${cars.length.toString()})`;
    }

    const list = document.getElementById("cars-list")!;
    list.innerHTML = cars
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

    const prevDisabled = state.currentPage <= 1;
    const nextDisabled = state.currentPage >= totalPages;

    const pagination = document.createElement("div");
    pagination.className = "pagination";
    pagination.innerHTML = `
      <button id="btn-prev" ${prevDisabled ? "disabled" : ""}>Prev</button>
      <span>Page ${state.currentPage} / ${totalPages}</span>
      <button id="btn-next" ${nextDisabled ? "disabled" : ""}>Next</button>
    `;
    app.append(pagination);

    document.getElementById("btn-prev")!.onclick = () => {
      if (state.currentPage > 1) {
        state.currentPage--;
        renderGarage();
      }
    };
    document.getElementById("btn-next")!.onclick = () => {
      if (state.currentPage < totalPages) {
        state.currentPage++;
        renderGarage();
      }
    };
  } catch (error) {
    console.error("Failed to render garage:", error);
    const list = document.getElementById("cars-list")!;
    list.innerHTML = "Failed to load cars";

    const pagination = document.createElement("div");
    pagination.className = "pagination";
    pagination.innerHTML = `
      <button id="btn-prev" disabled>Prev</button>
      <span>Page 1 / 1</span>
      <button id="btn-next" disabled>Next</button>
    `;
    app.append(pagination);
  }
}

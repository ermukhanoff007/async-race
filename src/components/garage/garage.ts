import { getCars, CARS_PER_PAGE } from "../../api/carApi";
import { state } from "../../state/state";

export async function renderGarage() {
  const app = document.getElementById("app")!;
  app.innerHTML = `
    <h1>Garage</h1>
    <p id="cars-list">...Loading</p>
  `;

  try {
    const { cars, total } = await getCars(state.currentPage);
    state.cars = cars;
    const totalPages = Math.ceil(total / CARS_PER_PAGE) || 1;

    const list = document.getElementById("cars-list")!;
    list.innerHTML = cars
      .map(
        (car) => `
    <div>
        <span>${car.name} (${car.color})</span>
        <div>
          <button data-id="${car.id}" class="start">Start</button>
          <button data-id="${car.id}" class="stop">Stop</button>
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

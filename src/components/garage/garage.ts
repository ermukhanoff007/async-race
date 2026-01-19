import { getCars } from "../../api/carApi";
import { state } from "../../state/state";

export async function renderGarage() {
  const app = document.getElementById("app")!;
  app.innerHTML = `
    <h1>Garage</h1>
    <p id="cars-list">...Loading</p>
  `;

  try {
    const cars = await getCars(state.currentPage);
    state.cars = cars;
    const list = document.getElementById("cars-list");
    list!.innerHTML = cars
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
  } catch (error) {
    console.error("Failed to render garage:", error);
    const list = document.getElementById("cars-list");
    if(list) list.innerHTML = "Failed to load cars"
  }
}

import { CARS_PER_PAGE } from '../api/carApi';
import { createCarIcon } from '../components/car';
import { Car, state } from '../state/state';
import { getCarById, getWinners } from '../api/winnerApi.ts';

const loadWinnersTable = async () => {
  const body = document.getElementById('winners-body')!;
  body.innerHTML = "<tr><td colspan='5'>Loading...</td></tr>";

  try {
    const { winners, total } = await getWinners(state.winnersPage || 1, CARS_PER_PAGE);

    document.getElementById('winners-total')!.textContent = total.toString();

    const rowsHTML = await Promise.all(
      winners.map(async (w, i) => {
        let car: Car | null;
        try {
          car = await getCarById(w.id);
        } catch {
          car = null;
        }
        return `
          <tr>
            <td>${i + 1}</td>
            <td>${car ? createCarIcon({ fill: car.color, ariaLabel: `Car ${car.name}` }) : '-'}</td>
            <td>${car ? car.name : 'Deleted'}</td>
            <td>${w.wins}</td>
            <td>${(w.time / 1000).toFixed(2)}</td>
          </tr>
        `;
      }),
    );

    body.innerHTML = rowsHTML.join('');
  } catch (error) {
    body.innerHTML = '<tr><td colspan="5">Failed to load winners</td></tr>';
  }
};

export async function renderWinners() {
  const app = document.getElementById('app')!;
  app.innerHTML = `
    <h1>🏆 Winners</h1>
    <p>Total: <span id="winners-total" aria-live="polite"></span></p>

    <table class="winners-table" role="table" aria-label="Winners table">
      <caption class="sr-only">Table showing race winners with their car, name, number of wins, and best time</caption>
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Car</th>
          <th scope="col">Name</th>
          <th scope="col" class="wins">Wins</th>
          <th scope="col" class="time">Best Time (s)</th>
        </tr>
      </thead>
      <tbody id="winners-body">
        <tr><td colspan="5">Loading...</td></tr>
      </tbody>
    </table>

    <div class="pagination" role="navigation" aria-label="Winners pagination">
      <button id="btn-prev" class="button" aria-label="Go to previous page">Prev</button>
      <button id="btn-next" class="button" aria-label="Go to next page">Next</button>
    </div>
  `;

  await loadWinnersTable();

  const initPagination = () => {
    document.getElementById('btn-prev')!.onclick = () => {
      if (state.winnersPage > 1) {
        state.winnersPage--;
        loadWinnersTable();
      }
    };

    document.getElementById('btn-next')!.onclick = () => {
      state.winnersPage++;
      loadWinnersTable();
    };
  };

  initPagination();
}

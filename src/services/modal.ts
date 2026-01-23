export function showWinnerModal(carName: string, time: number) {
    const modal = document.getElementById("winner-modal")!;
    const body = document.querySelector(".modal-body")!;
    const closeBtn = document.getElementById("modal-close-btn")!;

    const seconds = (time / 1000).toFixed(2);

    body.textContent = `${carName} finished in ${seconds} seconds!`;

    modal.classList.remove("hidden");

    closeBtn.onclick = () => {
        modal.classList.add("hidden");
    };
}

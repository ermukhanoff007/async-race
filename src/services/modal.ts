export function showWinnerModal(carName: string, time: number) {
    const modal = document.getElementById("winner-modal")!;
    const body = document.querySelector(".modal-body")!;
    const closeBtn = document.getElementById("modal-close-btn")!;

    const seconds = (time / 1000).toFixed(2);

    body.textContent = `${carName} finished in ${seconds} seconds!`;

    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    
    // Focus trap: focus on close button
    closeBtn.focus();

    const handleClose = () => {
        modal.classList.add("hidden");
        modal.setAttribute("aria-hidden", "true");
    };

    closeBtn.onclick = handleClose;

    // Close on Escape key
    const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape" && !modal.classList.contains("hidden")) {
            handleClose();
            document.removeEventListener("keydown", handleEscape);
        }
    };
    document.addEventListener("keydown", handleEscape);
}

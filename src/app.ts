import { Router } from "./route/router";

const router = new Router("app");

router.addRoute("/", async () => {
  const { renderGarage } = await import("./pages/garage");
  renderGarage();
});

router.addRoute("/winners", async () => {
  const { renderWinners } = await import("./pages/winner");
  renderWinners();
});

router.init();

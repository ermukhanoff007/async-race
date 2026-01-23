import { Router } from "./route/router";
import { renderGarage } from "./pages/garage";
import { renderWinners } from "./pages/winner";

const router = new Router("app");

router.addRoute("/", renderGarage);
router.addRoute("/winners", renderWinners);

router.init();

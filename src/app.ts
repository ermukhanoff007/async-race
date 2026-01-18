import { Router } from "./route/router";
import { renderGarage } from "./components/garage/garage";
import { renderWinners } from "./components/winner/winner";

const router = new Router("app");

router.addRoute("/", renderGarage);
router.addRoute("/winners", renderWinners);

router.init();

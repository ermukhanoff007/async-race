type Route = {
  path: string;
  render: () => void;
};

export class Router {
  private routes: Route[] = [];
  private root: HTMLElement;

  constructor(rootId: string) {
    const rootEl = document.getElementById(rootId);
    if (!rootEl) throw new Error("Root element not found");
    this.root = rootEl;

    window.addEventListener("hashchange", () => this.route());
  }

  addRoute(path: string, render: () => void) {
    this.routes.push({ path, render });
  }

  route() {
    const path = location.hash.replace("#", "") || "/";
    const route = this.routes.find(r => r.path === path);
    if (route) {
      this.root.innerHTML = ""; 
      route.render();
    }
  }

  init() {
    this.route();
  }
}

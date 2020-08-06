import { setupRightPane, rebuildRightPane, hideRightPane, showRightPane } from "./ui/right-pane";
import { setupLeftPane, rebuildLeftPane, hideLeftPane, showLeftPane } from "./ui/left-pane";

let isVisible = true;
let fpsCounterEl, cornerLinksEl;

export function setupUI() {
  setupRightPane();
  setupLeftPane();

  fpsCounterEl = document.querySelector('#fps-counter');
  cornerLinksEl = document.querySelector('.corner-links');
}

  export function rebuildUI() {
    rebuildRightPane();
    rebuildLeftPane();
  }

  export function toggleUI() {
    if(isVisible) {
      hideLeftPane();
      hideRightPane();
      fpsCounterEl.style.display = 'none';
      cornerLinksEl.style.display = 'none';
    } else {
      showLeftPane();
      showRightPane();
      fpsCounterEl.style.display = 'block';
      cornerLinksEl.style.display = 'block';
    }

    isVisible = !isVisible;
  }
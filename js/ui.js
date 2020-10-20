import { setupRightPane, rebuildRightPane, refreshRightPane, hideRightPane, showRightPane } from "./ui/right-pane";
import { setupLeftPane, rebuildLeftPane, refreshLeftPane, hideLeftPane, showLeftPane } from "./ui/left-pane";

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

  export function refreshUI() {
    refreshRightPane();
    refreshLeftPane();
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
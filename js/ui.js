import { setupRightPane, rebuildRightPane, refreshRightPane, hideRightPane, showRightPane } from "./ui/right-pane";
import { setupLeftPane, rebuildLeftPane, refreshLeftPane, hideLeftPane, showLeftPane } from "./ui/left-pane";

let isVisible = true;
let statsContainerEl, cornerLinksEl;

export function setupUI() {
  setupRightPane();
  setupLeftPane();

  statsContainerEl = document.querySelector('#stats-container');
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
      statsContainerEl.style.display = 'none';
      cornerLinksEl.style.display = 'none';
    } else {
      showLeftPane();
      showRightPane();
      statsContainerEl.style.display = 'flex';
      cornerLinksEl.style.display = 'block';
    }

    isVisible = !isVisible;
  }
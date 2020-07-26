import { setupRightPane, rebuildRightPane } from "./ui/right-pane";
import { setupLeftPane, rebuildLeftPane } from "./ui/left-pane";

export function setupUI() {
  setupRightPane();
  setupLeftPane();
}

  export function rebuildUI() {
    rebuildRightPane();
    rebuildLeftPane();
  }
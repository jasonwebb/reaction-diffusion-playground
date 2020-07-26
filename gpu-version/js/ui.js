import { setupRightPane } from "./ui/right-pane";
import { setupLeftPane } from "./ui/left-pane";

export function setupUI() {
  setupRightPane();
  setupLeftPane();
}

  export function rebuildUI() {
    rebuildRightPane();
    rebuildLeftPane();
  }
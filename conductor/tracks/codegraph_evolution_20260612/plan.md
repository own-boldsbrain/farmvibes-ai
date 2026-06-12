# Evolution of CodeGraph: The Void Cockpit

## Objective
Transform the standalone `codegraph.html` into a high-performance, feature-rich "Void Cockpit" for codebase exploration, featuring advanced search, filtering, inspection, and cinematic animations.

## Key Files & Context
- `codegraph.html`: The target standalone file.
- Current Stats: ~7.4k nodes, ~14.7k edges.
- Style: YSH Intelligence / The Void (Dark, Zinc tonal scale, Kinetic gradients).

## Proposed Solution
A complete refactor of the `codegraph.html` file into a modular internal structure:
1.  **CSS Tokens & Layout**: Define the YSH design system and responsive grid (Left Panel, Center Graph, Right Panel).
2.  **Reactive State**: A centralized `state` object managing graph visibility, camera, selection, and UI modes.
3.  **Enhanced Rendering**: Custom `nodeCanvasObject` and `linkCanvasObject` for performance and visual fidelity.
4.  **Operator-based Search**: Fuzzy search with support for `type:`, `ext:`, `path:`, `degree:`, etc.
5.  **Analytical Tools**: Hub detection, orphan analysis, and dependency tracing.
6.  **Cockpit HUD**: Command palette (Ctrl+K), minimap, and a real-time status bar.

## Implementation Plan

### Phase 1: Foundation & Shell
- [ ] Define YSH CSS Variables (Zinc scale, Kinetic gradient).
- [ ] Create the application layout with collapsible panels.
- [ ] Initialize the global `state` object.
- [ ] Extract and preserve the existing `gData`.

### Phase 2: Engine Upgrade
- [ ] Refactor `ForceGraph` initialization to use the new state.
- [ ] Implement adaptive labels (zoom-dependent visibility).
- [ ] Add spatial indexing (quadtree) for optimized hover/click interactions.
- [ ] Implement focus/fit camera logic with smooth easing.

### Phase 3: Intelligence & Control
- [ ] Build the Search Engine with operator support.
- [ ] Implement the Filtering Engine (type, extension, path, degree).
- [ ] Create the Animation Controller (pulse, flow, drift modes).
- [ ] Implement the Left Control Deck (Control Deck).

### Phase 4: Inspection & HUD
- [ ] Build the Right Panel (Inspector) for nodes and edges.
- [ ] Implement the Command Palette (Ctrl+K).
- [ ] Add the Minimap and Bottom HUD.
- [ ] Implement advanced analytics (Hub ranking, Orphan detection).

### Phase 5: Export & Polish
- [ ] Add PNG and JSON export functionality.
- [ ] Implement `localStorage` persistence for views and settings.
- [ ] Finalize "The Void" aesthetics (glow, motion blur, kinetic triggers).
- [ ] Verify performance with the 7k+ node dataset.

## Verification & Testing
- **Manual Verification**: Test all UI toggles, search operators, and camera controls in a browser.
- **Performance Stress Test**: Ensure 60fps during pan/zoom with labels on.
- **Data Integrity**: Verify that all nodes and links from the original dataset are correctly represented.

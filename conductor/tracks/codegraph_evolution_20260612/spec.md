# Technical Specification: CodeGraph Void Cockpit

## UX/UI Design
- **Theme**: The Void (Dark, Zinc tonal scale).
- **Core Panels**:
    - **Left (Control Deck)**: 320px wide, collapsible. Contains Search, Filters, Layout, Animation.
    - **Right (Inspector)**: 300px wide, collapsible. Detailed node/edge stats, relationships.
    - **Main (The Void)**: 100% viewport. Force-directed graph with adaptive labels.
    - **HUD**: Floating command palette (Ctrl+K), Bottom status bar (FPS, node counts), Minimap.

## Graph Engine
- **Library**: `force-graph` (embedded via CDN for standalone support).
- **Renderer**: HTML5 Canvas (high performance).
- **Optimization**:
    - **Frustum Culling**: Skip rendering nodes/links outside the camera view.
    - **Adaptive Labels**: Display logic based on `globalScale`:
        - `scale < 1.5`: No labels, only large hubs.
        - `1.5 < scale < 3.0`: File names only for relevant nodes.
        - `scale > 3.0`: Full names for all nodes.
    - **Hover Highlighting**: Instant neighbor discovery and halo rendering.

## Intelligence Layer
- **Search System**:
    - Fuzzy matching using string inclusion or Levenshtein distance (simple local impl).
    - Regex support (detected by `/pattern/`).
    - Operators: `type:file`, `type:class`, `ext:py`, `path:src`, `degree:>10`.
- **Filtering**: Dynamic graph reconstruction based on visible node set.
- **Analytics**:
    - Centrality calculation (Degree centrality).
    - Hub identification (Top 5% degree).
    - Connected component analysis (Orphan detection).

## Interaction Logic
- **Camera**: Zoom to cursor, smooth pan/zoom transitions (d3-zoom based).
- **Keyboard**: Full shortcut support (F=fit, L=labels, SPACE=play/pause).
- **Context Menu**: Custom HTML menu for deep node actions (Focus, Trace, Pin).

## Persistence & Export
- **localStorage**: Save `codegraph_view_settings` and `codegraph_saved_views`.
- **PNG Export**: High-resolution canvas snapshot with/without HUD.
- **JSON Export**: Export filtered graph state for external tools.

# Product Guidelines: Electricity Maps (The Precision Architect)

## Visual Aesthetic: "Industrial Orthogonality"
- **Zero-Line Integrity:** Avoid 1px borders for separation. Use "Tonal Stepping" (subtle shifts in background color) to define different UI surfaces and content blocks.
- **Strictly Orthogonal:** Maintain a 0px border-radius across all elements (buttons, containers, avatars, inputs). The interface should be sharp and architectural.
- **High Density:** Optimize for technical data visualization. Use compact spacing and clear hierarchies to display maximum information without clutter.

## Color Spectrum
- **The Core Scale (Zinc):**
  - **Base Surface:** `#F9F9FB` (Light) / `#09090B` (Dark).
  - **Container Low:** `#F1F1F4` (Light) / `#18181B` (Dark).
  - **Container High:** `#E4E4E7` (Light) / `#27272A` (Dark).
  - **Elevated:** `#FFFFFF` (Light) / `#1E1E21` (Dark).
- **Kinetic Accents (The Energy Gradient):**
  - Use a 3-stop safety gradient for primary actions and critical alerts: `#FFCE00` (Yellow) → `#FF6600` (Orange) → `#FF0066` (Pink).

## Typography
- **Primary (Sans):** Professional, high-legibility sans-serif for headings and body text.
- **Technical (Mono):** Use monospace fonts for telemetry, coordinates, status codes, and data readings (e.g., `SYSTEM_STATUS_DRAFT_VERIFIED`).
- **Editorial Hierarchy:**
  - **Display:** Large, bold headers with tight tracking (`-0.02em`) for structural identification.
  - **Labels:** Uppercase, tracked out (`0.05em`) monospace labels for system telemetry.

## Component Standards
- **Square Status Rings:** Avatars and status indicators must be square, using dashed or solid borders to indicate state (e.g., "Active" vs. "Read").
- **Kinetic Buttons:** Primary actions use the Energy Gradient; secondary actions use solid high-contrast Zinc blocks.
- **Recessed Inputs:** Data entry cells should be visually recessed using "Container Low" backgrounds with no external borders.

## UX Principles
- **Zero Shadows:** Rely on tonal elevation rather than drop shadows for depth.
- **Computer Vision Ready:** UI elements should be easily detectable by spatial models (like YOLO), maintaining clear contrast and geometric predictability.

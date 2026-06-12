# Specification: Precision Architect Integration

## Objective
Modernize the Electricity Maps web interface by implementing "The Precision Architect" design system. This involves moving away from standard UI patterns towards an industrial, orthogonal, and high-density aesthetic characterized by tonal stepping and kinetic accents.

## Requirements
- **Aesthetic Alignment:** Strictly follow the 0px border-radius (orthogonal) and "zero-line" (tonal stepping) principles.
- **Color Palette:** Implement the Zinc-based scale for surfaces and the 3-stop Energy Gradient (`#FFCE00` → `#FF6600` → `#FF0066`) for primary interactions.
- **Typography:** Use a high-legibility sans-serif for main content and monospace for all technical data, telemetry, and system labels.
- **Consistency:** Ensure all map overlays, side panels, and modal components adhere to the new style.

## Scope
- **Tailwind Config:** Define the custom Zinc palette and kinetic gradients.
- **Layout Panels:** Update `LeftPanel`, `ZoneDetails`, and header components to use tonal stepping.
- **Components:** Refactor buttons, sliders, and status indicators (avatars/rings) to the new orthogonal style.
- **Typography:** Apply global font changes and specific tracking adjustments.

## Success Criteria
- Web application UI is fully orthogonal (no rounded corners).
- Color palette is exclusively Zinc/Energy Gradient.
- Data density is maintained or increased without sacrificing legibility.

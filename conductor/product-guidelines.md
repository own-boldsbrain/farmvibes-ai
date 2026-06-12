# Product Guidelines

## Design Theme

**YSH: The Precision Architect & The Void**
The product strictly adheres to the official YSH color specification and design language:

- **The Precision Architect (Light Mode):** Focus on clarity and daylight surfaces for optimal readability of geospatial data.
- **The Void (Dark Mode):** High-performance terminal aesthetics using deep planes, ideal for analytics and prolonged usage.
- **Tonal Scale:** Exclusively uses the Zinc scale (Zinc 50 `#F9F9FB` through Zinc 950 `#09090B`).
- **Kinetic Gradient:** Used sparingly for primary triggers and high-energy states (`linear-gradient(90deg, #FFCE00 0%, #FF6600 50%, #FF0066 100%)`).

## UI/UX Principles

- **Zero-Line Integrity:** UI contrast is created entirely by tonal stacking (adjacent planes of Zinc) instead of relying on borders, outlines, or drop shadows.
- **Hardware Indicators:** Use precise, semantic colors for system states:
  - Active/Network: `#25D366` (WhatsApp Green)
  - Alert/Error: `#EF4444` (Red 500)
  - Cache/Fallback: `#3B82F6` (Blue 500)

## Documentation Style

The project maintains **two separate versions** of documentation to serve distinct audiences:

1. **Technical & API Reference:** Precise, developer-focused documentation covering operator creation, DAG structures, and API endpoints.
2. **User Guides & Tutorials:** Practical, domain-focused Jupyter Notebooks and guides demonstrating use cases (e.g., carbon footprint calculation, crop segmentation) for data scientists and agriculture experts.

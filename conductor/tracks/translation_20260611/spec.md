# Specification: Translate mapbox-agent-skills documentation to pt-br

## Overview

Translate all markdown documentation within the `op_resources/mapbox-gl-js/mapbox-agent-skills` directory and its subdirectories from English to Brazilian Portuguese (pt-br).

## Scope

- **Target Files**: All 140 `.md` files in the directory.
- **Output Format**: Translated files will be saved alongside the original files using a language suffix (e.g., `filename.pt-br.md`).
- **Translation Tool**: Use the locally configured `gemma translate` command powered by `deeplx`.

## Requirements

- Ensure no content is lost during the translation process.
- Preserve markdown formatting, links, and code blocks exactly as they appear in the original documents.
- Process files iteratively or in batches to manage terminal execution context effectively.

## Out of Scope

- Translating non-markdown files (e.g., JSON, JS, TS).
- Modifying the original English `.md` files.
- Configuring the `gemma translate` tool (assumed to be already working).

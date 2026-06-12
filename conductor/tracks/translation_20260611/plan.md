# Implementation Plan: Translate mapbox-agent-skills to pt-br

## Phase 1: Setup Translation Pipeline
- [ ] Task: List all `.md` files in the target directory
    - [ ] List all markdown files recursively in `op_resources/mapbox-gl-js/mapbox-agent-skills/`
- [ ] Task: Develop translation script
    - [ ] Write a script that iterates through the files and runs `gemma translate` with `deeplx`
    - [ ] Configure script to save output with `.pt-br.md` suffix alongside the original files
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Setup Translation Pipeline' (Protocol in workflow.md)

## Phase 2: Execute Translation
- [ ] Task: Run translation script
    - [ ] Execute the translation script over the identified files
    - [ ] Handle any command timeouts or errors gracefully
- [ ] Task: Verify translations
    - [ ] Check that `*.pt-br.md` files are generated correctly
    - [ ] Verify markdown formatting preservation on a sample of files
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Execute Translation' (Protocol in workflow.md)
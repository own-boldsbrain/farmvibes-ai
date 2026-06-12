$files = @(
"C:/Users/fjuni/Projects/01-Upstream/04-YSH-Energy/farmvibes-ai/op_resources/mapbox-gl-js/mapbox-agent-skills/skills/README.md",
"C:/Users/fjuni/Projects/01-Upstream/04-YSH-Energy/farmvibes-ai/op_resources/mapbox-gl-js/mapbox-agent-skills/skills/mapbox-android-patterns/AGENTS.md",
"C:/Users/fjuni/Projects/01-Upstream/04-YSH-Energy/farmvibes-ai/op_resources/mapbox-gl-js/mapbox-agent-skills/skills/mapbox-cartography/AGENTS.md",
"C:/Users/fjuni/Projects/01-Upstream/04-YSH-Energy/farmvibes-ai/op_resources/mapbox-gl-js/mapbox-agent-skills/skills/mapbox-cartography/SKILL.md",
"C:/Users/fjuni/Projects/01-Upstream/04-YSH-Energy/farmvibes-ai/op_resources/mapbox-gl-js/mapbox-agent-skills/skills/mapbox-cartography/references/performance-testing.md",
"C:/Users/fjuni/Projects/01-Upstream/04-YSH-Energy/farmvibes-ai/op_resources/mapbox-gl-js/mapbox-agent-skills/skills/mapbox-cartography/references/scenarios.md",
"C:/Users/fjuni/Projects/01-Upstream/04-YSH-Energy/farmvibes-ai/op_resources/mapbox-gl-js/mapbox-agent-skills/skills/mapbox-data-visualization-patterns/AGENTS.md",
"C:/Users/fjuni/Projects/01-Upstream/04-YSH-Energy/farmvibes-ai/op_resources/mapbox-gl-js/mapbox-agent-skills/skills/mapbox-data-visualization-patterns/SKILL.md"
)

foreach ($file in $files) {
    $target = $file -replace "\.md$", ".pt-br.md"
    if (Test-Path $target) {
        Write-Output "Skipping $file"
        continue
    }
    
    if (-not (Test-Path $file)) {
        Write-Error "File not found: $file"
        continue
    }

    try {
        $content = Get-Content -Raw $file -Encoding utf8
        $json = @{
            text = $content
            source = "en"
            target = "pt"
        } | ConvertTo-Json -Depth 100
        
        $response = Invoke-RestMethod -Uri http://localhost:1188/translate -Method Post -Body $json -ContentType "application/json"
        
        if ($response.text) {
            $response.text | Out-File $target -Encoding utf8
            Write-Output "Successfully processed: $file"
        } else {
            Write-Error "Translation failed for: $file"
        }
    } catch {
        Write-Error "Error processing $file`: $_"
    }
}

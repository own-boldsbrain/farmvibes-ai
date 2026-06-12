import requests
import json
import os

files = [
    r"C:\Users\fjuni\Projects\01-Upstream\04-YSH-Energy\farmvibes-ai\op_resources\mapbox-gl-js\mapbox-agent-skills\skills\mapbox-cartography\AGENTS.md",
    r"C:\Users\fjuni\Projects\01-Upstream\04-YSH-Energy\farmvibes-ai\op_resources\mapbox-gl-js\mapbox-agent-skills\skills\mapbox-cartography\SKILL.md",
    r"C:\Users\fjuni\Projects\01-Upstream\04-YSH-Energy\farmvibes-ai\op_resources\mapbox-gl-js\mapbox-agent-skills\skills\mapbox-cartography\references\performance-testing.md",
    r"C:\Users\fjuni\Projects\01-Upstream\04-YSH-Energy\farmvibes-ai\op_resources\mapbox-gl-js\mapbox-agent-skills\skills\mapbox-cartography\references\scenarios.md"
]

for file_path in files:
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        continue
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    try:
        response = requests.post(
            "http://localhost:1188/translate",
            json={"text": content, "source": "en", "target": "pt"},
            timeout=300
        )
        response.raise_for_status()
        result = response.json()
        translated_content = result.get('data', '')
        
        output_path = file_path.replace('.md', '.pt-br.md')
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(translated_content)
        print(f"Translated: {file_path} -> {output_path}")
    except Exception as e:
        print(f"Error translating {file_path}: {e}")

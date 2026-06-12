import os
import subprocess
import json

directories = [
    r"C:\Users\fjuni\Projects\01-Upstream\04-YSH-Energy\farmvibes-ai\op_resources\mapbox-gl-js\mapbox-agent-skills\skills\mapbox-ios-patterns",
    r"C:\Users\fjuni\Projects\01-Upstream\04-YSH-Energy\farmvibes-ai\op_resources\mapbox-gl-js\mapbox-agent-skills\skills\mapbox-location-grounding",
    r"C:\Users\fjuni\Projects\01-Upstream\04-YSH-Energy\farmvibes-ai\op_resources\mapbox-gl-js\mapbox-agent-skills\skills\mapbox-maplibre-migration",
    r"C:\Users\fjuni\Projects\01-Upstream\04-YSH-Energy\farmvibes-ai\op_resources\mapbox-gl-js\mapbox-agent-skills\skills\mapbox-mcp-devkit-patterns",
    r"C:\Users\fjuni\Projects\01-Upstream\04-YSH-Energy\farmvibes-ai\op_resources\mapbox-gl-js\mapbox-agent-skills\skills\mapbox-mcp-runtime-patterns",
    r"C:\Users\fjuni\Projects\01-Upstream\04-YSH-Energy\farmvibes-ai\op_resources\mapbox-gl-js\mapbox-agent-skills\skills\mapbox-search-integration",
    r"C:\Users\fjuni\Projects\01-Upstream\04-YSH-Energy\farmvibes-ai\op_resources\mapbox-gl-js\mapbox-agent-skills\skills\mapbox-search-patterns"
]

successful = []
failed = []

for directory in directories:
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(".md") and not file.endswith(".pt-br.md"):
                path = os.path.join(root, file)
                new_path = path.replace(".md", ".pt-br.md")
                if not os.path.exists(new_path):
                    try:
                        with open(path, "r", encoding="utf-8") as f:
                            text = f.read()
                        
                        # Prepare data for translation
                        data = {"text": text, "source": "en", "target": "pt"}
                        
                        # Use subprocess to call curl
                        # Using a temporary file for the JSON body to avoid command line length limits
                        with open("temp_data.json", "w", encoding="utf-8") as f:
                            json.dump(data, f)
                        
                        curl_cmd = [
                            "curl", "-s", "-X", "POST", "http://localhost:1188/translate",
                            "-H", "Content-Type: application/json",
                            "--data-binary", "@temp_data.json"
                        ]
                        
                        result = subprocess.run(curl_cmd, capture_output=True, text=True)
                        
                        if result.returncode == 0:
                            response_json = json.loads(result.stdout)
                            if "text" in response_json:
                                translated_text = response_json["text"]
                                with open(new_path, "w", encoding="utf-8") as f:
                                    f.write(translated_text)
                                successful.append(path)
                            else:
                                failed.append(f"{path}: {result.stdout}")
                        else:
                            failed.append(f"{path}: {result.stderr}")
                    except Exception as e:
                        failed.append(f"{path}: {str(e)}")

# Cleanup
if os.path.exists("temp_data.json"):
    os.remove("temp_data.json")

print("\n--- Successful Translations ---")
for s in successful:
    print(s)
    
print("\n--- Failed Translations ---")
for f in failed:
    print(f)

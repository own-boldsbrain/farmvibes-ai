import json
import os
import sys
import requests

MODEL = "translategemma:4b"
OLLAMA_URL = "http://localhost:11434/api/generate"

def translate_text(text, is_code=False):
    if not text.strip():
        return text
    
    if is_code:
        prompt = f"Translate the comments in the following Python code from English to Brazilian Portuguese (pt-br). Keep the code exactly as it is, only translate the comments starting with #. Return ONLY the translated code:\n\n{text}"
    else:
        prompt = f"Translate the following Markdown text from English to Brazilian Portuguese (pt-br). Preserve all formatting, links, and markdown syntax. Return ONLY the translated text:\n\n{text}"
    
    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": MODEL,
                "prompt": prompt,
                "stream": False
            },
            timeout=60
        )
        response.raise_for_status()
        return response.json().get("response", "").strip()
    except Exception as e:
        print(f"Error translating: {e}", file=sys.stderr)
        return text

def translate_notebook(file_path):
    print(f"Translating {file_path}...")
    with open(file_path, 'r', encoding='utf-8') as f:
        nb = json.load(f)
    
    for cell in nb.get('cells', []):
        source_lines = cell.get('source', [])
        if not source_lines:
            continue
        
        source_text = "".join(source_lines)
        
        if cell['cell_type'] == 'markdown':
            translated = translate_text(source_text, is_code=False)
            cell['source'] = [line + '\n' for line in translated.split('\n')]
            if not translated.endswith('\n') and cell['source']:
                cell['source'][-1] = cell['source'][-1].rstrip('\n')
        
        elif cell['cell_type'] == 'code':
            if '#' in source_text:
                translated = translate_text(source_text, is_code=True)
                cell['source'] = [line + '\n' for line in translated.split('\n')]
                if not translated.endswith('\n') and cell['source']:
                    cell['source'][-1] = cell['source'][-1].rstrip('\n')
                    
    new_path = file_path.replace('.ipynb', '.pt-br.ipynb')
    with open(new_path, 'w', encoding='utf-8') as f:
        json.dump(nb, f, indent=1, ensure_ascii=False)
    print(f"Saved to {new_path}")

if __name__ == "__main__":
    for arg in sys.argv[1:]:
        if os.path.isfile(arg):
            translate_notebook(arg)
        elif os.path.isdir(arg):
            for root, dirs, files in os.walk(arg):
                for file in files:
                    if file.endswith('.ipynb') and '.pt-br.' not in file:
                        translate_notebook(os.path.join(root, file))

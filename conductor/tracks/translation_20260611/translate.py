import subprocess
import os
import sys
import re

def strip_spinners(text):
    # Braille patterns are in the range U+2800 to U+28FF
    text = re.sub(r'[\u2800-\u28FF]', '', text)
    # ANSI escape sequences
    text = re.sub(r'\x1b\[[0-9;]*[a-zA-Z]', '', text)
    return text

def strip_filler(text):
    # Some models add "Here is the translation:" or similar.
    # This is harder to strip reliably, but we can try to find the first header or content.
    # For now, let's hope a better prompt helps.
    return text.strip()

def translate_file(input_file):
    output_file = input_file.replace('.md', '.pt-br.md')
    print(f"Translating {input_file} to {output_file}...")
    
    # Forceful prompt
    system_prompt = "Translate the following markdown from English to Brazilian Portuguese. Your response must contain ONLY the translated markdown. Do not include any introductory text, explanations, or conclusions. Do not repeat the input."
    
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # We combine prompt and content to be very explicit
        full_input = f"{system_prompt}\n\nInput Markdown:\n{content}"
        
        cmd = ["ollama.exe", "run", "translategemma:4b", full_input]
        
        # We don't use stdin pipe if we pass it as an argument, but shell limits might apply.
        # So we use stdin.
        process = subprocess.Popen(["ollama.exe", "run", "translategemma:4b", system_prompt], 
                                   stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, 
                                   text=True, encoding='utf-8')
        stdout, stderr = process.communicate(input=content)
        
        if process.returncode != 0:
            print(f"Error translating {input_file}: {stderr}")
            return False
            
        translated = strip_spinners(stdout)
        translated = strip_filler(translated)
        
        # Write translated content
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(translated)
            
        print(f"Successfully translated {input_file}")
        return True
    except Exception as e:
        print(f"Exception translating {input_file}: {e}")
        return False

def main():
    file_list_path = 'conductor/tracks/translation_20260611/file_list.txt'
    if not os.path.exists(file_list_path):
        print(f"File list not found: {file_list_path}")
        return

    with open(file_list_path, 'r', encoding='utf-8') as f:
        files = [line.strip() for line in f if line.strip()]

    success_count = 0
    # Process sequentially
    for i, file_path in enumerate(files):
        # Skip if already translated (optional, but good for resuming)
        # output_file = file_path.replace('.md', '.pt-br.md')
        # if os.path.exists(output_file):
        #     print(f"[{i+1}/{len(files)}] Skipping {file_path} (already exists)")
        #     success_count += 1
        #     continue

        print(f"[{i+1}/{len(files)}] Processing {file_path}")
        if translate_file(file_path):
            success_count += 1
        
    print(f"Finished. Successfully translated {success_count}/{len(files)} files.")

if __name__ == "__main__":
    main()

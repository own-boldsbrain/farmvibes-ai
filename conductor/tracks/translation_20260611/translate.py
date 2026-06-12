import subprocess
import os
import sys

def translate_file(input_file):
    output_file = input_file.replace('.md', '.pt-br.md')
    print(f"Translating {input_file} to {output_file}...")
    
    # Prompt for the model
    prompt = "Translate the following markdown from English to Brazilian Portuguese. Output ONLY the translated markdown, preserving all formatting, links, and code blocks. Do not omit any content or provide any explanation."
    
    try:
        # We use a temporary file for the prompt + content to avoid shell issues with large strings
        # or we can pipe the content. 
        # Using subprocess.PIPE for stdin
        cmd = ["ollama.exe", "run", "translategemma:4b", prompt]
        
        with open(input_file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        process = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, encoding='utf-8')
        stdout, stderr = process.communicate(input=content)
        
        if process.returncode != 0:
            print(f"Error translating {input_file}: {stderr}")
            return False
            
        # Write translated content
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(stdout.strip())
            
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

    # To avoid overloading or for testing, we could limit.
    # But the task is to translate all.
    success_count = 0
    for i, file_path in enumerate(files):
        print(f"[{i+1}/{len(files)}] Processing {file_path}")
        if translate_file(file_path):
            success_count += 1
        
    print(f"Finished. Successfully translated {success_count}/{len(files)} files.")

if __name__ == "__main__":
    main()

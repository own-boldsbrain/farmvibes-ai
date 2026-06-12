import subprocess
import os
import sys
import re

def clean_vt_output(text):
    """
    Handles basic virtual terminal sequences like Cursor Left (ESC[nD) 
    and Erase in Line (ESC[K) to reconstruct the intended text.
    """
    # 1. Strip Braille spinners
    text = re.sub(r'[\u2800-\u28FF]', '', text)
    
    # 2. Process Cursor Left and Erase Line
    # We'll iterate through the string and maintain a buffer
    output = []
    cursor = 0
    
    # Find all escape sequences
    # ESC [ <digits> <char>
    segments = re.split(r'(\x1b\[[0-9;]*[a-zA-Z])', text)
    
    for seg in segments:
        if not seg:
            continue
        
        if seg.startswith('\x1b['):
            # Parse the sequence
            match = re.match(r'\x1b\[([0-9]*)?([a-zA-Z])', seg)
            if match:
                val = match.group(1)
                cmd = match.group(2)
                n = int(val) if val else 1
                
                if cmd == 'D': # Cursor Left
                    cursor = max(0, cursor - n)
                elif cmd == 'K': # Erase in Line
                    # Usually ESC[K erases from cursor to end of line
                    # In our case, it often means the model is about to overwrite
                    # We can just truncate the output buffer at the cursor
                    output = output[:cursor]
                elif cmd == 'C': # Cursor Forward
                    cursor += n
                    # Pad with spaces if needed
                    while len(output) < cursor:
                        output.append(' ')
                # Add other codes if necessary (H, J, etc.)
        else:
            # It's literal text
            # We insert/overwrite at the cursor position
            for char in seg:
                if cursor < len(output):
                    output[cursor] = char
                else:
                    output.append(char)
                cursor += 1
                
    return "".join(output).strip()

def translate_file(input_file):
    output_file = input_file.replace('.md', '.pt-br.md')
    print(f"Translating {input_file} to {output_file}...")
    
    # Forceful prompt to get clean output
    system_prompt = (
        "You are a professional translator. Translate the following markdown from English to Brazilian Portuguese. "
        "Maintain all markdown structure, links, images, and code blocks exactly. "
        "Do not add any preamble, comments, or explanations. "
        "Output ONLY the translated content."
    )
    
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Call ollama.exe
        # We pass the system prompt as a system message if supported, 
        # or just as part of the prompt.
        # Ollama CLI uses stdin for the prompt if no argument is given, 
        # but here we want to pass a specific system instruction.
        
        # Combined prompt
        full_prompt = f"{system_prompt}\n\nContent to translate:\n{content}"
        
        process = subprocess.Popen(["ollama.exe", "run", "translategemma:4b"], 
                                   stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, 
                                   text=True, encoding='utf-8')
        
        # Send full prompt and close stdin to signal EOF
        stdout, stderr = process.communicate(input=full_prompt)
        
        if process.returncode != 0:
            print(f"Error translating {input_file}: {stderr}")
            return False
            
        # Clean the output
        translated = clean_vt_output(stdout)
        
        # Final cleanup: sometimes the model repeats the prompt or adds "Here is the translation:"
        # We try to remove the common prefix if the model repeats the prompt
        if translated.startswith(system_prompt):
            translated = translated[len(system_prompt):].strip()
        
        # Remove "Content to translate:" or similar if present
        translated = re.sub(r'^.*?Content to translate:.*?\n', '', translated, flags=re.DOTALL | re.IGNORECASE).strip()
        
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
    for i, file_path in enumerate(files):
        print(f"[{i+1}/{len(files)}] Processing {file_path}")
        if translate_file(file_path):
            success_count += 1
        
    print(f"Finished. Successfully translated {success_count}/{len(files)} files.")

if __name__ == "__main__":
    main()

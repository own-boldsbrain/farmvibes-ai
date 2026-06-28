import os

features_dir = r"C:\Users\fjuni\farmvibes-ai\op_resources\electricitymaps-contrib-rewrite-master\web\src\features"

def inject_exists_mock(dir_path):
    target_pattern = "i18n: { language: 'pt-BR' }"
    replacement = "i18n: { language: 'pt-BR', exists: () => true }"
    
    for root, dirs, files in os.walk(dir_path):
        for file in files:
            if not file.endswith(".test.tsx"):
                continue
            
            file_path = os.path.join(root, file)
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
            
            if target_pattern in content:
                content = content.replace(target_pattern, replacement)
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(content)
                print(f"Updated i18n mock in: {file}")

if __name__ == "__main__":
    inject_exists_mock(features_dir)
    print("Done updating i18n mocks!")

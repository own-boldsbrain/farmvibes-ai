import os

features_dir = r"C:\Users\fjuni\farmvibes-ai\op_resources\electricitymaps-contrib-rewrite-master\web\src\features"

def inject_setatom(dir_path):
    target = (
        "vi.mock('jotai', () => ({\n"
        "  useAtom: () => [{ datetimeString: new Date().toISOString() }, vi.fn()],\n"
        "  atom: () => ({}),\n"
        "}));"
    )
    replacement = (
        "vi.mock('jotai', () => ({\n"
        "  useAtom: () => [{ datetimeString: new Date().toISOString() }, vi.fn()],\n"
        "  atom: () => ({}),\n"
        "  useSetAtom: () => vi.fn(),\n"
        "}));"
    )
    
    for root, dirs, files in os.walk(dir_path):
        for file in files:
            if not file.endswith(".test.tsx"):
                continue
            
            file_path = os.path.join(root, file)
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
            
            if target in content:
                content = content.replace(target, replacement)
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(content)
                print(f"Updated Jotai setAtom mock in: {file}")

if __name__ == "__main__":
    inject_setatom(features_dir)
    print("Done updating Jotai setAtom mocks!")

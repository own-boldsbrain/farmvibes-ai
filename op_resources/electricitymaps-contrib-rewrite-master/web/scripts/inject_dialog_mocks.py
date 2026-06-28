import os

features_dir = r"C:\Users\fjuni\farmvibes-ai\op_resources\electricitymaps-contrib-rewrite-master\web\src\features"

dialog_mock_string = """
vi.mock('@radix-ui/react-dialog', () => {
  return {
    Root: ({ children, open }: any) => open ? React.createElement('div', null, children) : null,
    Portal: ({ children }: any) => React.createElement('div', null, children),
    Overlay: () => React.createElement('div', null),
    Content: ({ children }: any) => React.createElement('div', null, children),
    Title: ({ children }: any) => React.createElement('h3', null, children),
    Close: ({ children }: any) => React.createElement('button', null, children),
  };
});
"""

modal_test_files = [
    "modals/InfoModal.test.tsx",
    "modals/SettingsModal.test.tsx",
    "modals/FAQModal.test.tsx"
]

def inject():
    for rel_path in modal_test_files:
        abs_path = os.path.join(features_dir, rel_path.replace("/", os.sep))
        with open(abs_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        if "@radix-ui/react-dialog" not in content:
            # We also need to import React if we use React.createElement
            if "import React" not in content:
                content = "import React from 'react';\n" + content
            
            # Append mock before describe block
            describe_idx = content.find("describe(")
            content = content[:describe_idx] + dialog_mock_string + "\n" + content[describe_idx:]
            
            with open(abs_path, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"Injected dialog mock in: {rel_path}")

if __name__ == "__main__":
    inject()

import os
import re

features_dir = r"C:\Users\fjuni\farmvibes-ai\op_resources\electricitymaps-contrib-rewrite-master\web\src\features"

def walk_and_refine(dir_path):
    for root, dirs, files in os.walk(dir_path):
        for file in files:
            if not file.endswith(".test.tsx"):
                continue
            
            # Read test file
            test_path = os.path.join(root, file)
            with open(test_path, "r", encoding="utf-8") as f:
                content = f.read()
            
            base_name = file[:-9]  # Remove .test.tsx
            mock_name = f"mock{base_name}Props"
            
            # Check if it already imports the mock props
            if f"import {{ {mock_name} }}" not in content:
                # Add mock import and spread the props
                # Find the import component line
                component_import_match = re.search(r"import\s+(\w+|\{\s*\w+\s*\})\s+from\s+'\./" + base_name + "';", content)
                if component_import_match:
                    comp_import = component_import_match.group(0)
                    new_import = f"import {{ {mock_name} }} from './{base_name}.mock';\n" + comp_import
                    content = content.replace(comp_import, new_import)
                
                # Replace <Component /> with <Component {...mockProps} />
                # We need to make sure we replace only the rendering tag
                # Find all `<Component />` and replace with `<Component {...mockComponentProps} />`
                # Let's handle both default and named imports
                has_default = "import " + base_name + " from" in content
                
                # Let's find named exports inside the import match
                named_match = re.search(r"import\s+\{\s*(\w+)\s*\}\s+from\s+'\./" + base_name + "';", content)
                rendered_tag = base_name
                if named_match:
                    rendered_tag = named_match.group(1)
                
                content = content.replace(f"<{rendered_tag} />", f"<{rendered_tag} {{...{mock_name}}} />")
                
                with open(test_path, "w", encoding="utf-8") as f:
                    f.write(content)
                print(f"Refined test {file}")

if __name__ == "__main__":
    walk_and_refine(features_dir)
    print("Done refactoring all feature tests to use mock props!")

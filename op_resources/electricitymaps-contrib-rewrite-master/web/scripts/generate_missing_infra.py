import os
import re

features_dir = r"C:\Users\fjuni\farmvibes-ai\op_resources\electricitymaps-contrib-rewrite-master\web\src\features"

def parse_exports(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    has_default = "export default" in content
    
    # Try to find named function or class exports
    named_exports = re.findall(r"export\s+(?:function|const|class)\s+(\w+)", content)
    
    # Exclude keywords
    named_exports = [x for x in named_exports if x not in ("default", "const", "let", "var")]
    
    return has_default, named_exports

def generate_infra(dir_path):
    for root, dirs, files in os.walk(dir_path):
        for file in files:
            if not file.endswith(".tsx"):
                continue
            if file.endswith(".test.tsx") or file.endswith(".stories.tsx") or file.endswith(".cy.tsx"):
                continue
            
            base_name = file[:-4]  # Remove .tsx
            file_path = os.path.join(root, file)
            
            # Check exports
            try:
                has_default, named_exports = parse_exports(file_path)
            except Exception as e:
                print(f"Error parsing {file}: {e}")
                continue
            
            # Determine how to import the component in tests/stories
            comp_name = base_name
            if named_exports and not has_default:
                import_statement = f"import {{ {named_exports[0]} }} from './{base_name}';"
                render_tag = f"<{named_exports[0]} />"
                exported_class = named_exports[0]
            elif has_default:
                import_statement = f"import {base_name} from './{base_name}';"
                render_tag = f"<{base_name} />"
                exported_class = base_name
            else:
                import_statement = f"import {base_name} from './{base_name}';"
                render_tag = f"<{base_name} />"
                exported_class = base_name
            
            mock_file = os.path.join(root, f"{base_name}.mock.ts")
            test_file = os.path.join(root, f"{base_name}.test.tsx")
            story_file = os.path.join(root, f"{base_name}.stories.tsx")
            
            # 1. Create mock file if missing
            if not os.path.exists(mock_file):
                print(f"Creating mock for {base_name}")
                with open(mock_file, "w", encoding="utf-8") as f:
                    f.write(f"export const mock{base_name}Props = {{\n  // Add default mock props here\n}};\n")
            
            # 2. Create test file if missing
            if not os.path.exists(test_file):
                print(f"Creating test for {base_name}")
                with open(test_file, "w", encoding="utf-8") as f:
                    test_content = (
                        "import { describe, it, expect, vi } from 'vitest';\n"
                        "import { render } from '@testing-library/react';\n"
                        f"{import_statement}\n\n"
                        "// Common mocks to prevent React context and Jotai state initialization issues\n"
                        "vi.mock('jotai', () => ({\n"
                        "  useAtom: () => [null, vi.fn()],\n"
                        "  atom: () => ({}),\n"
                        "}));\n\n"
                        "vi.mock('translation/translation', () => ({\n"
                        "  useTranslation: () => ({\n"
                        "    __: (key: string) => key,\n"
                        "    i18n: { language: 'pt-BR' },\n"
                        "  }),\n"
                        "}));\n\n"
                        "vi.mock('react-router-dom', () => ({\n"
                        "  useNavigate: () => vi.fn(),\n"
                        "  useLocation: () => ({ search: '', hash: '' }),\n"
                        "  useParams: () => ({}),\n"
                        "  useSearchParams: () => [{ get: () => null }],\n"
                        "  resolvePath: (path: string) => path,\n"
                        "}));\n\n"
                        f"describe('<{base_name} />', () => {{\n"
                        "  it('renders correctly', () => {\n"
                        f"    const {{ container }} = render({render_tag});\n"
                        "    expect(container).toBeDefined();\n"
                        "  });\n"
                        "});\n"
                    )
                    f.write(test_content)
            
            # 3. Create story file if missing
            if not os.path.exists(story_file):
                print(f"Creating story for {base_name}")
                with open(story_file, "w", encoding="utf-8") as f:
                    story_content = (
                        "import type { Meta, StoryObj } from '@storybook/react';\n"
                        f"{import_statement}\n\n"
                        f"const meta: Meta<typeof {exported_class}> = {{\n"
                        f"  title: 'Features/{base_name}',\n"
                        f"  component: {exported_class},\n"
                        "}};\n\n"
                        "export default meta;\n"
                        f"type Story = StoryObj<typeof {exported_class}>;\n\n"
                        "export const Default: Story = {};\n"
                    )
                    f.write(story_content)

if __name__ == "__main__":
    generate_infra(features_dir)
    print("Done generating missing component stories, tests, and mocks!")

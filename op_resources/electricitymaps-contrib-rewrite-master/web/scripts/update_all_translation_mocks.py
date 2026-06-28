import os

features_dir = r"C:\Users\fjuni\farmvibes-ai\op_resources\electricitymaps-contrib-rewrite-master\web\src\features"

def update_mocks(dir_path):
    target = (
        "vi.mock('translation/translation', () => ({\n"
        "  useTranslation: () => ({\n"
        "    __: (key: string) => key,\n"
        "    i18n: { language: 'pt-BR', exists: () => true },\n"
        "  }),\n"
        "}));"
    )
    replacement = (
        "vi.mock('translation/translation', () => ({\n"
        "  useTranslation: () => ({\n"
        "    __: (key: string) => key,\n"
        "    i18n: { language: 'pt-BR', exists: () => true },\n"
        "  }),\n"
        "  getZoneName: (zoneId: string) => `Zone-${zoneId}`,\n"
        "  getCountryName: (zoneId: string) => `Country-${zoneId}`,\n"
        "  getShortenedZoneNameWithCountry: (zoneId: string) => `Short-${zoneId}`,\n"
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
                print(f"Updated translation mock in: {file}")

if __name__ == "__main__":
    update_mocks(features_dir)
    print("Done updating local translation mocks!")

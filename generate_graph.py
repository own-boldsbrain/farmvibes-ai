import sqlite3
import json
import os
import re

def generate_graph():
    db_path = '.codegraph/codegraph.db'
    if not os.path.exists(db_path):
        print(f"Error: {db_path} not found.")
        return

    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    # Query edges first to calculate degrees
    cursor.execute("SELECT source, target, kind FROM edges")
    raw_edges = cursor.fetchall()
    degrees = {}
    for row in raw_edges:
        s, t = row["source"], row["target"]
        degrees[s] = degrees.get(s, 0) + 1
        degrees[t] = degrees.get(t, 0) + 1

    # Query nodes
    cursor.execute("SELECT id, kind, name, file_path FROM nodes WHERE kind != 'import'")
    nodes = []
    for row in cursor.fetchall():
        n_id = row["id"]
        kind = row["kind"]
        name = row["name"]
        file_path = row["file_path"] or ""
        
        # 1. Component Layer
        layer = "other"
        file_lower = file_path.lower()
        if "src/vibe_core" in file_lower or "vibe-core" in file_lower:
            layer = "core"
        elif "src/vibe_agent" in file_lower or "vibe-agent" in file_lower:
            layer = "agent"
        elif "src/vibe_server" in file_lower or "vibe-server" in file_lower:
            layer = "server"
        elif "src/vibe_lib" in file_lower or "vibe-lib" in file_lower:
            layer = "lib"
        elif "notebooks/" in file_lower:
            layer = "notebook"
        elif "ops/" in file_lower:
            layer = "operator"
        elif "workflows/" in file_lower:
            layer = "workflow"
        elif "tests/" in file_lower:
            layer = "test"
            
        # 2. Business Domain
        domain = "general"
        name_lower = name.lower()
        path_lower = file_path.lower()
        
        climate_kws = ["weather", "era5", "climate", "deepmc", "forecast", "precipitation", "temp", "chirps", "wind", "rain"]
        agri_kws = ["crop", "farm", "segmentation", "ndvi", "vegetation", "field", "harvest", "yield", "soil"]
        sustain_kws = ["carbon", "greenhouse", "co2", "scheduler", "sustainability", "ghg", "emission"]
        geospatial_kws = ["satellite", "sentinel", "landsat", "raster", "spaceeye", "tiff", "geojson", "shapefile", "geom", "crs", "bbox", "dem", "elevation"]
        platform_kws = ["api", "server", "client", "agent", "runner", "workflow", "op", "connection", "rest", "docker", "cluster", "k8s"]
        
        if any(k in name_lower or k in path_lower for k in climate_kws):
            domain = "climate & weather"
        elif any(k in name_lower or k in path_lower for k in agri_kws):
            domain = "agriculture"
        elif any(k in name_lower or k in path_lower for k in sustain_kws):
            domain = "sustainability & carbon"
        elif any(k in name_lower or k in path_lower for k in geospatial_kws):
            domain = "geospatial"
        elif any(k in name_lower or k in path_lower for k in platform_kws):
            domain = "platform core"

        # 3. Complexity Tier
        deg = degrees.get(n_id, 0)
        if deg > 20:
            complexity = "high"
        elif deg > 5:
            complexity = "medium"
        else:
            complexity = "low"

        nodes.append({
            "id": n_id,
            "name": name,
            "val": 5 if kind == "file" else (3 if kind == "class" else 1),
            "kind": kind,
            "file": file_path,
            "layer": layer,
            "domain": domain,
            "complexity": complexity,
            "degree": deg
        })

    # Query edges for graph links (filtering to existing nodes)
    node_ids = {n["id"] for n in nodes}
    links = []
    for row in raw_edges:
        if row["source"] in node_ids and row["target"] in node_ids:
            links.append({
                "source": row["source"],
                "target": row["target"],
                "kind": row["kind"]
            })

    conn.close()

    # Load from temp_head.html as the layout template
    template_path = 'temp_head.html'
    if not os.path.exists(template_path):
        print(f"Error: {template_path} template not found.")
        return

    with open(template_path, 'r', encoding='utf-8') as f:
        html_template = f.read()

    # Reconstruct the gData block
    g_data_str = f"const gData = {{\n            nodes: {json.dumps(nodes)},\n            links: {json.dumps(links)}\n        }};"

    # Find and replace the gData definition in the template
    # We will use re.sub with DOTALL to replace const gData = { ... };
    pattern = re.compile(r'const gData = \{.*?\};', re.DOTALL)
    if not pattern.search(html_template):
        print("Error: Could not find const gData declaration in template.")
        return

    updated_html = pattern.sub(g_data_str, html_template)

    with open('codegraph.html', 'w', encoding='utf-8') as f:
        f.write(updated_html)
    print("YSH Graph updated successfully: codegraph.html using temp_head.html template.")

if __name__ == "__main__":
    generate_graph()

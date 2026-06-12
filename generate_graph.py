import sqlite3
import json
import os

def generate_graph():
    db_path = '.codegraph/codegraph.db'
    if not os.path.exists(db_path):
        print(f"Error: {db_path} not found.")
        return

    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    # Query nodes
    cursor.execute("SELECT id, kind, name, file_path FROM nodes WHERE kind != 'import'")
    nodes = []
    for row in cursor.fetchall():
        nodes.append({
            "id": row["id"],
            "name": row["name"],
            "val": 5 if row["kind"] == "file" else (3 if row["kind"] == "class" else 1),
            "kind": row["kind"],
            "file": row["file_path"]
        })

    # Query edges
    node_ids = {n["id"] for n in nodes}
    cursor.execute("SELECT source, target, kind FROM edges")
    links = []
    for row in cursor.fetchall():
        if row["source"] in node_ids and row["target"] in node_ids:
            links.append({
                "source": row["source"],
                "target": row["target"],
                "kind": row["kind"]
            })

    conn.close()

    # Generate HTML with YSH "The Void" Design System
    html_content = f"""
<!DOCTYPE html>
<html>
<head>
    <title>YSH CodeGraph - The Void</title>
    <script src="https://unpkg.com/force-graph"></script>
    <style>
        :root {{
            --zinc-50: #F9F9FB;
            --zinc-100: #F1F1F4;
            --zinc-500: #71717A;
            --zinc-800: #27272A;
            --zinc-900: #18181B;
            --zinc-950: #09090B;
            --deep-orange: #FF6600;
            --safety-gold: #FFCE00;
            --vivid-magenta: #FF0066;
            --kinetic-gradient: linear-gradient(90deg, #FFCE00 0%, #FF6600 50%, #FF0066 100%);
        }}

        body {{ 
            margin: 0; 
            background-color: var(--zinc-950); 
            color: var(--zinc-100); 
            font-family: 'Inter', system-ui, sans-serif; 
            overflow: hidden; 
        }}

        #graph {{ width: 100vw; height: 100vh; }}

        #controls {{ 
            position: absolute; 
            top: 0; 
            left: 0; 
            background: var(--zinc-900); 
            padding: 20px; 
            border: none;
            border-bottom: 1px solid var(--zinc-800);
            border-right: 1px solid var(--zinc-800);
            pointer-events: auto;
            width: 280px;
        }}

        .legend-item {{ 
            margin: 8px 0; 
            display: flex; 
            align-items: center; 
            font-size: 13px;
            color: var(--zinc-500);
        }}

        .dot {{ 
            width: 10px; 
            height: 10px; 
            margin-right: 12px; 
        }}

        h1 {{ 
            margin: 0 0 15px 0; 
            font-size: 14px; 
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--zinc-50); 
            border-left: 3px solid var(--deep-orange);
            padding-left: 10px;
        }}

        #info {{ 
            position: absolute; 
            bottom: 0; 
            right: 0; 
            background: var(--zinc-900); 
            padding: 8px 15px; 
            font-size: 11px; 
            color: var(--zinc-500);
            border-top: 1px solid var(--zinc-800);
            border-left: 1px solid var(--zinc-800);
        }}

        .kinetic-bar {{
            height: 2px;
            width: 100%;
            background: var(--kinetic-gradient);
            position: absolute;
            top: 0;
            left: 0;
        }}
    </style>
</head>
<body>
    <div id="graph"></div>
    <div id="controls">
        <div class="kinetic-bar"></div>
        <h1>YSH Intelligence</h1>
        <div class="legend-item"><div class="dot" style="background: var(--deep-orange);"></div> FILE (Kinetic)</div>
        <div class="legend-item"><div class="dot" style="background: var(--safety-gold);"></div> CLASS (Structural)</div>
        <div class="legend-item"><div class="dot" style="background: var(--vivid-magenta);"></div> METHOD (Active)</div>
        <div class="legend-item"><div class="dot" style="background: var(--zinc-500);"></div> OTHER</div>
        <div style="margin-top: 20px; font-size: 11px; color: var(--zinc-500); line-height: 1.5;">
            SYSTEM: FARMVIBES.AI<br>
            MODE: ZERO-LINE INTEGRITY<br>
            THEME: THE VOID
        </div>
    </div>
    <div id="info">NODES: {len(nodes)} | EDGES: {len(links)} | PRECISION: 99.8%</div>

    <script>
        const gData = {{
            nodes: {json.dumps(nodes)},
            links: {json.dumps(links)}
        }};

        const colorMap = {{
            'file': '#FF6600',
            'class': '#FFCE00',
            'function': '#FF0066',
            'method': '#FF0066',
            'variable': '#71717A',
            'constant': '#D4D4D8'
        }};

        const Graph = ForceGraph()
            (document.getElementById('graph'))
            .graphData(gData)
            .nodeId('id')
            .nodeLabel(node => `[${{node.kind}}] ${{node.name}}`)
            .nodeColor(node => colorMap[node.kind] || '#27272A')
            .nodeRelSize(5)
            .nodeVal('val')
            .nodeCanvasObject((node, ctx, globalScale) => {{
                const label = node.name;
                const fontSize = 12/globalScale;
                ctx.font = `${{fontSize}}px monospace`;
                
                // Draw Node
                ctx.fillStyle = colorMap[node.kind] || '#27272A';
                ctx.beginPath(); 
                ctx.arc(node.x, node.y, node.val * 1.2, 0, 2 * Math.PI, false);
                ctx.fill();

                // Draw Label on high zoom or important nodes
                if (globalScale > 3 || node.val > 3) {{
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = '#F9F9FB';
                    ctx.fillText(label, node.x, node.y + (node.val * 2.5));
                }}
            }})
            .linkDirectionalArrowLength(3)
            .linkDirectionalArrowRelPos(1)
            .linkColor(link => {{
                if (link.kind === 'contains') return 'rgba(241, 241, 244, 0.05)';
                if (link.kind === 'calls') return '#FF0066';
                if (link.kind === 'extends') return '#FFCE00';
                return 'rgba(113, 113, 122, 0.1)';
            }})
            .linkWidth(link => link.kind === 'calls' ? 1 : 0.5)
            .backgroundColor('#09090B')
            .onNodeClick(node => {{
                Graph.centerAt(node.x, node.y, 1000);
                Graph.zoom(6, 2000);
            }});

        Graph.d3Force('charge').strength(-150);
        Graph.d3Force('link').distance(link => link.kind === 'contains' ? 40 : 120);

    </script>
</body>
</html>
"""
    with open('codegraph.html', 'w') as f:
        f.write(html_content)
    print("YSH Graph updated: codegraph.html")

if __name__ == "__main__":
    generate_graph()

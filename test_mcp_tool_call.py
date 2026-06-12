import asyncio
from vibe_server.mcp_client import GeoAIClient

async def main():
    client = GeoAIClient("python", ["-m", "geoai_mcp_server.server"], {
        "GEOAI_INPUT_DIR": r"C:\Users\fjuni\Projects\01-Upstream\04-YSH-Energy\farmvibes-ai\op_resources\input",
        "GEOAI_OUTPUT_DIR": r"C:\Users\fjuni\Projects\01-Upstream\04-YSH-Energy\farmvibes-ai\op_resources\output",
        "GEOAI_LOG_LEVEL": "DEBUG"
    })
    # List tools is a special MCP method, not a tool, 
    # but the tool call should work for other tools.
    # Let's try calling 'list_available_files' which is a tool.
    result = await client.call_tool("list_available_files", {})
    print(result)

if __name__ == "__main__":
    asyncio.run(main())

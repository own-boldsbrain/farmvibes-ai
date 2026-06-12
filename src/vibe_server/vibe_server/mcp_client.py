import asyncio
import logging
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

LOGGER = logging.getLogger(__name__)

class GeoAIClient:
    def __init__(self, command: str, args: list, env: dict):
        self.server_params = StdioServerParameters(
            command=command,
            args=args,
            env=env
        )
        self.session = None

    async def connect(self):
        async with stdio_client(self.server_params) as (read, write):
            async with ClientSession(read, write) as session:
                self.session = session
                LOGGER.info("Connected to GeoAI MCP Server")
                await session.initialize()

    async def call_tool(self, tool_name: str, arguments: dict):
        if not self.session:
            raise RuntimeError("Session not initialized. Call connect() first.")
        
        result = await self.session.call_tool(tool_name, arguments)
        return result

# Example Usage:
if __name__ == "__main__":
    async def main():
        # Adjust command/args if necessary for your environment
        client = GeoAIClient("python", ["-m", "geoai_mcp_server.server"], {
            "GEOAI_INPUT_DIR": r"C:\Users\fjuni\Projects\01-Upstream\04-YSH-Energy\farmvibes-ai\op_resources\input",
            "GEOAI_OUTPUT_DIR": r"C:\Users\fjuni\Projects\01-Upstream\04-YSH-Energy\farmvibes-ai\op_resources\output",
            "GEOAI_LOG_LEVEL": "DEBUG"
        })
        await client.connect()
        # Verify connection
        print("Successfully connected to MCP Server")

    asyncio.run(main())

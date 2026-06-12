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

    async def call_tool(self, tool_name: str, arguments: dict):
        async with stdio_client(self.server_params) as (read, write):
            async with ClientSession(read, write) as session:
                await session.initialize()
                return await session.call_tool(tool_name, arguments)

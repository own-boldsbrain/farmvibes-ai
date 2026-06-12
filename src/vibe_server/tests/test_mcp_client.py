import pytest
import asyncio
from unittest.mock import MagicMock, patch, AsyncMock
from vibe_server.mcp_client import GeoAIClient

@pytest.mark.asyncio
async def test_geoai_client_connection():
    # Mock stdio_client and ClientSession
    with patch("vibe_server.mcp_client.stdio_client") as mock_stdio, \
         patch("vibe_server.mcp_client.ClientSession") as mock_session:
        
        # Configure stdio_client mock
        mock_stdio.return_value.__aenter__.return_value = (MagicMock(), MagicMock())
        
        client = GeoAIClient("python", ["-m", "geoai_mcp_server.server"], {})
        
        # Configure ClientSession mock
        mock_session_instance = MagicMock()
        mock_session_instance.initialize = AsyncMock()
        mock_session.return_value.__aenter__.return_value = mock_session_instance
        
        await client.connect()
        
        assert client.session == mock_session_instance
        mock_session_instance.initialize.assert_awaited_once()

@pytest.mark.asyncio
async def test_geoai_client_call_tool():
    # Mock ClientSession
    with patch("vibe_server.mcp_client.stdio_client") as mock_stdio, \
         patch("vibe_server.mcp_client.ClientSession") as mock_session:
        
        # Configure stdio_client mock
        mock_stdio.return_value.__aenter__.return_value = (MagicMock(), MagicMock())
        
        client = GeoAIClient("python", ["-m", "geoai_mcp_server.server"], {})
        mock_session_instance = MagicMock()
        mock_session_instance.initialize = AsyncMock()
        mock_session_instance.call_tool = AsyncMock()
        mock_session.return_value.__aenter__.return_value = mock_session_instance
        
        await client.connect()
        
        # Test call_tool
        mock_session_instance.call_tool.return_value = {"result": "success"}
        result = await client.call_tool("test_tool", {"arg": "value"})
        
        assert result == {"result": "success"}
        mock_session_instance.call_tool.assert_awaited_once_with("test_tool", {"arg": "value"})

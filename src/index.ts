import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new McpServer(
  {
    name: "Technopark Job Search",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const transport = new StdioServerTransport();
server.connect(transport).catch((error) => {
  console.error("Server connection error:", error);
  process.exit(1);
});

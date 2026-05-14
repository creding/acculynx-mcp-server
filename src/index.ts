#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerDiscoveryTools } from "./tools/discovery.js";
import { registerContactTools } from "./tools/contacts.js";
import { registerJobTools } from "./tools/jobs.js";

const server = new McpServer({
  name: "acculynx-mcp-server",
  version: "1.0.0",
});

// Orchestrate domain capability registration mappings
registerDiscoveryTools(server);
registerContactTools(server);
registerJobTools(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("AccuLynx MCP Server running securely on stdio transport");
}

main().catch((error) => {
  console.error("Fatal initialization exception encountered:", error);
  process.exit(1);
});

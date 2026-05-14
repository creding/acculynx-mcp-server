import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { baseDiscoverySchema } from "../schemas/discovery.js";
import { getAccuLynxClient, handleApiError, formatToolResponse } from "../services/acculynx.js";

/**
 * Registers all core configuration and metadata discovery endpoints for the AccuLynx MCP Server.
 */
export function registerDiscoveryTools(server: McpServer) {
  // 1. Company Document Folders Discovery
  server.registerTool(
    "acculynx_get_company_document_folders",
    {
      description: "Retrieve document folder categories and their unique IDs for file uploads.",
      inputSchema: baseDiscoverySchema.shape,
    },
    async ({ response_format }) => {
      try {
        const client = getAccuLynxClient();
        const res = await client.getCompanyDocumentFolders();
        return formatToolResponse(res.data, response_format);
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: handleApiError(error) }],
          isError: true,
        };
      }
    }
  );

  // 2. Custom Fields Discovery
  server.registerTool(
    "acculynx_get_custom_fields",
    {
      description: "Retrieve company custom fields configuration to inspect valid options and IDs.",
      inputSchema: baseDiscoverySchema.shape,
    },
    async ({ response_format }) => {
      try {
        const client = getAccuLynxClient();
        const res = await client.getCompanySettingsCustomFields();
        return formatToolResponse(res.data, response_format);
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: handleApiError(error) }],
          isError: true,
        };
      }
    }
  );

  // 3. Milestones Discovery
  server.registerTool(
    "acculynx_get_milestones",
    {
      description: "Retrieve available job milestones to inspect active pipeline stages.",
      inputSchema: baseDiscoverySchema.shape,
    },
    async ({ response_format }) => {
      try {
        const client = getAccuLynxClient();
        const res = await client.getMilestones();
        return formatToolResponse(res.data, response_format);
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: handleApiError(error) }],
          isError: true,
        };
      }
    }
  );

  // 4. Lead Sources Discovery
  server.registerTool(
    "acculynx_get_lead_sources",
    {
      description: "Retrieve available lead source configurations and parent/child hierarchies.",
      inputSchema: baseDiscoverySchema.shape,
    },
    async ({ response_format }) => {
      try {
        const client = getAccuLynxClient();
        const res = await client.getActiveLeadSources();
        return formatToolResponse(res.data, response_format);
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: handleApiError(error) }],
          isError: true,
        };
      }
    }
  );

  // 5. Users Discovery
  server.registerTool(
    "acculynx_get_users",
    {
      description: "Retrieve internal company user accounts for assigning estimators, sales owners, or representatives.",
      inputSchema: baseDiscoverySchema.shape,
    },
    async ({ response_format }) => {
      try {
        const client = getAccuLynxClient();
        const res = await client.getUsers();
        return formatToolResponse(res.data, response_format);
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: handleApiError(error) }],
          isError: true,
        };
      }
    }
  );

  // 6. Job Categories Discovery
  server.registerTool(
    "acculynx_get_job_categories",
    {
      description: "Retrieve available job classification categories (e.g. Residential, Commercial).",
      inputSchema: baseDiscoverySchema.shape,
    },
    async ({ response_format }) => {
      try {
        const client = getAccuLynxClient();
        const res = await client.getCompanySettingsJobSettingsJobCategories();
        return formatToolResponse(res.data, response_format);
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: handleApiError(error) }],
          isError: true,
        };
      }
    }
  );

  // 7. Work Types Discovery
  server.registerTool(
    "acculynx_get_work_types",
    {
      description: "Retrieve valid work type records and their corresponding identifiers.",
      inputSchema: baseDiscoverySchema.shape,
    },
    async ({ response_format }) => {
      try {
        const client = getAccuLynxClient();
        const res = await client.getCompanySettingsJobSettingsWorkTypes();
        return formatToolResponse(res.data, response_format);
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: handleApiError(error) }],
          isError: true,
        };
      }
    }
  );

  // 8. Trade Types Discovery
  server.registerTool(
    "acculynx_get_trade_types",
    {
      description: "Retrieve assigned trade specifications (e.g. Roofing, Siding, Gutters) and IDs.",
      inputSchema: baseDiscoverySchema.shape,
    },
    async ({ response_format }) => {
      try {
        const client = getAccuLynxClient();
        const res = await client.getCompanySettingsJobSettingsTradeTypes();
        return formatToolResponse(res.data, response_format);
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: handleApiError(error) }],
          isError: true,
        };
      }
    }
  );
}

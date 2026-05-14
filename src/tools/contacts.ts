import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getContactTypesSchema, getContactsSchema, getContactSchema, createContactSchema } from "../schemas/contacts.js";
import { getAccuLynxClient, handleApiError, formatToolResponse } from "../services/acculynx.js";

/**
 * Registers all core Contact exploration, search, lookup, and mutation tools.
 */
export function registerContactTools(server: McpServer) {
  // 1. Get Contact Types
  server.registerTool(
    "acculynx_get_contact_types",
    {
      description: "Retrieve valid contact assignment categories (Customer, Subcontractor, Supplier) and numeric IDs.",
      inputSchema: getContactTypesSchema.shape,
    },
    async ({ response_format }) => {
      try {
        const client = getAccuLynxClient();
        const res = await client.getContactTypes();
        return formatToolResponse(res.data, response_format);
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: handleApiError(error) }],
          isError: true,
        };
      }
    }
  );

  // 2. Search / List Contacts
  server.registerTool(
    "acculynx_get_contacts",
    {
      description: "List contacts or query via dynamic keyword matching, custom filtering, and standard sort ordering.",
      inputSchema: getContactsSchema.shape,
    },
    async ({ searchTerm, response_format }) => {
      try {
        const client = getAccuLynxClient();
        if (searchTerm) {
          // Route search using standard search parameter object mapping
          const res = await client.postContactSearch({
            searchTerm,
            sortColumn: "LastName",
            sortDirection: "Ascending",
          });
          return formatToolResponse(res.data, response_format);
        } else {
          // Fallback to standard contact listings
          const res = await client.getContacts();
          return formatToolResponse(res.data, response_format);
        }
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: handleApiError(error) }],
          isError: true,
        };
      }
    }
  );

  // 3. Get Single Contact
  server.registerTool(
    "acculynx_get_contact",
    {
      description: "Retrieve deep properties for a single Contact resource identified by its unique UUID.",
      inputSchema: getContactSchema.shape,
    },
    async ({ contactId, response_format }) => {
      try {
        const client = getAccuLynxClient();
        const res = await client.getContact({ contactId });
        return formatToolResponse(res.data, response_format);
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: handleApiError(error) }],
          isError: true,
        };
      }
    }
  );

  // 4. Create Contact
  server.registerTool(
    "acculynx_create_contact",
    {
      description: "Provision a new contact profile within AccuLynx. Returns created entity details including its assigned UUID.",
      inputSchema: createContactSchema.shape,
    },
    async (payload) => {
      try {
        const client = getAccuLynxClient();
        const res = await client.postContacts(payload);
        return formatToolResponse(res.data, undefined);
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: handleApiError(error) }],
          isError: true,
        };
      }
    }
  );
}

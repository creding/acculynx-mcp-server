import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getJobsSchema, getJobSchema, createJobSchema, addJobDocumentSchema } from "../schemas/jobs.js";
import { getAccuLynxClient, handleApiError, formatToolResponse } from "../services/acculynx.js";

/**
 * Registers all core Job, Lead, and File handling tools.
 */
export function registerJobTools(server: McpServer) {
  // 1. Get / Search Jobs
  server.registerTool(
    "acculynx_get_jobs",
    {
      description: "Retrieve a list of job records, filter by pipeline milestones, or perform targeted keyword search.",
      inputSchema: getJobsSchema.shape,
    },
    async ({ searchTerm, milestones, response_format }) => {
      try {
        const client = getAccuLynxClient();
        if (searchTerm) {
          // Route through global job search engine
          const res = await client.jobsSearch({ searchTerm }, { includes: "contacts" });
          return formatToolResponse(res.data, response_format);
        } else {
          // Access standardized listing filtered by milestones if supplied
          const metadata: any = { includes: "contacts" };
          if (milestones) {
            metadata.milestones = milestones;
          }
          const res = await client.getJobs(metadata);
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

  // 2. Get Single Job Details
  server.registerTool(
    "acculynx_get_job",
    {
      description: "Retrieve deep structural details for a single Job record mapped by its unique UUID. Note: To extract production schedules and work orders, use the specialized acculynx_get_job_production_schedule tool.",
      inputSchema: getJobSchema.shape,
    },
    async ({ jobId, response_format }) => {
      try {
        const client = getAccuLynxClient();
        const res = await client.getJob({ jobId, includes: "contacts" });
        return formatToolResponse(res.data, response_format);
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: handleApiError(error) }],
          isError: true,
        };
      }
    }
  );

  // 2.5 Get Job Initial Appointment
  server.registerTool(
    "acculynx_get_job_initial_appointment",
    {
      description: "Retrieve initial appointment scheduling dates and metadata for a specific job mapped by its unique UUID.",
      inputSchema: getJobSchema.shape,
    },
    async ({ jobId, response_format }) => {
      try {
        const client = getAccuLynxClient();
        const res = await client.getInitialAppointmentForJob({ jobId });
        return formatToolResponse(res.data, response_format);
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: handleApiError(error) }],
          isError: true,
        };
      }
    }
  );

  // 2.8 Get Job Production Schedule & Work Orders
  server.registerTool(
    "acculynx_get_job_production_schedule",
    {
      description: "Extract production schedule assignments, work order references, and scheduled start/end dates for a job by inspecting its event history log.",
      inputSchema: getJobSchema.shape,
    },
    async ({ jobId, response_format }) => {
      try {
        const client = getAccuLynxClient();
        const res = await client.getJobHistory({ jobId, pageSize: 50 });
        const items = res.data?.items || [];
        
        // Filter events related to production scheduling and work orders
        const scheduleEvents = items.filter((item: any) => {
          const text = (item?.action || "").toLowerCase();
          return text.includes("start date") || 
                 text.includes("end date") || 
                 text.includes("assignment changed") ||
                 text.includes("order saved");
        });

        const outputData = {
          jobId,
          productionScheduleFound: scheduleEvents.length > 0,
          extractedScheduleEvents: scheduleEvents,
          recentHistoryContext: items.slice(0, 10), // provide baseline context
        };

        return formatToolResponse(outputData, response_format);
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: handleApiError(error) }],
          isError: true,
        };
      }
    }
  );

  // 2.9 Financials, Estimates, Invoices & Payments Sub-resources
  server.registerTool(
    "acculynx_get_job_estimates",
    {
      description: "Retrieve a list of project estimates linked to a specific job mapped by its unique UUID.",
      inputSchema: getJobSchema.shape,
    },
    async ({ jobId, response_format }) => {
      try {
        const client = getAccuLynxClient();
        const res = await client.getEstimatesForJob({ jobId });
        return formatToolResponse(res.data, response_format);
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: handleApiError(error) }],
          isError: true,
        };
      }
    }
  );

  server.registerTool(
    "acculynx_get_job_invoices",
    {
      description: "Retrieve a list of invoices issued for a specific job mapped by its unique UUID.",
      inputSchema: getJobSchema.shape,
    },
    async ({ jobId, response_format }) => {
      try {
        const client = getAccuLynxClient();
        const res = await client.getInvoicesForJob({ jobId });
        return formatToolResponse(res.data, response_format);
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: handleApiError(error) }],
          isError: true,
        };
      }
    }
  );

  server.registerTool(
    "acculynx_get_job_financials",
    {
      description: "Retrieve core project accounting financials, approved job contract values, worksheets, and outstanding balances for a specific job mapped by its unique UUID.",
      inputSchema: getJobSchema.shape,
    },
    async ({ jobId, response_format }) => {
      try {
        const client = getAccuLynxClient();
        const res = await client.getFinancialsForJob({ jobId, includes: "worksheet" });
        return formatToolResponse(res.data, response_format);
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: handleApiError(error) }],
          isError: true,
        };
      }
    }
  );

  server.registerTool(
    "acculynx_get_job_payments",
    {
      description: "Retrieve payment log overviews, received funds, and outstanding liabilities linked to a specific job mapped by its unique UUID.",
      inputSchema: getJobSchema.shape,
    },
    async ({ jobId, response_format }) => {
      try {
        const client = getAccuLynxClient();
        const res = await client.getPaymentsOverviewForJob({ jobId });
        return formatToolResponse(res.data, response_format);
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: handleApiError(error) }],
          isError: true,
        };
      }
    }
  );

  // 3. Create Job / Lead Record
  server.registerTool(
    "acculynx_create_job",
    {
      description: "Create a new lead/job entity linked to a contact record. Returns the newly provisioned job UUID reference.",
      inputSchema: createJobSchema.shape,
    },
    async (payload) => {
      try {
        const client = getAccuLynxClient();
        const res = await client.postjob(payload);
        return formatToolResponse(res.data, undefined);
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: handleApiError(error) }],
          isError: true,
        };
      }
    }
  );

  // 4. Upload Job Document Attachment
  server.registerTool(
    "acculynx_add_job_document",
    {
      description: "Upload a physical document attachment directly into a designated Job folder mapping.",
      inputSchema: addJobDocumentSchema.shape,
    },
    async ({ jobId, documentFolderId, file, description }) => {
      try {
        const client = getAccuLynxClient();
        const res = await client.postAddJobDocument(
          {
            file,
            documentFolderId,
            description,
          },
          { jobId }
        );
        return formatToolResponse(
          res.data || { success: true, message: "Document uploaded successfully." },
          undefined
        );
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: handleApiError(error) }],
          isError: true,
        };
      }
    }
  );
}

import { z } from "zod";
import { ResponseFormat } from "../constants.js";

/**
 * Domain schemas modeling Jobs, Leads, and document upload operations.
 */

export const getJobsSchema = z.object({
  searchTerm: z.string().optional().describe("Filter jobs matching specific street names, customer names, or numbers"),
  milestones: z.string().optional().describe("Comma-separated milestone filter (e.g. 'lead,prospect,approved')"),
  response_format: z.nativeEnum(ResponseFormat).optional().describe("Output serialization format"),
});

export const getJobSchema = z.object({
  jobId: z.string().uuid().describe("Unique UUID string identifying the target job"),
  response_format: z.nativeEnum(ResponseFormat).optional().describe("Output serialization format"),
});

export const createJobSchema = z.object({
  contact: z.object({
    id: z.string().uuid().describe("Target Contact UUID linking the job record"),
  }).describe("Required contact entity binding"),
  leadSource: z.object({
    id: z.string().uuid().describe("Lead Source UUID retrieved from acculynx_get_lead_sources"),
  }).optional(),
  locationAddress: z.object({
    street1: z.string(),
    street2: z.string().optional(),
    city: z.string(),
    state: z.string().describe("State abbreviation e.g. TX, MI"),
    country: z.string().describe("Country abbreviation e.g. US"),
    zipCode: z.string(),
  }).optional(),
  priority: z.enum(["Urgent", "High", "Normal"]).optional().describe("Workflow lead prioritization"),
  jobCategory: z.object({
    id: z.number().describe("Job category numerical ID"),
  }).optional(),
  workType: z.object({
    id: z.number().describe("Work type numerical ID"),
  }).optional(),
  tradeTypes: z.array(z.object({
    id: z.string().uuid().describe("Trade Type UUID"),
  })).optional(),
  notes: z.string().optional().describe("Initial job description remarks"),
  salesOwnerIds: z.array(z.string().uuid()).optional().describe("User UUIDs to assign as Sales Owners for the job"),
  companyRepresentativeIds: z.array(z.string().uuid()).optional().describe("User UUIDs to assign as Company Representatives"),
  arOwnerIds: z.array(z.string().uuid()).optional().describe("User UUIDs to assign as Accounts Receivable (AR) Owners"),
});

export const addJobDocumentSchema = z.object({
  jobId: z.string().uuid().describe("Target Job UUID where file will be uploaded"),
  documentFolderId: z.string().uuid().describe("Target Folder UUID retrieved from acculynx_get_company_document_folders"),
  file: z.string().describe("Raw file text or Base64 encoded payload to be stored as binary content"),
  description: z.string().optional().describe("Brief file context description"),
});

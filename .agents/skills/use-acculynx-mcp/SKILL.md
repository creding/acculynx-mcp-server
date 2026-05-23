---
name: use-acculynx-mcp
description: Guidance for downstream agents interacting with the custom AccuLynx MCP server tools. Make sure to consult this skill whenever tasked with syncing, retrieving, or inspecting AccuLynx roofing jobs, client leads, initial appointments, production schedules, work orders, document folders, accounting financials, estimates, invoices, or payments. This skill provides critical context on extracting scheduling metadata from event streams and selecting the correct specialized tools to avoid hallucinating unsupported API endpoints.
---

# Operational Guidance for Consuming the AccuLynx MCP Server

Welcome, agent! You are interacting with a specialized Model Context Protocol (MCP) server built to interface with the AccuLynx roofing and project management API (v2). 

Because the underlying third-party AccuLynx API has distinct mapping behaviors and structural limits, standard intuitions about typical REST APIs (like standalone Work Order routes or generic Calendar endpoints) will fail. Follow these guidelines to interact seamlessly with the workspace tools.

---

## 1. Tool Selection Strategy

Always use the pre-compiled tools provided by the server rather than hallucinating generic API routes. 

### Core Inventory
- **Jobs & Leads**: `acculynx_get_jobs`, `acculynx_get_job`, `acculynx_create_job`
- **Accounting & Financials**: `acculynx_get_job_estimates`, `acculynx_get_job_invoices`, `acculynx_get_job_financials`, `acculynx_get_job_payments`
- **Scheduling**: `acculynx_get_job_initial_appointment`, `acculynx_get_job_production_schedule`
- **Files**: `acculynx_add_job_document`
- **Contacts**: `acculynx_get_contacts`, `acculynx_get_contact`, `acculynx_create_contact`
- **Discovery**: `acculynx_get_company_document_folders`, `acculynx_get_custom_fields`, `acculynx_get_milestones`, `acculynx_get_lead_sources`, `acculynx_get_users`, `acculynx_get_job_categories`, `acculynx_get_work_types`, `acculynx_get_trade_types`

---

## 2. Multi-Step Job Creation Workflow

In AccuLynx, a Job entity cannot exist independently—it must be bound to a concrete **Contact** profile. Creating a job requires resolving all referential integrity pointers first.

### Step 1: Resolve the Contact Record
You **must** pass a valid `contact.id` (UUID) to `acculynx_create_job`.
1. First, search for the contact using `acculynx_get_contacts` (filter via `searchTerm`).
2. **CRITICAL**: If you find an existing contact that matches the request, you **must pause and ask the user** if they want to use the existing contact or create a new one.
3. If the user chooses to create a new one (or if no contact is found), provision a new profile using `acculynx_create_contact`. Capture the returned Contact UUID.

### Step 2: Discover Referenced Categorizations (Optional)
If the prompt requires tagging specific lead sources, categories, or trade specifications, query the discovery endpoints first:
- `acculynx_get_lead_sources` -> returns Lead Source UUIDs.
- `acculynx_get_job_categories` -> returns numerical IDs.
- `acculynx_get_work_types` -> returns numerical IDs.
- `acculynx_get_trade_types` -> returns Trade Type UUIDs.
- `acculynx_get_users` -> returns User UUIDs (for assigning sales owners, company reps, or AR owners).

### Step 3: Invoke `acculynx_create_job`
**CRITICAL**: Before creating the job, if the user has not explicitly requested a specific person be assigned, you **must pause and ask the user** if they want to assign someone (such as a Sales Owner or Company Representative).
Supply the required `contact.id` along with any optional location blocks, discovered references, or assigned user arrays (e.g. `companyRepresentativeIds`). **NOTE:** AccuLynx prevents assigning `salesOwnerIds` or `arOwnerIds` to a job until it reaches the "Approved" milestone. For newly created leads, always map user assignments to `companyRepresentativeIds`.

```json
{
  "contact": { "id": "e3051410-..." },
  "jobCategory": { "id": 1 },
  "companyRepresentativeIds": ["b1234567-..."],
  "locationAddress": {
    "street1": "123 Maple St",
    "city": "Homewood",
    "state": "AL",
    "country": "US",
    "zipCode": "35209"
  }
}
```

---

## 3. Job Financials & Accounting Sub-resources

AccuLynx maintains deep financial sub-documents bound directly to the parent job scope. Avoid guessing external ledger IDs.
- **Project Estimates**: Invoke `acculynx_get_job_estimates` to list structured estimate revisions.
- **Client Invoices**: Invoke `acculynx_get_job_invoices` to check billed statements.
- **Core Financials & Worksheets**: Invoke `acculynx_get_job_financials` to audit current approved contract totals, net values, and worksheet sections.
- **Payments & Cash Flow**: Invoke `acculynx_get_job_payments` to extract payment overviews, received sums, and outstanding customer balances.

---

## 4. Retrieving Production Schedules & Work Orders

**Critical Note:** The AccuLynx API Spec v2 does **not** expose top-level REST endpoints for standalone Production Schedule records or granular Work Order sub-documents.

Instead, all internal scheduling assignments, crew blocks, and material/labor status changes are broadcast into the job's immutable event stream.
- **Action**: To read work orders or scheduled production dates, **invoke `acculynx_get_job_production_schedule`**.
- **Behavior**: This tool parses up to 50 chronological logs and automatically extracts events containing scheduling tags (`"start date"`, `"end date"`, `"assignment changed"`, `"order saved"`).
- **Fallback Context**: If granular verification is requested, inspect the returned `recentHistoryContext` array included in the output.

---

## 5. Initial Appointment Handling

Do not query global organizational calendars to find initial intake dates. Initial appointments are tracked as dedicated metadata objects bound directly to the Job.
- **Action**: Query `acculynx_get_job_initial_appointment` passing the target `jobId`.
- **Note**: If no appointment has been scheduled, the underlying API will cleanly return a `404` status code. Treat this as an empty schedule state rather than an error.

---

## 6. Uploading Job Documents

Document uploads require mapping the binary stream to a defined structural directory.
1. Resolve the correct target folder UUID first by invoking `acculynx_get_company_document_folders`.
2. Invoke `acculynx_add_job_document` passing the `jobId`, the resolved `documentFolderId`, and the file content payload.

# AccuLynx MCP Server

A specialized [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that provides AI agents with read, write, and discovery access to the AccuLynx CRM and project management platform.

This server exposes a suite of highly tailored tools that allow AI agents to intelligently query, provision, and audit AccuLynx entities—ranging from standard CRM contacts to deeply nested financial worksheets, invoices, and event-sourced production schedules.

## 🚀 Features

The server exposes the following categories of operations:

### 💼 Jobs & Leads
*   `acculynx_get_jobs`: Search and list jobs (filter by milestones or keywords).
*   `acculynx_get_job`: Retrieve deep structural details for a single job entity.
*   `acculynx_create_job`: Provision new jobs and leads (requires a bound Contact UUID).

### 💵 Accounting & Financials
*   `acculynx_get_job_estimates`: Retrieve structural quote revisions and active project estimates.
*   `acculynx_get_job_invoices`: Extract billed customer statements and invoices.
*   `acculynx_get_job_financials`: Audit current approved contract totals, net values, and granular worksheet line-items.
*   `acculynx_get_job_payments`: Retrieve aggregate transaction overviews, received sums, and outstanding balances.

### 📅 Scheduling & Event Tracking
*   `acculynx_get_job_initial_appointment`: Access intake dates and appointment tracking.
*   `acculynx_get_job_production_schedule`: Parses immutable job event streams to extract schedule assignments, work orders, and crew assignments.

### 👥 Contacts
*   `acculynx_get_contacts`: Search contacts by name or keyword.
*   `acculynx_get_contact`: Retrieve detailed CRM profiles by UUID.
*   `acculynx_create_contact`: Provision a new contact profile.

### 📁 Document Management
*   `acculynx_add_job_document`: Upload binary file attachments to specific job folders.

### 🔍 Discovery & System Configuration
*   Retrieve structural metadata for assignments and categorizations: `acculynx_get_company_document_folders`, `acculynx_get_custom_fields`, `acculynx_get_milestones`, `acculynx_get_lead_sources`, `acculynx_get_users`, `acculynx_get_job_categories`, `acculynx_get_work_types`, `acculynx_get_trade_types`.

## 🛠️ Prerequisites & Installation

1.  **Node.js**: v22 or higher recommended.
2.  **AccuLynx API Key**: You must have a valid V2 API token.

Clone the repository and install dependencies:

```bash
git clone git@github.com:creding/acculynx-mcp-server.git
cd acculynx-mcp-server
npm install
npm run build
```

## ⚙️ Configuration

The server requires the `ACCULYNX_API_KEY` environment variable to authenticate requests against the API.

To configure this in your AI client's MCP settings (e.g., in Claude Desktop or your local `mcp_config.json`):

```json
{
  "mcpServers": {
    "acculynx": {
      "command": "node",
      "args": ["/absolute/path/to/acculynx-mcp-server/dist/index.js"],
      "env": {
        "ACCULYNX_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

## 🧠 Architectural Guidelines for Agents

To ensure reliable operations, the server enforces several structural patterns that agents must follow:

### 1. Multi-Step Job Creation
In AccuLynx, a Job entity cannot exist independently—it must be bound to a concrete **Contact**.
*   **Step 1**: Search for a contact (`acculynx_get_contacts`). If a matching contact is found, **you must ask the user** whether they want to use the existing contact or create a new one. If no contact is found or the user wants a new one, create it (`acculynx_create_contact`).
*   **Step 2**: Discover configuration IDs if needed (`acculynx_get_job_categories`, `acculynx_get_lead_sources`, `acculynx_get_users`).
*   **Step 3**: Invoke `acculynx_create_job` passing the resolved `contact.id`. You can also seamlessly assign users to the job during this step by passing discovered user UUIDs into \`salesOwnerIds\`, \`companyRepresentativeIds\`, or \`arOwnerIds\`. If the user hasn't explicitly requested a specific person be assigned to the job, **you must ask the user** if they want to assign someone before proceeding.

### 2. Event-Sourced Production Schedules
The AccuLynx API V2 does not expose top-level REST endpoints for Production Schedules.
*   Instead of hallucinating routing, the server exposes `acculynx_get_job_production_schedule`. This tool automatically paginates through the job's immutable history stream and extracts strings related to *"start date"*, *"end date"*, *"assignment changed"*, and *"order saved"*.

### 3. Financial Sub-Resources
Do not query external general ledgers (like QuickBooks) via the AccuLynx MCP. Instead, utilize the built-in financial tools (`acculynx_get_job_financials`, `acculynx_get_job_invoices`, `acculynx_get_job_estimates`, `acculynx_get_job_payments`) which provide real-time snapshots of the job's internal accounting state.

## 🏗️ Local Development

To run the server in development mode with automatic reloading:
```bash
npm run dev
```

To build for production:
```bash
npm run build
```

## 📝 License
ISC License

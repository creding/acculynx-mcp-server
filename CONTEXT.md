# AccuLynx MCP Integration Context

Defines the canonical domain model, ubiquitous language, and integration blueprint for orchestrating the AccuLynx platform via the Model Context Protocol.

## Language

**Job**:
The primary entity representing a contracted project or prospective work order within AccuLynx.
*Avoid*: Project, deal, contract

**Lead**:
A specific state of a **Job** record initialized in the `Lead (Unassigned)` milestone before formal sales assignment or estimation.
*Avoid*: Prospect, standalone lead record

**Contact**:
An individual or organization record representing the customer, owner, or primary entity associated with a **Job**.
*Avoid*: Customer, Client, Account

## Relationships & Orchestration

- A **Lead** is structurally instantiated as a **Job** entity via the core jobs pipeline.
- Every **Job** must reference exactly one parent **Contact** upon creation.
- **Resource Resolution Flow**: Dependent endpoints require multi-step identifier lookups. For instance, uploading a document to a Job requires discovering valid folder mappings via `acculynx_get_company_document_folders` to acquire the mandatory `documentFolderId`.

## Implemented Toolset Architecture

1. **Discovery Layer (`src/tools/discovery.ts`)**:
   Exposes configuration schemas, system lookups, and parent/child hierarchies for Folders, Custom Fields, Milestones, Lead Sources, Users, Job Categories, Work Types, and Trade Types.
2. **Contact Management Layer (`src/tools/contacts.ts`)**:
   Provides capabilities for reading contact types, dynamic keyword search, structural UUID lookups, and profile creation.
3. **Job & Lifecycle Layer (`src/tools/jobs.ts`)**:
   Orchestrates core job search, milestone filtering, single job deep structural details, lead provisioning, and binary/document attachments.

## Dual-Mode Response Serialization Strategy

All registered tool handlers enforce structured protocol returns containing both readable Markdown representations and full metadata properties:
- **Markdown Blocks**: Formats raw structure into pretty code blocks or direct payload strings while enforcing an automated truncation buffer (`CHARACTER_LIMIT = 20000`) to guarantee high-performance execution.
- **Structured Content**: Preserves full, un-truncated object graph nodes mapped to `structuredContent` to permit deep programmatic inspection by MCP client engines.

## Example dialogue

> **Dev:** "When an external integration creates a new **Lead**, should we query a separate leads table?"
> **Domain expert:** "No — a **Lead** is created directly as a **Job** record assigned to the initial `Lead (Unassigned)` milestone."

## Flagged ambiguities

- "Lead" vs "Job" — resolved: In AccuLynx API definitions, lead generation maps to creating a **Job** record with initial lead milestone status rather than an independent domain entity.

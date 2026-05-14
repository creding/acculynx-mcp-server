import acculynxApiModule from "@api/acculynxapi";
import { ResponseFormat, CHARACTER_LIMIT } from "../constants.js";

// Ensure compatibility with Node16 module resolution mapping default exports
const sdk = (acculynxApiModule as any).default || acculynxApiModule;

/**
 * Singleton getter for the fully authorized AccuLynx API SDK client.
 * Ensures API Key presence before returning client instance.
 */
export function getAccuLynxClient(): any {
  const apiKey = process.env.ACCULYNX_API_KEY;
  if (!apiKey) {
    throw new Error("Missing required environment variable: ACCULYNX_API_KEY");
  }
  // Initialize the authentication bearer/key strategy on the shared core instance
  sdk.auth(apiKey);
  return sdk;
}

/**
 * Standardized error formatter extracting canonical AccuLynx JSON API error schema details.
 */
export function handleApiError(error: unknown): string {
  if (typeof error === "object" && error !== null) {
    const anyErr = error as any;
    const data = anyErr.data || anyErr.response?.data || anyErr;
    
    if (data && data.status && data.title) {
      const parts = [
        `AccuLynx API Error (${data.status}): ${data.title}`,
        data.detail ? `Detail: ${data.detail}` : "",
        data.traceId ? `Trace ID: ${data.traceId}` : ""
      ].filter(Boolean);
      return parts.join("\n");
    }
    
    if (anyErr.message) {
      return `Error: ${anyErr.message}`;
    }
  }
  return `Unexpected error: ${String(error)}`;
}

/**
 * Formats structured response payloads supporting Markdown blocks or raw JSON serialization
 * while ensuring string buffers remain within character limit bounds. Enforces MCP structuredContent JSON-object compliance.
 */
export function formatToolResponse(data: unknown, format: ResponseFormat | undefined) {
  const jsonString = JSON.stringify(data, null, 2);
  let textContent = "";

  if (format === ResponseFormat.JSON) {
    textContent = jsonString.length > CHARACTER_LIMIT 
      ? jsonString.slice(0, CHARACTER_LIMIT) + "\n...[Truncated to character limit]"
      : jsonString;
  } else {
    textContent = "```json\n" + jsonString + "\n```";
    if (textContent.length > CHARACTER_LIMIT) {
      textContent = textContent.slice(0, CHARACTER_LIMIT) + "\n```\n...[Truncated to character limit]";
    }
  }

  // Ensure structuredContent maps perfectly to Record<string, unknown>
  const structuredRecord: Record<string, unknown> = 
    data && typeof data === "object" && !Array.isArray(data)
      ? (data as Record<string, unknown>)
      : { payload: data };

  return {
    content: [{ type: "text" as const, text: textContent }],
    structuredContent: structuredRecord
  };
}

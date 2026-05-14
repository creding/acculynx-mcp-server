/**
 * Core constants and global limits for the AccuLynx MCP Server.
 */

// Maximum response buffer size in characters before triggering list/content truncation
export const CHARACTER_LIMIT = 25000;

// Dual-mode serialization format choices
export enum ResponseFormat {
  MARKDOWN = "markdown",
  JSON = "json"
}

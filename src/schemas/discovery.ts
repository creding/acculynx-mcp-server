import { z } from "zod";
import { ResponseFormat } from "../constants.js";

/**
 * Shared input schema for standard list discovery tools supporting optional pagination and formatting.
 */
export const baseDiscoverySchema = z.object({
  response_format: z.nativeEnum(ResponseFormat).optional().describe("Output formatting choice: markdown or json"),
});

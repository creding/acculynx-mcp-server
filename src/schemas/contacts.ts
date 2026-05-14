import { z } from "zod";
import { ResponseFormat } from "../constants.js";

/**
 * Schemas for querying, searching, and creating AccuLynx Contact entities.
 */

export const getContactTypesSchema = z.object({
  response_format: z.nativeEnum(ResponseFormat).optional().describe("Output format"),
});

export const getContactsSchema = z.object({
  searchTerm: z.string().optional().describe("Filter contacts by first name, last name, or company name"),
  response_format: z.nativeEnum(ResponseFormat).optional().describe("Output format"),
});

export const getContactSchema = z.object({
  contactId: z.string().uuid().describe("Unique UUID of the contact record"),
  response_format: z.nativeEnum(ResponseFormat).optional().describe("Output format"),
});

export const createContactSchema = z.object({
  firstName: z.string().optional().describe("First name of the contact"),
  lastName: z.string().optional().describe("Last name of the contact"),
  companyName: z.string().optional().describe("Company name of the contact"),
  contactTypeIds: z.array(z.string().uuid()).optional().describe("Array of Contact Type UUIDs (retrieve via acculynx_get_contact_types)"),
  phoneNumbers: z.array(z.object({
    number: z.string().regex(/^\d{10}$/, "Must be exactly 10 digits without delimiters").describe("10 digit phone number"),
    type: z.enum(["Home", "Mobile", "Work"]).default("Home").describe("Classification of phone number"),
    primary: z.boolean().optional(),
  })).optional(),
  emailAddresses: z.array(z.object({
    address: z.string().email().describe("Valid email address"),
    primary: z.boolean().optional(),
    type: z.enum(["Personal", "Work", "Other"]).optional(),
  })).optional(),
  note: z.string().optional().describe("Additional descriptive documentation note"),
});

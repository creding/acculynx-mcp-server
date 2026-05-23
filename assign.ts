import acculynxApiModule from "@api/acculynxapi";
import * as dotenv from 'dotenv';
dotenv.config();

const sdk = (acculynxApiModule as any).default || acculynxApiModule;

async function main() {
  const apiKey = process.env.ACCULYNX_API_KEY;
  if (!apiKey) {
    console.error("Missing ACCULYNX_API_KEY");
    return;
  }
  sdk.auth(apiKey);
  
  try {
    const res = await sdk.postSalesOwnerForJob(
      { id: "c190265a-1752-4513-b77a-16dfc9949dd8" },
      { jobId: "abcdb9a6-dcf8-4068-acf2-91247ae05de7" }
    );
    console.log("Success:", res.data);
  } catch (err: any) {
    console.error("Error Response:");
    if (err.data) {
        console.error(err.data);
    } else {
        console.error(err);
    }
  }
}

main();

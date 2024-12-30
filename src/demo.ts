import env from "./shared/env.js";
import { verifyClaims } from "./agents/verifyClaims.js";

const bedrock = env.readFile("data/bedrock-cross-region.md");
const verifications = await verifyClaims(bedrock);

verifications.forEach((verification) => {
  const emoji = verification.assessment ? "✅" : "❌";
  console.log(`${emoji} ${verification.claim}`);
  console.log(`   Summary: ${verification.summary}`);
  if (verification.fixed_claim) {
    console.log(`   Fixed Claim: ${verification.fixed_claim}`);
  }
  console.log("");
});

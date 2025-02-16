import env from "../shared/env.ts";
import { extractClaims } from "./extractClaims.ts";
import { verifyClaim } from "./verifyClaim.ts";

const sources = [
  env.readFile("data/bedrock-cross-region/1.md"),
  env.readFile("data/bedrock-cross-region/2.md"),
  env.readFile("data/bedrock-cross-region/3.md"),
];

async function verifyClaims(content: string) {
  const claims = await extractClaims(content);
  const verifications = await Promise.all(
    claims.map((claim) =>
      verifyClaim(claim.claim, claim.original_text, sources)
    )
  );
  return verifications;
}

export { verifyClaims };

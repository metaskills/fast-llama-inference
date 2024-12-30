import { Provider } from "../shared/provider.js";

const provider = new Provider({ functionId: "extractclaims" });

function prompt(content: string) {
  return `
You are an expert at extracting claims from text.

Your task is to identify and list up to three claims present, true or false, in the given text. Each claim should be a single, verifiable statement. If the input content is very lengthy, then pick the top three major claims.

For each claim, also provide the original part of the sentence from which the claim is derived.
Present the claims as a JSON array of objects. Each object should have two keys:

1. "claim": the extracted claim in a single verifiable statement.
2. "original_text": the portion of the original text that supports or contains the claim.

Do not include any additional text or commentary.

Here is the content: 

<content>
${content}
</content>

Return the output strictly as a JSON array of objects following this schema:
[
  {
    "claim": "extracted claim here",
    "original_text": "original text portion here"
  },
  ...
]

Output the result as valid JSON, strictly adhering to the defined schema. Ensure there are no markdown fenced code blocks or additional elements included in the output. Do not add anything else.
`.trim();
}

interface Claim {
  claim: string;
  original_text: string;
}

async function extractClaims(content: string): Promise<Claim[]> {
  const result = await provider.generateText({ prompt: prompt(content) });
  const cleanedText = result.text
    .trim()
    .replace(/^```json\s*|```$/g, "")
    .trim();
  return JSON.parse(cleanedText);
}

export { extractClaims };

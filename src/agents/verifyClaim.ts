import { Provider } from "../shared/provider.js";

const provider = new Provider({ functionId: "verifyclaim" });

function prompt(claim: string, original_text: string, sources: string[]) {
  return `
You are an expert fact-checker. Given a claim and a set of sources, determine whether the claim is true or false based on the text from sources (or if there is insufficient information).

For your analysis, consider all the sources collectively.

Here are the sources: 

${sources
  .map((s, index) =>
    `
<source index="${index}">
${s}
</source>
`.trim()
  )
  .join("\n\n")}

Here is the original part of the text: 

<original_text>
${original_text}
</original_text>

Here is the claim: 

<claim>
${claim}
</claim>

Provide your answer as a JSON object with the following properties:

- claim: The original claim that you are checking.
- assessment: A boolean true or false. Use a null if there is insufficient information in the sources.
- summary: Why is this claim correct and if it isn't correct, then what is correct. In a single line.
- fixed_claim: If the assessment is false then correct the original claim (keeping everything as it is and just fix the fact in the part of the text)

Output the result as valid JSON, strictly adhering to the defined schema. Ensure there are no markdown fenced code blocks or additional elements included in the output. Do not add anything else.
`.trim();
}

interface VerifyClaimResult {
  claim: string;
  assessment: boolean | null;
  summary: string;
  fixed_claim: string | null;
}

async function verifyClaim(
  claim: string,
  original_text: string,
  sources: string[]
): Promise<VerifyClaimResult> {
  const result = await provider.generateText({
    prompt: prompt(claim, original_text, sources),
  });
  return JSON.parse(result.text);
}

export { verifyClaim };

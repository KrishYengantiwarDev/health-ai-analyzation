const aiService = require("./aiService");

async function checkClaim(query) {

    const prompt = `
You are an AI Health Awareness Assistant.

A user has asked the following health-related claim:

"${query}"

Your tasks:

1. Classify the claim as:
   - TRUE
   - FALSE
   - PARTIALLY TRUE
   - NOT ENOUGH EVIDENCE

2. Write a short summary.

3. Explain the answer in simple language.

4. Give general health advice.

5. If the claim could be harmful, recommend consulting a qualified healthcare professional.

Rules:

- Do NOT diagnose diseases.
- Do NOT prescribe medicines.
- Return ONLY valid JSON.
- Do not include markdown or code blocks.

Return exactly this format:

{
  "status": "",
  "summary": "",
  "explanation": "",
  "advice": ""
}
`;

    const result = await aiService.askAI(prompt);

    try {

        return JSON.parse(result);

    } catch (error) {

        console.log("AI Response:", result);

        return {
            status: "UNKNOWN",
            summary: result,
            explanation: "Unable to parse AI response.",
            advice: "Please try again."
        };

    }

}

module.exports = {
    checkClaim
};
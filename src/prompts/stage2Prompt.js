function stage2Prompt(symptoms, answers) {

return `
Symptoms:
${symptoms.join(", ")}

Previous Answers:
${JSON.stringify(answers)}

Ask more questions if required.

If enough information exists, return:

{
  "completed": true,
  "summary":"",
  "advice":"",
  "recommendation":""
}

Otherwise return

{
  "completed": false,
  "questions":[]
}
`;

}

module.exports = stage2Prompt;
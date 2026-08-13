function summaryPrompt(data){

return `
Generate

1. Summary
2. Advice
3. Recommendation

Never diagnose.
Never prescribe medicine.

Return JSON.

{
  "summary":"",
  "advice":"",
  "recommendation":""
}
`;

}

module.exports = summaryPrompt;
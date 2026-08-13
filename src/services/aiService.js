const groq = require("../config/groq");

async function askAI(prompt) {

    const response = await groq.post(
        "/chat/completions",
        {
            model: "llama-3.3-70b-versatile",

            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],

            temperature: 0.3
        }
    );

    return response.data.choices[0].message.content;

}

module.exports = {
    askAI
};
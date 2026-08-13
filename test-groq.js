require("dotenv").config();

const axios = require("axios");

async function testGroq() {
  try {

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",

        messages: [
          {
            role: "user",
            content: "Say Hello"
          }
        ],

        max_tokens: 100
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("AI RESPONSE:");
    console.log(response.data.choices[0].message.content);

  } catch (error) {

    console.log("ERROR:");
    console.log(error.response?.data || error.message);

  }
}

testGroq();
// const axios = require("axios");

// async function translateText(text, language) {

//     try {

//         const response = await axios.post(
//             "https://libretranslate.com/translate",
//             {
//                 q: text,
//                 source: "auto",
//                 target: language,
//                 format: "text"
//             },
//             {
//                 headers: {
//                     "Content-Type": "application/json"
//                 }
//             }
//         );

//         return {
//             translatedText: response.data.translatedText,
//             language
//         };

//     } catch (error) {

//         console.error(
//             "Translation Error:",
//             error.response?.data || error.message
//         );

//         throw new Error("Translation failed.");

//     }

// }

// module.exports = {
//     translateText
// };
// const languageService = require("../services/languageService");

// // Translate Text
// exports.translateText = async (req, res) => {

//     try {

//         const { text, language } = req.body;

//         if (!text) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Text is required."
//             });
//         }

//         const result = await languageService.translateText(
//             text,
//             language || "en"
//         );

//         return res.status(200).json({
//             success: true,
//             data: result
//         });

//     } catch (error) {

//         console.error(error);

//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });

//     }

// };
const assessmentService =
require("../services/assessmentService");

// Stage 1 - Start Assessment
exports.startAssessment = async (req, res) => {

    try {

        console.log("========== START ASSESSMENT ==========");
        console.log("Request Body:", req.body);

        const result =
        await assessmentService.startAssessment(req.body);

        return res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {

        console.error("Start Assessment Error:", error.message);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// Stage 2 - Submit Answers
exports.submitAnswer = async (req, res) => {

    try {

        console.log("========== SUBMIT ANSWERS ==========");
        console.log("Request Body:", req.body);

        const result =
        await assessmentService.submitAnswer(req.body);

        return res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {

        console.error("Submit Answer Error:", error.message);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
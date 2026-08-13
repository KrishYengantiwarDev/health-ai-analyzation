const awarenessService =
require("../services/awarenessService");

exports.checkAwareness = async (req, res) => {

    try {

        const { query } = req.body;

        if (!query) {
            return res.status(400).json({
                success: false,
                message: "Health query is required."
            });
        }

        const result =
        await awarenessService.checkClaim(query);

        return res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
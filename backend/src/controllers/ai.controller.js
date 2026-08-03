const aiService = require("../services/ai.service");

module.exports.getResponse = async (req, res) => {

    try {

        const code = req.body.code;

        if (!code) {
            return res.status(400).json({
                error: "Code is required"
            });
        }

        const response = await aiService(code);

        return res.status(200).send(response);

    } catch (error) {

        console.error("Gemini error:", error.message);

        return res.status(500).json({
            error: error.message
        });
    }
};


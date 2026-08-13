const router = require("express").Router();

const awarenessController =
require("../controllers/awarenessController");

// Health Awareness API
router.post(
    "/",
    awarenessController.checkAwareness
);

module.exports = router;
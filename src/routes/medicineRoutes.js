const router = require("express").Router();

const medicineController =
require("../controllers/medicineController");

// Get Medicine Information
router.get(
    "/:name",
    medicineController.getMedicine
);

module.exports = router;
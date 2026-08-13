const medicineService =
require("../services/medicineService");

exports.getMedicine = async (req, res) => {

    try {

        const medicineName =
        req.params.name;

        const result =
        await medicineService.getMedicineInfo(
            medicineName
        );

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
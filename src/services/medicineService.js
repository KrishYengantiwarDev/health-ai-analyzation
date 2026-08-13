const axios = require("axios");

async function getMedicineInfo(medicineName) {

    try {

        const response = await axios.get(
            "https://api.fda.gov/drug/label.json",
            {
                params: {
                    search: `openfda.brand_name:${medicineName}`,
                    limit: 1
                }
            }
        );

        const data = response.data.results[0];

        return {

            medicine: medicineName,

            brandName:
                data.openfda?.brand_name?.[0] || "Not Available",

            genericName:
                data.openfda?.generic_name?.[0] || "Not Available",

            manufacturer:
                data.openfda?.manufacturer_name?.[0] || "Not Available",

            uses:
                data.indications_and_usage?.[0] || "Not Available",

            warnings:
                data.warnings?.[0] || "Not Available"

        };

    } catch (error) {

        console.log(
            "Medicine API Error:",
            error.response?.data || error.message
        );

        return {

            medicine: medicineName,

            message: "Medicine information not found."

        };

    }

}

module.exports = {
    getMedicineInfo
};
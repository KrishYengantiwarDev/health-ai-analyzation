require("dotenv").config();

const axios = require("axios");

async function testOpenFDA() {
  try {

    const medicine = "tylenol";

    const response = await axios.get(
      "https://api.fda.gov/drug/label.json",
      {
        params: {
          api_key: process.env.OPENFDA_API_KEY,
          search: `openfda.brand_name:${medicine}`,
          limit: 1
        }
      }
    );

    const data = response.data.results[0];

    console.log("\n========== OPENFDA RESPONSE ==========\n");

    console.log("Brand Name:",
      data.openfda?.brand_name?.[0]);

    console.log("Generic Name:",
      data.openfda?.generic_name?.[0]);

    console.log("Manufacturer:",
      data.openfda?.manufacturer_name?.[0]);

    console.log("\nUses:\n");

    console.log(
      data.indications_and_usage?.[0]
    );

    console.log("\nWarnings:\n");

    console.log(
      data.warnings?.[0]
    );

  } catch (error) {

    console.log("\nERROR\n");

    console.log(
      error.response?.data ||
      error.message
    );

  }
}

testOpenFDA();
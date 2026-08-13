function calculateRecommendation(assessment) {

    const stage1 =
        assessment.stage1Answers || {};

    const stage2 =
        assessment.stage2Answers || {};

    const stage3 =
        assessment.stage3Answers || {};

    let recommendation =
        "Continue monitoring your symptoms and follow general health advice.";

    // Emergency symptoms
    if (
        stage3.visionLoss ||
        stage3.difficultyBreathing ||
        stage3.chestPain ||
        stage3.unconscious
    ) {

        recommendation =
        "Please seek immediate medical attention.";

    }

    // Symptoms that should be checked soon
    else if (
        stage2.highFever ||
        stage2.severePain ||
        stage2.vomiting
    ) {

        recommendation =
        "Please visit a nearby doctor for further evaluation.";

    }

    return {
        recommendation
    };

}

module.exports = {
    calculateRecommendation
};
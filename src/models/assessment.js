const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema(
{
    language: {
        type: String,
        default: "en"
    },

    age: {
        type: Number,
        required: true
    },

    gender: {
        type: String,
        required: true
    },

    symptoms: {
        type: [String],
        required: true
    },

    currentStage: {
        type: Number,
        default: 1
    },

    stage1Questions: {
        type: [String],
        default: []
    },

    stage1Answers: {
        type: [String],
        default: []
    },

    stage2Questions: {
        type: [String],
        default: []
    },

    stage2Answers: {
        type: [String],
        default: []
    },

    stage3Questions: {
        type: [String],
        default: []
    },

    stage3Answers: {
        type: [String],
        default: []
    },

    summary: {
        type: String,
        default: ""
    },

    advice: {
        type: String,
        default: ""
    },

    recommendation: {
        type: String,
        default: ""
    }

},
{
    timestamps: true
});

module.exports = mongoose.model(
    "Assessment",
    assessmentSchema
);
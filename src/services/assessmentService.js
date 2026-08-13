// ==========================================
// START OF FILE: assessmentService.js
// ==========================================

const Assessment = require('../models/Assessment'); 
const aiService = require('./aiService');           

/**
 * Hardened Service managing business logic for the Medical Assessment workflow.
 * Consolidated edition: Workflow orchestration logic and raw inline system engineering models 
 * are bound here to match exact triage transition markers.
 */
const assessmentService = {

  /**
   * Starts a new assessment workflow session.
   * If a single symptom is provided, triggers baseline Stage 1 diagnostic routing.
   * If multiple symptoms are provided, escalates instantly to Stage 2 configuration grids.
   */
  async startAssessment(data) {
    const { age, gender, language, symptoms } = data;

    if (!age) {
      throw new Error("Age is required.");
    }
    if (!gender) {
      throw new Error("Gender is required.");
    }
    if (!symptoms || (Array.isArray(symptoms) && symptoms.length === 0)) {
      throw new Error("At least one symptom is required.");
    }

    const symptomList = Array.isArray(symptoms) ? symptoms : [symptoms];
    const isMultiple = symptomList.length > 1;
    const startingStage = isMultiple ? 2 : 1;

    const assessment = new Assessment({
      age,
      gender,
      language: language || "en",
      symptoms: symptomList,
      currentStage: startingStage,
      status: "in_progress"
    });

    let aiPrompt;

    if (startingStage === 1) {
      // Stage 1 Prompt Engineering Block: Gathers generic details regarding the isolated primary symptom
      aiPrompt = `You are an expert medical diagnostic assistant. The patient is a ${age}-year-old ${gender} complaining of the following symptom: ${symptomList.join(', ')}.
Provide a JSON object containing exactly a "questions" array with 3 to 5 clear, consumer-friendly questions to screen the severity, duration, onset, and exacerbating factors of this symptom.
The output format must be exact JSON:
{
  "questions": ["Question 1", "Question 2", "Question 3"]
}`;
    } else {
      // Stage 2 Prompt Engineering Block: Directly triggers disease/differential mapping for combined symptoms
      aiPrompt = `You are an expert medical diagnostic assistant. The patient is a ${age}-year-old ${gender} presenting with multiple overlapping symptoms: ${symptomList.join(', ')}.
Analyze these indicators and generate a JSON object containing exactly a "questions" array with 4 to 6 disease-specific, clinical investigative questions aimed at tracking differential cross-dependencies, risk configurations, and physiological states.
The output format must be exact JSON:
{
  "questions": ["Question 1", "Question 2", "Question 3"]
}`;
    }

    let rawAiResponse;
    try {
      rawAiResponse = await aiService.askAI(aiPrompt);
    } catch (error) {
      console.error("Groq Layer Exception:", error);
      throw new Error("Unable to communicate with AI service.");
    }

    const aiResult = this._safeParseJson(rawAiResponse);

    if (!aiResult || !Array.isArray(aiResult.questions) || aiResult.questions.length === 0) {
      throw new Error("AI returned invalid questions.");
    }

    if (startingStage === 1) {
      assessment.stage1Questions = aiResult.questions;
    } else {
      assessment.stage2Questions = aiResult.questions;
    }

    await assessment.save();

    return {
      assessmentId: assessment._id,
      currentStage: assessment.currentStage,
      status: assessment.status,
      completed: false,
      questions: aiResult.questions
    };
  },

  /**
   * Processes submitted answers and moves through the state engine safely.
   * Handles Stage 1 triage determination (Mild vs. Serious) and Stage 2 final structural summaries.
   */
  async submitAnswer(data) {
    const { assessmentId, answers } = data;

    if (!assessmentId) {
      throw new Error("Assessment ID is required.");
    }
    if (!Array.isArray(answers) || answers.length === 0) {
      throw new Error("Answers must be a non-empty array.");
    }

    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      throw new Error('Assessment record not found.');
    }

    if (assessment.status === 'completed') {
      throw new Error('This assessment has already been finalized.');
    }

    const activeStage = parseInt(assessment.currentStage);

    // --- STAGE 1 PROCESSING ---
    if (activeStage === 1) {
      assessment.stage1Answers = answers;

      // Construct dynamic intermediate triage analysis prompt
      const triagePrompt = `You are an expert clinical triage system analyzing a ${assessment.age}-year-old ${assessment.gender}.
Primary Symptom: ${assessment.symptoms.join(', ')}
Screening Questions Asked: ${JSON.stringify(assessment.stage1Questions)}
Patient Answers Provided: ${JSON.stringify(answers)}

Evaluate if the clinical presentation reflects a "Mild" self-limiting issue or a potentially "Serious" diagnostic pathway.
You must respond with a JSON block containing a "severity" key set to either "Mild" or "Serious".
- If "Mild": include an "advice" string outlining immediate supportive self-care guidelines and an appropriate "recommendation" string.
- If "Serious": include a "questions" array containing 4 to 6 disease-specific, deep clinical investigative follow-up questions to distinguish differentials.

Response JSON Schema:
{
  "severity": "Mild" | "Serious",
  "advice": "Self-care guidelines if mild, otherwise empty string",
  "recommendation": "General standard safety precautions, otherwise empty string",
  "questions": ["Follow-up Q1", "Follow-up Q2"] 
}`;

      let rawAiResponse;
      try {
        rawAiResponse = await aiService.askAI(triagePrompt);
      } catch (error) {
        console.error("Groq Layer Exception:", error);
        throw new Error("Unable to communicate with AI service.");
      }

      const aiResult = this._safeParseJson(rawAiResponse);

      if (!aiResult || !aiResult.severity) {
        throw new Error("AI failed to return valid triage evaluation data blocks.");
      }

      if (aiResult.severity.toLowerCase() === 'mild') {
        // Triage Milestone: Mild path maps to instant completion with self-care details
        assessment.advice = aiResult.advice || "Rest, stay hydrated, and monitor your symptoms closely.";
        assessment.recommendation = aiResult.recommendation || "Consult a healthcare provider if symptoms change, worsen, or persist.";
        assessment.summary = `User evaluated with mild presentation of: ${assessment.symptoms.join(', ')}. No emergent criteria met.`;
        assessment.currentStage = 3; 
        assessment.status = "completed";
        await assessment.save();

        return {
          assessmentId: assessment._id,
          currentStage: assessment.currentStage,
          completed: true,
          status: assessment.status,
          evaluation: {
            summary: assessment.summary,
            advice: assessment.advice,
            recommendation: assessment.recommendation
          }
        };
      } else {
        // Triage Milestone: Serious path forks workflow state directly into specialized Stage 2 collection questions
        if (!Array.isArray(aiResult.questions) || aiResult.questions.length === 0) {
          throw new Error("AI flagged condition as serious but failed to supply targeted tracking questions.");
        }
        assessment.stage2Questions = aiResult.questions;
        assessment.currentStage = 2;
        await assessment.save();

        return {
          assessmentId: assessment._id,
          currentStage: assessment.currentStage,
          status: assessment.status,
          completed: false,
          questions: assessment.stage2Questions
        };
      }
    } 
    
    // --- STAGE 2 PROCESSING (FINAL REPORT) ---
    if (activeStage === 2) {
      assessment.stage2Answers = answers;

      // Construct final comprehensive summary prompt engine structure
      const finalPrompt = `You are a clinical diagnostic expert synthesizing a complex multi-stage symptom exploration case.
Patient Demographics: ${assessment.age}-year-old ${assessment.gender}
Presenting Complaints: ${JSON.stringify(assessment.symptoms)}
Stage 1 Questions asked: ${JSON.stringify(assessment.stage1Questions || [])}
Stage 1 Answers collected: ${JSON.stringify(assessment.stage1Answers || [])}
Stage 2 Deep Dive Questions asked: ${JSON.stringify(assessment.stage2Questions || [])}
Stage 2 Deep Dive Answers collected: ${JSON.stringify(answers)}

Deliver a full diagnostic synthesis summary. Output strict JSON with these precise keys:
{
  "summary": "Detailed medical summary outlining possible conditions, clinical risks, and history tracking metrics.",
  "advice": "Actionable symptom mitigation protocols, dietary/rest support mechanisms, or explicit standard red flags.",
  "recommendation": "Clear triage directives regarding whether doctor consultation, expert follow-up, or prompt emergency room evaluation is warranted."
}`;

      let rawAiResponse;
      try {
        rawAiResponse = await aiService.askAI(finalPrompt);
      } catch (error) {
        console.error("Groq Layer Exception:", error);
        throw new Error("Unable to communicate with AI service.");
      }

      const evaluation = this._safeParseJson(rawAiResponse);

      if (!evaluation.summary || !evaluation.advice || !evaluation.recommendation) {
        throw new Error("AI returned incomplete diagnostic summary structure details.");
      }

      assessment.summary = evaluation.summary;
      assessment.advice = evaluation.advice;
      assessment.recommendation = evaluation.recommendation;

      // Dynamic safety override criteria for multiple or escalated systemic symptom complexes
      if (
        assessment.symptoms.length > 1 && 
        (!evaluation.recommendation || !evaluation.recommendation.toLowerCase().includes("doctor"))
      ) {
        assessment.recommendation = "We strongly advise you to visit your nearest healthcare professional to evaluate these combined symptoms comprehensively.";
      }

      assessment.currentStage = 3; 
      assessment.status = "completed";
      await assessment.save();

      return {
        assessmentId: assessment._id,
        currentStage: assessment.currentStage,
        completed: true,
        status: assessment.status,
        evaluation: {
          summary: assessment.summary,
          advice: assessment.advice,
          recommendation: assessment.recommendation
        }
      };
    }

    throw new Error('Invalid assessment stage transition state.');
  },

  /**
   * Cleans text conversational artifacts and regex extracts pure data blocks.
   */
  _safeParseJson(rawString) {
    if (typeof rawString !== "string") {
      throw new Error("Invalid AI response type encountered.");
    }

    try {
      const jsonMatch = rawString.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      
      if (!jsonMatch) {
        throw new Error("JSON structure not found.");
      }
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error("Raw AI string dump:", rawString);
      throw new Error("Invalid JSON layout inside response payload.");
    }
  }
};

module.exports = assessmentService;
// ==========================================
// END OF FILE: assessmentService.js
// ==========================================
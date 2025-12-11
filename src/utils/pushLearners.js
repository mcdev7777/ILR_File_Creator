const { buildEmploymentArray } = require("../factories/buildEmploymentArray");
const { buildLLDDHealthProb, buildLLDDandHealthProblem } = require("../factories/buildHealthDetails");
const { buildLearnerDetails, buildContactDetails } = require("../factories/buildLearnerDetails");
const { buildLearningDeliveryArray } = require("../factories/buildLearningDeliveryArray");
const { buildPriorAttainment } = require("../factories/buildPriorAttainment");
const { buildReferenceNumbers } = require("../factories/buildReferenceNumbers");

function pushLearners(dataArray, xmlBase) {
  for (let i = 1; i < dataArray.length; i++) {
    const refNumbers = buildReferenceNumbers(dataArray, i);

    // Build learner object in exact schema order (see schemafile.xsd lines 186-549)
    const learner = {
      // 1. Reference numbers
      LearnRefNumber: refNumbers.LearnRefNumber,
      PrevLearnRefNumber: refNumbers.PrevLearnRefNumber || undefined,
      ULN: refNumbers.ULN,
      // 2. Personal details (FamilyName, GivenNames, DateOfBirth, Ethnicity, Sex)
      ...buildLearnerDetails(dataArray, i),
      // 3. LLDDHealthProb (must come before NINumber)
      ...buildLLDDHealthProb(dataArray, i),
      // 4. Contact details (NINumber, PlanLearnHours, PostcodePrior, Postcode, AddLine1, TelNo)
      ...buildContactDetails(dataArray, i),
      // 5. PriorAttain
      ...buildPriorAttainment(dataArray, i),
      // 6. LLDDandHealthProblem (comes after PriorAttain)
      ...buildLLDDandHealthProblem(dataArray, i),
      // 7. LearnerEmploymentStatus
      LearnerEmploymentStatus: buildEmploymentArray(dataArray, i),
      // 8. LearningDelivery
      LearningDelivery: buildLearningDeliveryArray(dataArray, i)
    }

    xmlBase.Learner.push(learner);
  }
}

module.exports = { pushLearners };

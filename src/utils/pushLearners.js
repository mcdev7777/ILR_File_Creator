const { buildEmploymentArray } = require("../factories/buildEmploymentArray");
const { buildHealthDetails } = require("../factories/buildHealthDetails");
const { buildLearnerDetails } = require("../factories/buildLearnerDetails");
const { buildLearningDeliveryArray } = require("../factories/buildLearningDeliveryArray");
const { buildPriorAttainment } = require("../factories/buildPriorAttainment");
const { buildReferenceNumbers } = require("../factories/buildReferenceNumbers");

function pushLearners(dataArray, xmlBase) {
  for (let i = 1; i <= dataArray.length; i++) {
    const learner = {
      ...buildReferenceNumbers(dataArray, i),
      ...buildLearnerDetails(dataArray, i),
      ...buildHealthDetails(dataArray, i),
      ...buildPriorAttainment(dataArray, i),
      LearnerEmploymentStatus: buildEmploymentArray(dataArray, i),
      LearningDelivery: buildLearningDeliveryArray(dataArray, i)
    }

    xmlBase.Learner.push(learner);
  }
}

module.exports = { pushLearners };

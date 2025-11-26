const { buildEmploymentArray } = require("./buildEmploymentArray");
const { buildLearningDeliveryArray } = require("./buildLearningDeliveryArray");

function pushLearners(dataArray, xmlBase) {
  for (let i = 1; i < dataArray.length; i++) {
    const refNumber = i
        .toString()
        .padStart(4, "0");

    const employmentStatusArray = buildEmploymentArray(dataArray, i);
    const learningDeliveryArray = buildLearningDeliveryArray(dataArray, i);

    const learner = {
      LearnRefNumber: refNumber,
      ULN: dataArray[i][2],
      FamilyName: dataArray[i][4].trim(),
      GivenNames: dataArray[i][3].trim(),
      DateOfBirth: dataArray[i][6],
      Ethnicity: dataArray[i][8],
      Sex: dataArray[i][5],
      LLDDHealthProb: dataArray[i][12],
      NINumber: dataArray[i][7].replace(/\s+/g, "").trim(),
      PlanLearnHours: dataArray[i][16] || undefined,
      PostcodePrior: dataArray[i][9].trim(),
      Postcode: dataArray[i][10].trim(),
      AddLine1: dataArray[i][11]
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .trim()
        .substring(0, 50),
      TelNo: dataArray[i][12] || undefined,
      LLDDHealthProb: dataArray[i][13] != "99" ? 1 : 9,
      PriorAttain: {
        PriorLevel: dataArray[i][15],
        DateLevelApp: dataArray[i][14],
      },
      LLDDandHealthProblem: dataArray[i][13] != "99"
        ? [{ LLDDCat: dataArray[i][13], PrimaryLLDD: 1 }]
        : undefined,
      LearnerEmploymentStatus: employmentStatusArray,
      LearningDelivery: learningDeliveryArray
    }

    xmlBase.Learner.push(learner);
  }
}

module.exports = { pushLearners };

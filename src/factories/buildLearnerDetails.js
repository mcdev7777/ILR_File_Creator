function buildLearnerDetails(dataArray, i) {
  return {
    FamilyName: dataArray[i][4].trim(),
    GivenNames: dataArray[i][3].trim(),
    DateOfBirth: dataArray[i][6],
    Ethnicity: dataArray[i][8],
    Sex: dataArray[i][5],
    NINumber: dataArray[i][7].replace(/\s+/g, "").trim(),
    PlanLearnHours: dataArray[i][16] || undefined,
    PostcodePrior: dataArray[i][9].trim(),
    Postcode: dataArray[i][10].trim(),
    AddLine1: dataArray[i][11].replace(/[^a-zA-Z0-9\s]/g, "").trim().substring(0, 50),
    TelNo: dataArray[i][12] || undefined
  }
}

module.exports = { buildLearnerDetails };
function buildLLDDHealthProb(dataArray, i) {
  // LLDDHealthProb comes before NINumber in schema
  return {
    LLDDHealthProb: dataArray[i][13] != "99" ? 1 : 9,
  }
}

function buildLLDDandHealthProblem(dataArray, i) {
  // LLDDandHealthProblem comes after PriorAttain in schema
  return dataArray[i][13] != "99"
    ? {
        LLDDandHealthProblem: [{
          LLDDCat: dataArray[i][13],
          PrimaryLLDD: 1
        }]
      }
    : {}
}

module.exports = { buildLLDDHealthProb, buildLLDDandHealthProblem };
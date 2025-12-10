function buildHealthDetails(dataArray, i) {
  return {
    LLDDHealthProb: dataArray[i][13] != "99" ? 1 : 9,
    LLDDandHealthProblem: dataArray[i][13] != "99"
      ? [{
        LLDDCat: dataArray[i][13],
        PrimaryLLDD: 1
      }]
      : undefined
  }
}

module.exports = { buildHealthDetails };
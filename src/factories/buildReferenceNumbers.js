function buildReferenceNumbers(dataArray, i) {
  return {
    LearnRefNumber: dataArray[i][223],
    ULN: dataArray[i][2],
    PrevLearnRefNumber: dataArray[i][222]
  }
}

module.exports = { buildReferenceNumbers };

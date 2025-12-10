function buildPriorAttainment(dataArray, i) {
  return {
    PriorAttain: {
      PriorLevel: dataArray[i][15],
      DateLevelApp: dataArray[i][14],
    },
  }
}

module.exports = { buildPriorAttainment };
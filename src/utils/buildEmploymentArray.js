function buildEmploymentArray(dataArray, i) {

  return [
    ...(dataArray[i][18] /* Employment Status #1 */
      ? [{
        EmpStat: dataArray[i][18],
        DateEmpStatApp: dataArray[i][17],
        EmpId: dataArray[i][19] || undefined,
        EmploymentStatusMonitoring: [
          ...(dataArray[i][23]
            ? [{ ESMType: "LOE", ESMCode: dataArray[i][23] }]
            : []
          ),
          ...(dataArray[i][24]
            ? [{ ESMType: "EII", ESMCode: dataArray[i][24] }]
            : []
          ),
          ...(dataArray[i][25]
            ? [{ ESMType: "LOU", ESMCode: dataArray[i][25] }]
            : []
          ),
          ...(dataArray[i][21]
            ? [{ ESMType: "SEI", ESMCode: "1" }]
            : []
          ),
          ...(dataArray[i][20]
            ? [{ ESMType: "SEM", ESMCode: "1" }, { ESMType: "OET", ESMCode: "2" }]
            : []
          ),
          ...(dataArray[i][22]
            ? [{ ESMType: "OET", ESMCode: "1" }]
            : []
          ),
        ],
      }]
      : [/* No Employment Status #1 */]
    ),
    ...(dataArray[i][27] /* Employment Status #2 */
      ? [{
        EmpStat: dataArray[i][27],
        DateEmpStatApp: dataArray[i][26],
        EmpId: dataArray[i][28] || undefined,
        EmploymentStatusMonitoring: [
          ...(dataArray[i][29]
            ? [{ ESMType: "EII", ESMCode: dataArray[i][29] }]
            : []
          ),
          ...(dataArray[i][33]
            ? [{ ESMType: "LOE", ESMCode: dataArray[i][33] }]
            : []
          ),
          ...(dataArray[i][31]
            ? [{ ESMType: "SEI", ESMCode: "1" }]
            : []
          ),
          ...(dataArray[i][32]
            ? [{ ESMType: "SEM", ESMCode: "1" }]
            : []
          ),
          ...(dataArray[i][30]
            ? [{ ESMType: "OET", ESMCode: "1" }]
            : []
          ),
        ],
      }]
      : [/* No Employment Status #2 */]
    ),
  ]
}

module.exports = { buildEmploymentArray };

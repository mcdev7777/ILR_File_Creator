function buildEmploymentArray(dataArray, i) {
  return [
    ...(/* Employment Status #1 */ dataArray[i][18]
      ? [{
        /* Employment Status #1 */ EmpStat: dataArray[i][18],
        /* Employment #1 date applies to */ DateEmpStatApp: dataArray[i][17],
        /* Employer identifier #1 */ EmpId: dataArray[i][19] || undefined,
        EmploymentStatusMonitoring: [
          ...(/* Length of employment #1 */ dataArray[i][23]
            // Length of employment #1
            ? [{ ESMType: "LOE", ESMCode: dataArray[i][23] }]
            : []
          ),
          ...(/* Employment intensity indicator #1 */ dataArray[i][24]
            // Employment intensity indicator #1
            ? [{ ESMType: "EII", ESMCode: dataArray[i][24] }]
            : []
          ),
          ...(/* Length of unemployment #1 */ dataArray[i][25]
            // Length of unemployment #1
            ? [{ ESMType: "LOU", ESMCode: dataArray[i][25] }]
            : []
          ),
          ...(/* Is the learner self employed? #1 */ dataArray[i][21]
            ? [{ ESMType: "SEI", ESMCode: "1" }]
            : []
          ),
          ...(/* Small employer #1 */ dataArray[i][20]
            ? [{ ESMType: "SEM", ESMCode: "1" }, { ESMType: "OET", ESMCode: "2" }]
            : []
          ),
          ...(/* Has the learner been made redundant? #1 */ dataArray[i][22]
            ? [{ ESMType: "OET", ESMCode: "1" }]
            : []
          ),
        ],
      }]
      : []
    ),
    ...(/* Employment Status #2 */ dataArray[i][27]
      ? [{
        /* Employment Status #2 */ EmpStat: dataArray[i][27],
        /* Employment #2 date applies to */ DateEmpStatApp: dataArray[i][26],
        /* Employer identifier 2 */ EmpId: dataArray[i][28] || undefined,
        EmploymentStatusMonitoring: [
          ...(/* Length of employment #2 */ dataArray[i][33]
            // Length of employment #2
            ? [{ ESMType: "LOE", ESMCode: dataArray[i][33] }]
            : []
          ),
          ...(/* Employment intensity indicator #2 */ dataArray[i][29]
            // Employment intensity indicator #2
            ? [{ ESMType: "EII", ESMCode: dataArray[i][29] }]
            : []
          ),
          ...(/* Length of unemployment #2 */ dataArray[i][194]
            // Date applies to Employment status #2
            ? [{ ESMType: "LOU", ESMCode: dataArray[i][194] }]
            : []
          ),
          ...(/* Is the learner self employed? #2 */ dataArray[i][31]
            ? [{ ESMType: "SEI", ESMCode: "1" }]
            : []
          ),
          ...(/* Small employer #2 */ dataArray[i][32]
            ? [{ ESMType: "SEM", ESMCode: "1" }, { ESMType: "OET", ESMCode: "2" }]
            : []
          ),
          ...(/* Has the learner been made redundant? #2 */ dataArray[i][30]
            ? [{ ESMType: "OET", ESMCode: "1" }]
            : []
          ),
        ],
      }]
      : []
    ),
    ...(/* Employment Status #3 */ dataArray[i][196]
      ? [{
        /* Employment Status #3 */ EmpStat: dataArray[i][196],
        /* Date applies to Employment status #3 */ DateEmpStatApp: dataArray[i][195],
        /* Employer identifier #3 */ EmpId: dataArray[i][197] || undefined,
        EmploymentStatusMonitoring: [
          ...(/* Length of employment #3 */ dataArray[i][201]
            // Length of employment #3
            ? [{ ESMType: "LOE", ESMCode: dataArray[i][201] }]
            : []
          ),
          ...(/* Employment intensity indicator #3 */ dataArray[i][--]
            // Employment intensity indicator #3
            ? [{ ESMType: "EII", ESMCode: dataArray[i][--] }]
            : []
          ),
          ...(/* Length of unemployment #3 */ dataArray[i][203]
            // Date applies to Employment status #
            ? [{ ESMType: "LOU", ESMCode: dataArray[i][203] }]
            : []
          ),
          ...(/* Is the learner self employed? #3 */ dataArray[i][199]
            ? [{ ESMType: "SEI", ESMCode: "1" }]
            : []
          ),
          ...(/* Small employer #3 */ dataArray[i][198]
            ? [{ ESMType: "SEM", ESMCode: "1" }, { ESMType: "OET", ESMCode: "2" }]
            : []
          ),
          ...(/* Has the learner been made redundant? #3 */ dataArray[i][200]
            ? [{ ESMType: "OET", ESMCode: "1" }]
            : []
          ),
        ],
      }]
      : []
    ),
    ...(/* Employment Status #4 */ dataArray[i][205]
      ? [{
        /* Employment Status #4 */ EmpStat: dataArray[i][205],
        /* Employment #4 date applies to */ DateEmpStatApp: dataArray[i][204],
        /* Employer identifier #4 */ EmpId: dataArray[i][206] || undefined,
        EmploymentStatusMonitoring: [
          ...(/* Length of employment #4 */ dataArray[i][210]
            // Length of employment #4
            ? [{ ESMType: "LOE", ESMCode: dataArray[i][--] }]
            : []
          ),
          ...(/* Employment intensity indicator #4 */ dataArray[i][--]
            // Employment intensity indicator #4
            ? [{ ESMType: "EII", ESMCode: dataArray[i][--] }]
            : []
          ),
          ...(/* Length of unemployment #4 */ dataArray[i][212]
            // Date applies to Employment status #
            ? [{ ESMType: "LOU", ESMCode: dataArray[i][212] }]
            : []
          ),
          ...(/* Is the learner self employed? #4 */ dataArray[i][208]
            ? [{ ESMType: "SEI", ESMCode: "1" }]
            : []
          ),
          ...(/* Small employer #4 */ dataArray[i][207]
            ? [{ ESMType: "SEM", ESMCode: "1" }, { ESMType: "OET", ESMCode: "2" }]
            : []
          ),
          ...(/* Has the learner been made redundant? #4 */ dataArray[i][209]
            ? [{ ESMType: "OET", ESMCode: "1" }]
            : []
          ),
        ],
      }]
      : []
    ),
    ...(/* Employment Status #5 */ dataArray[i][214]
      ? [{
        /* Employment Status #5 */ EmpStat: dataArray[i][214],
        /* Employment #5 date applies to */ DateEmpStatApp: dataArray[i][213],
        /* Employer identifier #5 */ EmpId: dataArray[i][215] || undefined,
        EmploymentStatusMonitoring: [
          ...(/* Length of employment #5 */ dataArray[i][219]
            // Length of employment #
            ? [{ ESMType: "LOE", ESMCode: dataArray[i][--] }]
            : []
          ),
          ...(/* Employment intensity indicator #5 */ dataArray[i][--]
            // Employment intensity indicator #5
            ? [{ ESMType: "EII", ESMCode: dataArray[i][--] }]
            : []
          ),
          ...(/* Length of unemployment #5 */ dataArray[i][221]
            // Date applies to Employment status #
            ? [{ ESMType: "LOU", ESMCode: dataArray[i][221] }]
            : []
          ),
          ...(/* Is the learner self employed? #5 */ dataArray[i][217]
            ? [{ ESMType: "SEI", ESMCode: "1" }]
            : []
          ),
          ...(/* Small employer #5 */ dataArray[i][216]
            ? [{ ESMType: "SEM", ESMCode: "1" }, { ESMType: "OET", ESMCode: "2" }]
            : []
          ),
          ...(/* Has the learner been made redundant? #5 */ dataArray[i][218]
            ? [{ ESMType: "OET", ESMCode: "1" }]
            : []
          ),
        ],
      }]
      : []
    ),
  ]
}

/** TODO
 * 3 | 114 | 116 | Employment Intensity
 * 4 | 140 | 142 | Employment Intensity
 * 5 | 184 | 186 | Employment Intensity
*/

module.exports = { buildEmploymentArray };
const { app, BrowserWindow, ipcMain, globalShortcut } = require("electron");
const path = require("node:path");
const fs = require("fs");
const xmlbuilder = require("xmlbuilder");
const currentDate = new Date(Date());
const isoWithoutMsOrZ = currentDate.toISOString().split('.')[0];
const dateOnlyString = isoWithoutMsOrZ.replace(/T.*/, '');

let xmlBase = {
  //is ther a larger outer layer check schema
  
  Header: {
    CollectionDetails: {
      Collection: "ILR",
      Year: "2324",
    
      FilePreparationDate: dateOnlyString,
    },
    Source: {
      ProtectiveMarking: "OFFICIAL-SENSITIVE-Personal",
      UKPRN: "10085696",
      SoftwareSupplier: "Education & Skills Funding Agency",
      SoftwarePackage: "ILR Learner Entry",
      Release: "2324.1.92.0",
      SerialNo: "01",
      DateTime: isoWithoutMsOrZ,
    },
   
  },
  LearningProvider: {
    UKPRN: "10085696",
  },
   Learner:
    [
 
    ]
};

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "renderer.js"),
      nodeIntegration: true,
      contextIsolation: false,
      // these are bad practice and I should change if time can set isolation to true and set a file allowing only the apis I know I want to use
    },
  });

  win.loadFile("index.html");

  globalShortcut.register("CommandOrControl+Shift+I", () => {
    win.webContents.toggleDevTools();
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

ipcMain.on("upload-csv", (event, dataArray, version) => {
  console.log(dataArray);
  console.log("Funding Indicator (Index 51):", dataArray[0][51]);
  console.log("1st value Funding Indicator (Index 51):", dataArray[1][51]);
    if (dataArray.some((learner, learnerIndex) => 
    learner.some((item, index) => {
      // might need to add exceptions based on things that are missing from examples
      // const exceptionIndices = [0,11,16, 17, 18, 19, 20, 21, 23, 24, 25, 26, 27, 28, 35, 36, 37, 38, 
      //   39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 
      //   60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76];
let exceptionIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192];
    if (item === "" && !exceptionIndices.includes(index)) {
        const missingField = dataArray[0][index] || `Field at index ${index}`;
        event.reply('show-alert', `Data missing: ${missingField} for learner ${learnerIndex}`);
        return true;
      }
      return false;
    })
  )) {
    event.reply('show-alert', 'Please fill in all required fields');
  }
else{ 
  // test this works and require it
  xmlBase.Header.Source.Release = version
  xmlBase.Header.CollectionDetails.Year = version.split('.')[0];
  let refNumber = 0
for (let i = 1; i < dataArray.length; i++) {
  refNumber = i.toString().padStart(4, '0');
  xmlBase.Learner.push({
    LearnRefNumber: refNumber,
    ULN: dataArray[i][2],
    FamilyName: dataArray[i][4],
    GivenNames: dataArray[i][3],
    DateOfBirth: dataArray[i][6],
    Ethnicity: dataArray[i][8],
    Sex: dataArray[i][5],
    LLDDHealthProb: dataArray[i][12],
    NINumber: dataArray[i][7],
    PlanLearnHours: dataArray[i][32] || undefined,
    PostcodePrior: dataArray[i][9],
    Postcode: dataArray[i][10],
    AddLine1: dataArray[i][11],
    TelNo: dataArray[i][12] || undefined,
    LLDDHealthProb: (dataArray[i][14] != "99"? 1 : 9),
    PriorAttain: {
      PriorLevel: dataArray[i][16],
      DateLevelApp: dataArray[i][15]
    },
  
    LLDDandHealthProblem:(dataArray[i][14] != "99"? [
      {LLDDCat:dataArray[i][14],
        PrimaryLLDD:1 
    },
  {
    LLDDCat:dataArray[i][13]
  }]: undefined),
    LearnerEmploymentStatus: [
      ...(dataArray[i][19] ? [{
        EmpStat: dataArray[i][19],
        DateEmpStatApp: dataArray[i][18],
        EmpId: dataArray[i][20] || undefined,// unsure all are empty in view 
        // add emp ID to others
        EmploymentStatusMonitoring: [
          ...(dataArray[i][24] ? [{
            ESMType: "LOE",
            ESMCode: dataArray[i][24]
            // change orders in other aims
          }] : []),
          ...(dataArray[i][25] ? [{
            ESMType: "EII",
            ESMCode: dataArray[i][25]
          }] : []),
          ...(dataArray[i][26] ? [{
            ESMType: "LOU",
            ESMCode: dataArray[i][26]
          }] : []),
          ...(dataArray[i][22] ? [{
            ESMType: "SEI",
            ESMCode: "1"
          }] : []),
          ...(dataArray[i][21] ? [{
            ESMType: "SEM",
            ESMCode: "1"
          }] : []),
          ...(dataArray[i][23] ? [{
            ESMType: "OET",
            ESMCode: "1"
          }] : [])
        ]
      }] : []),
      ...(dataArray[i][28] ? [{
        EmpStat: dataArray[i][28],
        DateEmpStatApp: dataArray[i][27],
        EmploymentStatusMonitoring: [
          ...(dataArray[i][30] ? [{
            ESMType: "EII",
            ESMCode: dataArray[i][30]
          }] : []),
          ...(dataArray[i][34] ? [{
            ESMType: "LOE",
            ESMCode: dataArray[i][34]
          }] : []),
          ...(dataArray[i][32] ? [{
            ESMType: "SEI",
            ESMCode: "1"
          }] : []),
          ...(dataArray[i][33] ? [{
            ESMType: "SEM",
            ESMCode: "1"
          }] : []),
          ...(dataArray[i][31] ? [{
            ESMType: "OET",
            ESMCode: "1"
          }] : [])
        ]
      }] : [])
    ],
    LearningDelivery: [
      // First aim - only include if required fields are present
      ...(dataArray[i][35] ? [{
        LearnAimRef: dataArray[i][36],
        AimType: dataArray[i][35],
        AimSeqNumber: '1',
        LearnStartDate: dataArray[i][37],
        LearnPlanEndDate: dataArray[i][38],
        FundModel: dataArray[i][39],
        PHours: dataArray[i][43] || undefined,
        OTJActHours: dataArray[i][44] || undefined,
        ProgType: dataArray[i][40],
        StdCode: dataArray[i][41],
        DelLocPostCode: dataArray[i][42],
        EPAOrgID: dataArray[i][46] || undefined,
        ConRefNumber: dataArray[i][45] || undefined,
        CompStatus: dataArray[i][61] || undefined,
        LearnActEndDate: dataArray[i][62] || undefined,
        WithdrawReason: dataArray[i][65] || undefined,
        Outcome: dataArray[i][64] || undefined,
        AchDate: dataArray[i][63] || undefined,
        OutGrade: dataArray[i][66] || undefined,
        SWSupAimId: crypto.randomUUID(),
        LearningDeliveryFAM: [
          ...(dataArray[i][51] ? [{
            LearnDelFAMType: 'FFI',
            LearnDelFAMCode: dataArray[i][51]
          }] : []),
          ...(dataArray[i][52] ? [{
            LearnDelFAMType: 'SOF',
            LearnDelFAMCode: dataArray[i][52]
          }] : []),
          ...(dataArray[i][69] ? [{
            LearnDelFAMType: dataArray[i][47],
            LearnDelFAMCode: dataArray[i][48],
            LearnDelFAMDateFrom: dataArray[i][49] || undefined,
            LearnDelFAMDateTo: dataArray[i][50] || undefined
          }] : [])
        ],
        AppFinRecord: [
          ...(dataArray[i][53] ? [{
            AFinType: dataArray[i][53],
            AFinCode: dataArray[i][54] || undefined,
            AFinDate: dataArray[i][55] || undefined,
            AFinAmount: dataArray[i][56] || undefined
          }] : []),
          ...(dataArray[i][57] ? [{
            AFinType: dataArray[i][57],
            AFinCode: dataArray[i][58] || undefined,
            AFinDate: dataArray[i][59] || undefined,
            AFinAmount: dataArray[i][60] || undefined
          }] : [])
        ]
      }] : []),
      
      // Second aim - only include if required fields are present
      ...(dataArray[i][67] ? [{
        LearnAimRef: dataArray[i][68],
        AimType: dataArray[i][67],
        AimSeqNumber: '2',
        LearnStartDate: dataArray[i][69],
        LearnPlanEndDate: dataArray[i][70],
        FundModel: dataArray[i][71],
        ProgType: dataArray[i][72],
        DelLocPostCode: dataArray[i][74],
        PHours: dataArray[i][75] || undefined,
        OTJActHours: dataArray[i][76] || undefined,
        EPAOrgID: dataArray[i][77] || undefined,
        ConRefNumber: dataArray[i][78] || undefined,
        CompStatus: dataArray[i][93] || undefined,
        LearnActEndDate: dataArray[i][94] || undefined,
        WithdrawReason: dataArray[i][96] || undefined,
        Outcome: dataArray[i][95] || undefined,
        AchDate: dataArray[i][97] || undefined,
        OutGrade: dataArray[i][98] || undefined,
        SWSupAimId: crypto.randomUUID(),
        LearningDeliveryFAM: [
          ...(dataArray[i][83] ? [{
            LearnDelFAMType: 'FFI',
            LearnDelFAMCode: dataArray[i][83] 
          }] : []),
          ...(dataArray[i][84] ? [{
            LearnDelFAMType: 'SOF',
            LearnDelFAMCode: dataArray[i][84] 
          }] : []),
          ...(dataArray[i][89] ? [{
            LearnDelFAMType: dataArray[i][85],
            LearnDelFAMCode: dataArray[i][86],
            LearnDelFAMDateFrom: dataArray[i][87] || undefined,
            LearnDelFAMDateTo: dataArray[i][88] || undefined
          }] : [])
        ],
        AppFinRecord: [
          ...(dataArray[i][90] ? [{
            AFinType: dataArray[i][90],
            AFinCode: dataArray[i][91] || undefined,
            AFinDate: dataArray[i][92] || undefined,
            AFinAmount: dataArray[i][93] || undefined
          }] : []),
          ...(dataArray[i][94] ? [{
            AFinType: dataArray[i][94],
            AFinCode: dataArray[i][95] || undefined,
            AFinDate: dataArray[i][96] || undefined,
            AFinAmount: dataArray[i][97] || undefined
          }] : [])
        ]
      }] : []),

      // Third aim - only include if required fields are present
      ...(dataArray[i][99] ? [{
        LearnAimRef: dataArray[i][100],
        AimType: dataArray[i][99],
        AimSeqNumber: '3',
        LearnStartDate: dataArray[i][101],
        LearnPlanEndDate: dataArray[i][102],
        FundModel: dataArray[i][103],
        ProgType: dataArray[i][104],
        DelLocPostCode: dataArray[i][106],
        PHours: dataArray[i][107] || undefined,
        OTJActHours: dataArray[i][108] || undefined,
        EPAOrgID: dataArray[i][109] || undefined,
        ConRefNumber: dataArray[i][110] || undefined,
        CompStatus: dataArray[i][125] || undefined,
        LearnActEndDate: dataArray[i][126] || undefined, 
        WithdrawReason: dataArray[i][128] || undefined,
        Outcome: dataArray[i][127] || undefined,
        AchDate: dataArray[i][129] || undefined,
        OutGrade: dataArray[i][130] || undefined,
        SWSupAimId: crypto.randomUUID(),
        LearningDeliveryFAM: [
          ...(dataArray[i][115] ? [{
            LearnDelFAMType: 'FFI',
            LearnDelFAMCode: dataArray[i][115] 
          }] : []),
          ...(dataArray[i][116] ? [{
            LearnDelFAMType: 'SOF',
            LearnDelFAMCode: dataArray[i][116] 
          }] : []),
          ...(dataArray[i][121] ? [{
            LearnDelFAMType: dataArray[i][117],
            LearnDelFAMCode: dataArray[i][118],
            LearnDelFAMDateFrom: dataArray[i][119] || undefined,
            LearnDelFAMDateTo: dataArray[i][120] || undefined
          }] : [])
        ],
        AppFinRecord: [
          ...(dataArray[i][122] ? [{
            AFinType: dataArray[i][122],
            AFinCode: dataArray[i][123] || undefined,
            AFinDate: dataArray[i][124] || undefined,
            AFinAmount: dataArray[i][125] || undefined
          }] : []),
          ...(dataArray[i][126] ? [{
            AFinType: dataArray[i][126],
            AFinCode: dataArray[i][127] || undefined,
            AFinDate: dataArray[i][128] || undefined,
            AFinAmount: dataArray[i][129] || undefined
          }] : [])
        ]
      }] : []),

      // Fourth aim - only include if required fields are present
      ...(dataArray[i][131] ? [{
        LearnAimRef: dataArray[i][132],
        AimType: dataArray[i][131],
        AimSeqNumber: '4',
        LearnStartDate: dataArray[i][133],
        LearnPlanEndDate: dataArray[i][134],
        FundModel: dataArray[i][135],
        ProgType: dataArray[i][136],
        DelLocPostCode: dataArray[i][138],
        PHours: dataArray[i][139] || undefined,
        OTJActHours: dataArray[i][140] || undefined,
        EPAOrgID: dataArray[i][141] || undefined,
        ConRefNumber: dataArray[i][142] || undefined,
        CompStatus: dataArray[i][157] || undefined,
        LearnActEndDate: dataArray[i][158] || undefined,
        WithdrawReason: dataArray[i][160] || undefined,
        Outcome: dataArray[i][159] || undefined,
        AchDate: dataArray[i][161] || undefined,
        OutGrade: dataArray[i][162] || undefined,
        SWSupAimId: crypto.randomUUID(),
        LearningDeliveryFAM: [
          ...(dataArray[i][163] ? [{
            LearnDelFAMType: 'FFI',
            LearnDelFAMCode: dataArray[i][163] 
          }] : []),
          ...(dataArray[i][164] ? [{
            LearnDelFAMType: 'SOF',
            LearnDelFAMCode: dataArray[i][164] 
          }] : []),
          ...(dataArray[i][169] ? [{
            LearnDelFAMType: dataArray[i][165],
            LearnDelFAMCode: dataArray[i][166],
            LearnDelFAMDateFrom: dataArray[i][167] || undefined,
            LearnDelFAMDateTo: dataArray[i][168] || undefined
          }] : [])
        ],
        AppFinRecord: [
          ...(dataArray[i][170] ? [{
            AFinType: dataArray[i][170],
            AFinCode: dataArray[i][171] || undefined,
            AFinDate: dataArray[i][172] || undefined,
            AFinAmount: dataArray[i][173] || undefined
          }] : []),
          ...(dataArray[i][174] ? [{
            AFinType: dataArray[i][174],
            AFinCode: dataArray[i][175] || undefined,
            AFinDate: dataArray[i][176] || undefined,
            AFinAmount: dataArray[i][177] || undefined
          }] : [])
        ]
      }] : []),

      // Fifth aim - only include if required fields are present
      ...(dataArray[i][163] ? [{
        LearnAimRef: dataArray[i][164],
        AimType: dataArray[i][163],
        AimSeqNumber: '5',
        LearnStartDate: dataArray[i][165],
        LearnPlanEndDate: dataArray[i][166],
        FundModel: dataArray[i][167],
        ProgType: dataArray[i][168],
        DelLocPostCode: dataArray[i][170],
        PHours: dataArray[i][171] || undefined,
        OTJActHours: dataArray[i][172] || undefined,
        EPAOrgID: dataArray[i][173] || undefined,
        ConRefNumber: dataArray[i][174] || undefined,
        CompStatus: dataArray[i][189] || undefined,
        LearnActEndDate: dataArray[i][190] || undefined,
        WithdrawReason: dataArray[i][192] || undefined,
        Outcome: dataArray[i][191] || undefined,
        AchDate: dataArray[i][193] || undefined,
        OutGrade: dataArray[i][194] || undefined,
        SWSupAimId: crypto.randomUUID(),
        LearningDeliveryFAM: [
          ...(dataArray[i][195] ? [{
            LearnDelFAMType: 'FFI',
            LearnDelFAMCode: dataArray[i][195] 
          }] : []),
          ...(dataArray[i][196] ? [{
            LearnDelFAMType: 'SOF',
            LearnDelFAMCode: dataArray[i][196] 
          }] : []),
          ...(dataArray[i][201] ? [{
            LearnDelFAMType: dataArray[i][197],
            LearnDelFAMCode: dataArray[i][198],
            LearnDelFAMDateFrom: dataArray[i][199] || undefined,
            LearnDelFAMDateTo: dataArray[i][200] || undefined
          }] : [])
        ],
        AppFinRecord: [
          ...(dataArray[i][202] ? [{
            AFinType: dataArray[i][202],
            AFinCode: dataArray[i][203] || undefined,
            AFinDate: dataArray[i][204] || undefined,
            AFinAmount: dataArray[i][205] || undefined
          }] : [])
        ]
      }] : [])
      
    ],
  });
}
  const xml = xmlbuilder.create({
    Message: xmlBase
  }, {
    encoding: 'utf-8',
  })
  //make version specific
  .att('xmlns', 'ESFA/ILR/2024-25')
  .att('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance')
  .end({ pretty: true });

  const formatDateTime = (date) => {
    const yyyymmdd = date.toISOString().split('T')[0].replace(/-/g, '');
    const hhmmss = date.toTimeString().split(' ')[0].replace(/:/g, '');
    return `${yyyymmdd}-${hhmmss}`;
  };

  fs.writeFile(`ILR-10085696-${version.split('.')[0]}-${formatDateTime(currentDate)}-01.xml`, xml, (err) => {
    if (err) {
      console.error(err);
      event.reply('xml-creation-failed', err.message);
    } else {
      console.log("The XML file was saved successfully.");
      event.reply('xml-created', `ILR-10085696-${version.split('.')[0]}-${formatDateTime(currentDate)}-01.xml`);
    }
  });

}
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});


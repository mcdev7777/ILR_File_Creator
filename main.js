const { app, BrowserWindow, ipcMain, globalShortcut } = require("electron");
const path = require("node:path");
const fs = require("fs");
const xmlbuilder = require("xmlbuilder");
const currentDate = new Date(Date());
const isoWithoutMsOrZ = currentDate.toISOString().split('.')[0];
const dateOnlyString = isoWithoutMsOrZ.replace(/T.*/, '');

let xmlBase = {
  
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
            //showing up as 0 of 1 marked
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
      ...(dataArray[i][35] ? [{ // Aim type (programme aim 1)
        LearnAimRef: dataArray[i][36], // Programme aim 1 Learning ref
        AimType: dataArray[i][35], // Aim type (programme aim 1)
        AimSeqNumber: '1',
        LearnStartDate: dataArray[i][37], // Start date (aim 1)
        LearnPlanEndDate: dataArray[i][38], // Planned end date (aim 1)
        FundModel: dataArray[i][39], // Funding module (aim 1)
        PHours: dataArray[i][43] || undefined, // Planned hours (aim 1)
        OTJActHours: dataArray[i][44] || undefined, // Actual hours (aim 1)
        ProgType: dataArray[i][40], // Programme type (aim 1)
        StdCode: dataArray[i][41], // Apprentice standard (aim 1)
        DelLocPostCode: dataArray[i][42], // Delivery postcode (aim 1)
        EPAOrgID: dataArray[i][46] || undefined, // EPAO ID (aim 1)
        ConRefNumber: dataArray[i][45] || undefined, // Contract Ref (aim 1)
        CompStatus: dataArray[i][61] || undefined, // Completion status (aim 1)
        LearnActEndDate: dataArray[i][62] || undefined, // Actual end date (aim 1)
        WithdrawReason: dataArray[i][65] || undefined, // Withdrawal reason (aim 1)
        Outcome: dataArray[i][64] || undefined, // Outcome (aim 1)
        AchDate: dataArray[i][63] || undefined, // Achievement date (aim 1)
        OutGrade: dataArray[i][66] || undefined, // Outcome grade (aim 1)
        SWSupAimId: crypto.randomUUID(),
        LearningDeliveryFAM: [
          ...(dataArray[i][51] ? [{ // Funding indicator (aim 1)
            LearnDelFAMType: 'FFI',
            LearnDelFAMCode: dataArray[i][51]
          }] : []),
          ...(dataArray[i][52] ? [{ // Source of funding (aim 1)
            LearnDelFAMType: 'SOF',
            LearnDelFAMCode: dataArray[i][52]
          }] : []),
          ...(dataArray[i][69] ? [{ // Contract type (aim 1)
            LearnDelFAMType: dataArray[i][47],
            LearnDelFAMCode: dataArray[i][48],
            LearnDelFAMDateFrom: dataArray[i][49] || undefined, // Date applies from (aim 1)
            LearnDelFAMDateTo: dataArray[i][50] || undefined // Date applies to (aim 1)
          }] : [])
        ],
        AppFinRecord: [
          ...(dataArray[i][53] ? [{ // Financial type 1 (aim 1)
            AFinType: dataArray[i][53],
            AFinCode: dataArray[i][54] || undefined, // Financial code 1 (aim 1)
            AFinDate: dataArray[i][55] || undefined, // Financial start date 1 (aim 1)
            AFinAmount: dataArray[i][56] || undefined // Training price (aim 1)
          }] : []),
          ...(dataArray[i][57] ? [{ // Financial type 2 (aim 1)
            AFinType: dataArray[i][57],
            AFinCode: dataArray[i][58] || undefined, // Financial code 2 (aim 1)
            AFinDate: dataArray[i][59] || undefined, // Financial start date 2 (aim 1)
            AFinAmount: dataArray[i][60] || undefined // Total assessment price (aim 1)
          }] : [])
        ]
      }] : []),
      
      // Second aim - only include if required fields are present
      ...(dataArray[i][67] ? [{
        LearnAimRef: dataArray[i][68], // Programme aim 2 Learning ref
        AimType: dataArray[i][67], // Aim type (programme aim 2)
        AimSeqNumber: '2',
        LearnStartDate: dataArray[i][69], // Start date (aim 2)
        LearnPlanEndDate: dataArray[i][70], // Planned end date (aim 2)
        FundModel: dataArray[i][71], // Funding module (aim 2)
        ProgType: dataArray[i][72], // Programme type (aim 2)
        StdCode: dataArray[i][73], // Apprentice standard (aim 2)
        DelLocPostCode: dataArray[i][74], // Delivery postcode (aim 2)
        PHours: dataArray[i][75] || undefined, // Planned hours (aim 2)
        OTJActHours: dataArray[i][76] || undefined, // Actual hours (aim 2)
        EPAOrgID: dataArray[i][78] || undefined, // EPAO ID (aim 2)
        ConRefNumber: dataArray[i][77] || undefined, // Contract Ref (aim 2)
        CompStatus: dataArray[i][93] || undefined, // Completion status (aim 2)
        LearnActEndDate: dataArray[i][94] || undefined, // Actual end date (aim 2)
        WithdrawReason: dataArray[i][97] || undefined, // Withdrawal reason (aim 2)
        Outcome: dataArray[i][96] || undefined, // Outcome (aim 2)
        AchDate: dataArray[i][95] || undefined, // Achievement date (aim 2)
        OutGrade: dataArray[i][98] || undefined, // Outcome grade (aim 2)
        SWSupAimId: crypto.randomUUID(),
        LearningDeliveryFAM: [
          ...(dataArray[i][83] ? [{ // Funding indicator (aim 2)
            LearnDelFAMType: 'FFI',
            LearnDelFAMCode: dataArray[i][83]
          }] : []),
          ...(dataArray[i][84] ? [{ // Source of funding (aim 2)
            LearnDelFAMType: 'SOF',
            LearnDelFAMCode: dataArray[i][84]
          }] : []),
          ...(dataArray[i][79] ? [{ // Contract type (aim 2)
            LearnDelFAMType: dataArray[i][79],
            LearnDelFAMCode: dataArray[i][80],
            LearnDelFAMDateFrom: dataArray[i][81] || undefined, // Date applies from (aim 2)
            LearnDelFAMDateTo: dataArray[i][82] || undefined // Date applies to (aim 2)
          }] : [])
        ],
        AppFinRecord: [
          ...(dataArray[i][85] ? [{ // Financial type 1 (aim 2)
            AFinType: dataArray[i][85],
            AFinCode: dataArray[i][86] || undefined, // Financial code 1 (aim 2)
            AFinDate: dataArray[i][87] || undefined, // Financial start date 1 (aim 2)
            AFinAmount: dataArray[i][88] || undefined // Training price (aim 2)
          }] : []),
          ...(dataArray[i][89] ? [{ // Financial type 2 (aim 2)
            AFinType: dataArray[i][89],
            AFinCode: dataArray[i][90] || undefined, // Financial code 2 (aim 2)
            AFinDate: dataArray[i][91] || undefined, // Financial start date 2 (aim 2)
            AFinAmount: dataArray[i][92] || undefined // Total assessment price (aim 2)
          }] : [])
        ]
      }] : []),

      // Third aim - only include if required fields are present
      ...(dataArray[i][99] ? [{ // Aim type (programme aim 3)
        LearnAimRef: dataArray[i][100], // Programme aim 3 Learning ref
        AimType: dataArray[i][99], // Aim type (programme aim 3)
        AimSeqNumber: '3',
        LearnStartDate: dataArray[i][101], // Start date (aim 3)
        LearnPlanEndDate: dataArray[i][102], // Planned end date (aim 3)
        FundModel: dataArray[i][103], // Funding module (aim 3)
        ProgType: dataArray[i][104], // Programme type (aim 3)
        StdCode: dataArray[i][105], // Apprentice standard (aim 3)
        DelLocPostCode: dataArray[i][106], // Delivery postcode (aim 3)
        PHours: dataArray[i][107] || undefined, // Planned hours (aim 3)
        OTJActHours: dataArray[i][108] || undefined, // Actual hours (aim 3)
        EPAOrgID: dataArray[i][109] || undefined, // EPAO ID (aim 3)
        ConRefNumber: dataArray[i][110] || undefined, // Contract Ref (aim 3)
        CompStatus: dataArray[i][125] || undefined, // Completion status (aim 3)
        LearnActEndDate: dataArray[i][126] || undefined, // Actual end date (aim 3)
        WithdrawReason: dataArray[i][128] || undefined, // Withdrawal reason (aim 3)
        Outcome: dataArray[i][129] || undefined, // Outcome (aim 3)
        AchDate: dataArray[i][127] || undefined, // Achievement date (aim 3)
        OutGrade: dataArray[i][130] || undefined, // Outcome grade (aim 3)
        SWSupAimId: crypto.randomUUID(),
        LearningDeliveryFAM: [
          ...(dataArray[i][115] ? [{ // Funding indicator (aim 3)
            LearnDelFAMType: 'FFI',
            LearnDelFAMCode: dataArray[i][115]
          }] : []),
          ...(dataArray[i][116] ? [{ // Source of funding (aim 3)
            LearnDelFAMType: 'SOF',
            LearnDelFAMCode: dataArray[i][116]
          }] : []),
          ...(dataArray[i][111] ? [{ // Contract type (aim 3)
            LearnDelFAMType: dataArray[i][111],
            LearnDelFAMCode: dataArray[i][112],
            LearnDelFAMDateFrom: dataArray[i][113] || undefined, // Date applies from (aim 3)
            LearnDelFAMDateTo: dataArray[i][114] || undefined // Date applies to (aim 3)
          }] : [])
        ],
        AppFinRecord: [
          ...(dataArray[i][117] ? [{ // Financial type 1 (aim 3)
            AFinType: dataArray[i][117],
            AFinCode: dataArray[i][118] || undefined, // Financial code 1 (aim 3)
            AFinDate: dataArray[i][119] || undefined, // Financial start date 1 (aim 3)
            AFinAmount: dataArray[i][120] || undefined // Training price (aim 3)
          }] : []),
          ...(dataArray[i][121] ? [{ // Financial type 2 (aim 3)
            AFinType: dataArray[i][121],
            AFinCode: dataArray[i][122] || undefined, // Financial code 2 (aim 3)
            AFinDate: dataArray[i][123] || undefined, // Financial start date 2 (aim 3)
            AFinAmount: dataArray[i][124] || undefined // Total assessment price (aim 3)
          }] : [])
        ]
      }] : []),

      // Fourth aim - only include if required fields are present
      ...(dataArray[i][131] ? [{ // Aim type (programme aim 4)
        LearnAimRef: dataArray[i][132], // Programme aim 4 Learning ref
        AimType: dataArray[i][131], // Aim type (programme aim 4)
        AimSeqNumber: '4',
        LearnStartDate: dataArray[i][133], // Start date (aim 4)
        LearnPlanEndDate: dataArray[i][134], // Planned end date (aim 4)
        FundModel: dataArray[i][135], // Funding module (aim 4)
        ProgType: dataArray[i][136], // Programme type (aim 4)
        StdCode: dataArray[i][137], // Apprentice standard (aim 4)
        DelLocPostCode: dataArray[i][138], // Delivery postcode (aim 4)
        PHours: dataArray[i][139] || undefined, // Planned hours (aim 4)
        OTJActHours: dataArray[i][140] || undefined, // Actual hours (aim 4)
        EPAOrgID: dataArray[i][142] || undefined, // EPAO ID (aim 4)
        ConRefNumber: dataArray[i][141] || undefined, // Contract Ref (aim 4)
        CompStatus: dataArray[i][157] || undefined, // Completion status (aim 4)
        LearnActEndDate: dataArray[i][158] || undefined, // Actual end date (aim 4)
        WithdrawReason: dataArray[i][160] || undefined, // Withdrawal reason (aim 4)
        Outcome: dataArray[i][161] || undefined, // Outcome (aim 4)
        AchDate: dataArray[i][159] || undefined, // Achievement date (aim 4)
        OutGrade: dataArray[i][162] || undefined, // Outcome grade (aim 4)
        SWSupAimId: crypto.randomUUID(),
        LearningDeliveryFAM: [
          ...(dataArray[i][147] ? [{ // Funding indicator (aim 4)
            LearnDelFAMType: 'FFI',
            LearnDelFAMCode: dataArray[i][147]
          }] : []),
          ...(dataArray[i][148] ? [{ // Source of funding (aim 4)
            LearnDelFAMType: 'SOF',
            LearnDelFAMCode: dataArray[i][164]
          }] : []),
          ...(dataArray[i][143] ? [{ // Contract type (aim 4)
            LearnDelFAMType: dataArray[i][143],
            LearnDelFAMCode: dataArray[i][144],
            LearnDelFAMDateFrom: dataArray[i][145] || undefined, // Date applies from (aim 4)
            LearnDelFAMDateTo: dataArray[i][146] || undefined // Date applies to (aim 4)
          }] : [])
        ],
        AppFinRecord: [
          ...(dataArray[i][149] ? [{ // Financial type 1 (aim 4)
            AFinType: dataArray[i][149],
            AFinCode: dataArray[i][150] || undefined, // Financial code 1 (aim 4)
            AFinDate: dataArray[i][151] || undefined, // Financial start date 1 (aim 4)
            AFinAmount: dataArray[i][152] || undefined // Training price (aim 4)
          }] : []),
          ...(dataArray[i][153] ? [{ // Financial type 2 (aim 4)
            AFinType: dataArray[i][153],
            AFinCode: dataArray[i][154] || undefined, // Financial code 2 (aim 4)
            AFinDate: dataArray[i][155] || undefined, // Financial start date 2 (aim 4)
            AFinAmount: dataArray[i][156] || undefined // Total assessment price (aim 4)
          }] : [])
        ]
      }] : []),

      // Fifth aim - only include if required fields are present
      ...(dataArray[i][163] ? [{ // Aim type (programme aim 5)
        LearnAimRef: dataArray[i][164], // Programme aim 5 Learning ref
        AimType: dataArray[i][163], // Aim type (programme aim 5)
        AimSeqNumber: '5',
        LearnStartDate: dataArray[i][165], // Start date (aim 5)
        LearnPlanEndDate: dataArray[i][166], // Planned end date (aim 5)
        FundModel: dataArray[i][167], // Funding module (aim 5)
        ProgType: dataArray[i][168], // Programme type (aim 5)
        StdCode: dataArray[i][169], // Apprentice standard (aim 5)
        DelLocPostCode: dataArray[i][170], // Delivery postcode (aim 5)
        PHours: dataArray[i][171] || undefined, // Planned hours (aim 5)
        OTJActHours: dataArray[i][172] || undefined, // Actual hours (aim 5)

//no EPAO ID for thi aim using pervious one

        EPAOrgID: dataArray[i][142] || undefined, // EPAO ID (aim 5)
        ConRefNumber: dataArray[i][173] || undefined, // Contract Ref (aim 5)
        CompStatus: dataArray[i][187] || undefined, // Completion status (aim 5)
        LearnActEndDate: dataArray[i][188] || undefined, // Actual end date (aim 5)
        WithdrawReason: dataArray[i][191] || undefined, // Withdrawal reason (aim 5)
        Outcome: dataArray[i][190] || undefined, // Outcome (aim 5)
        AchDate: dataArray[i][189] || undefined, // Achievement date (aim 5)
        OutGrade: dataArray[i][192] || undefined, // Outcome grade (aim 5)
        SWSupAimId: crypto.randomUUID(),
        LearningDeliveryFAM: [
          ...(dataArray[i][177] ? [{ // Funding indicator (aim 5)
            LearnDelFAMType: 'FFI',
            LearnDelFAMCode: dataArray[i][177]
          }] : []),
          ...(dataArray[i][178] ? [{ // Source of funding (aim 5)
            LearnDelFAMType: 'SOF',
            LearnDelFAMCode: dataArray[i][178]
          }] : []),
          //no contract type but there is code not sure if this should exist
          // ...(dataArray[i][174] ? [{ // Contract type (aim 5)
          //   LearnDelFAMType: dataArray[i][174],
          //   LearnDelFAMCode: dataArray[i][174],
          //   LearnDelFAMDateFrom: dataArray[i][199] || undefined, // Date applies from (aim 5)
          //   LearnDelFAMDateTo: dataArray[i][200] || undefined // Date applies to (aim 5)
          // }] : [])
        ],
        AppFinRecord: [
          ...(dataArray[i][179] ? [{ // Financial type 1 (aim 5)
            AFinType: dataArray[i][179],
            AFinCode: dataArray[i][180] || undefined, // Financial code 1 (aim 5)
            AFinDate: dataArray[i][181] || undefined, // Financial start date 1 (aim 5)
            AFinAmount: dataArray[i][182] || undefined // Training price (aim 5)
          }] : []),
          ...(dataArray[i][183] ? [{ // Financial type 2 (aim 5)
            AFinType: dataArray[i][183],
            AFinCode: dataArray[i][184] || undefined, // Financial code 2 (aim 5)
            AFinDate: dataArray[i][185] || undefined, // Financial start date 2 (aim 5)
            AFinAmount: dataArray[i][186] || undefined // Training price (aim 5)
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
  /*something like this 
  let str = "abcd";
let result = str.replace(/^(.)(.)(.)(.?)$/, "$1$2-$3$4");
console.log(result); // Outputs: "ab-cd"*/ 
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


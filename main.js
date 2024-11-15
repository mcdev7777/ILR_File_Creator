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
    PlanLearnHours: dataArray[i][32],// empty tag
    PostcodePrior: dataArray[i][9],
    Postcode: dataArray[i][10],
    AddLine1: dataArray[i][11],
    TelNo: dataArray[i][12],
    PriorAttain: {
      PriorLevel: dataArray[i][16], 
      DateLevelApp: dataArray[i][15]
    },
/* missing
<LLDDandHealthProblem>
      <LLDDCat>99</LLDDCat>
      <PrimaryLLDD>1</PrimaryLLDD>
    </LLDDandHealthProblem> */
    LearnerEmploymentStatus: [
    
      ...(dataArray[i][19] ? [{  
        EmpStat: dataArray[i][19],
        DateEmpStatApp: dataArray[i][18],
        EmpId: dataArray[i][20],// unsure all are empty in view 
        // add emp ID to others
        EmploymentStatusMonitoring: [
         ...(dataArray[i][24] ? [{ 
            ESMType: "LOE",
            ESMCode: dataArray[i][24]
            // change orders in other aims
          }] : []),
          ...(dataArray[i][25] ? [{  // 
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
          // no made redundant
          ...(dataArray[i][23] ? [{  
            ESMType: "OET",
            ESMCode: "1"
          }] : [])
        ]
      }] : []),
      ...(dataArray[i][28] ? [{  
        EmpStat: dataArray[i][28],
        DateEmpStatApp: dataArray[i][27],
        // are this and previous missing and id code for emplyoer
        EmploymentStatusMonitoring: [
          ...(dataArray[i][30] ? [{  // 
            ESMType: "EII",
            ESMCode: dataArray[i][30]
          }] : []),
          ...(dataArray[i][34] ? [{ 
            ESMType: "LOE",
            ESMCode: dataArray[i][34]
          }] : []),
         
// used to be a lenght of unemployment but deleted becaue there is no airtable for it
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
        PHours: dataArray[i][43],
        OTJActHours: dataArray[i][44],
        ProgType: dataArray[i][40],
        StdCode: dataArray[i][41],
        DelLocPostCode: dataArray[i][42],
        EPAOrgID: dataArray[i][46],
        ConRefNumber: dataArray[i][45],
        CompStatus: dataArray[i][61],
        LearnActEndDate: dataArray[i][62],
        WithdrawReason: dataArray[i][65],
        Outcome: dataArray[i][64],
        AchDate: dataArray[i][63],
        OutGrade: dataArray[i][66],
        SWSupAimId: crypto.randomUUID(),
        LearningDeliveryFAM: [
          ...(dataArray[i][51] ? [{
            LearnDelFAMType: 'FFI',
            LearnDelFAMCode: dataArray[i][51] // something wrong this is a date
          }] : []),
          ...(dataArray[i][52] ? [{
              
            LearnDelFAMType: 'SOF',
            LearnDelFAMCode: dataArray[i][52] // something wrong this is a date
          }] : []),
          ...(dataArray[i][69] ? [{
              
            LearnDelFAMType: dataArray[i][47],
            LearnDelFAMCode: dataArray[i][48],
            LearnDelFAMDateFrom: dataArray[i][49],
            LearnDelFAMDateTo: dataArray[i][50]
          }] : [])
        ],
        AppFinRecord: [
          ...(dataArray[i][53] ? [{
            AFinType: dataArray[i][53],
            AFinCode: dataArray[i][54],
            AFinDate: dataArray[i][55],
            AFinAmount: dataArray[i][56]
          }] : []),
          ...(dataArray[i][57] ? [{
            AFinType: dataArray[i][57],
            AFinCode: dataArray[i][58],
            AFinDate: dataArray[i][59],
            AFinAmount: dataArray[i][60]
          }] : [])
        ]
      }] : []),

      // Second aim - only include if required fields are present
      ...(dataArray[i][61] ? [{
        LearnAimRef: dataArray[i][62],
        AimType: dataArray[i][61],
        AimSeqNumber: '2',
        LearnStartDate: dataArray[i][63],
        LearnPlanEndDate: dataArray[i][64],
        FundModel: dataArray[i][65],
        PHours: dataArray[i][37],
        ProgType: dataArray[i][66],
        StdCode: dataArray[i][67],
        DelLocPostCode: dataArray[i][36],
        EPAOrgID: dataArray[i][39],
        DelLocPostCode: dataArray[i][68],
        CompStatus: dataArray[i][72],
        LearnActEndDate: dataArray[i][69],
        Outcome: dataArray[i][69],
        //not always an achdate
        AchDate: dataArray[i][69],
        // not always and out grade
        OutGrade: dataArray[i][69],
        SWSupAimId: crypto.randomUUID(),
        LearningDeliveryFAM: [
          //69 is placeholder number use row info where this comes from
          ...(dataArray[i][69] ? [{
              
            LearnDelFAMType: 'FFI',
            LearnDelFAMCode: dataArray[i][69]
          }]: []),
          ...(dataArray[i][69] ? [{
              
            LearnDelFAMType: 'SOF',
            LearnDelFAMCode: dataArray[i][69]
          }]: []),
          ...(dataArray[i][69] ? [{
              
            LearnDelFAMType: 'ACT',
            LearnDelFAMCode: dataArray[i][69]
          }]: [])
        ],
  AppFinRecord: [
        //69 is a place hodler get dates from file
        ...(dataArray[i][69] ? [{
          AFinType: "TNP",      
          AFinCode: '1',
          AFinDate: dataArray[i][69],
          AFinAmount: dataArray[i][69]

        }]: []),
        ...(dataArray[i][69] ? [{
          AFinType: "TNP",      
          AFinCode: '2',
          AFinDate: dataArray[i][69],
          AFinAmount: dataArray[i][69]
        }]: []),
        //third learning aim
        ...(dataArray[i][29] ? [{
        LearnAimRef: dataArray[i][30],
        AimType: dataArray[i][29],
        AimSeqNumber: '3',
        LearnStartDate: dataArray[i][31],
        LearnPlanEndDate: dataArray[i][32],
        FundModel: dataArray[i][33],
        PHours: dataArray[i][37],
        ProgType: dataArray[i][34],
        StdCode: dataArray[i][35],
        DelLocPostCode: dataArray[i][36],
        EPAOrgID: dataArray[i][39],
        
        CompStatus: dataArray[i][72],
        LearnActEndDate: dataArray[i][69],
        Outcome: dataArray[i][69],
        //not always an achdate
        AchDate: dataArray[i][69],
        // not always and out grade
        OutGrade: dataArray[i][69],
        SWSupAimId: crypto.randomUUID(),
        LearningDeliveryFAM: [
          //69 is placeholder number use row info where this comes from
          ...(dataArray[i][69] ? [{
              
            LearnDelFAMType: 'FFI',
            LearnDelFAMCode: dataArray[i][69]
          }]: []),
          ...(dataArray[i][69] ? [{
              
            LearnDelFAMType: 'SOF',
            LearnDelFAMCode: dataArray[i][69]
          }]: []),
          ...(dataArray[i][69] ? [{
              
            LearnDelFAMType: 'ACT',
            LearnDelFAMCode: dataArray[i][69]
          }]: [])
        ],
  AppFinRecord: [
        //69 is a place hodler get dates from file
        ...(dataArray[i][69] ? [{
          AFinType: "TNP",      
          AFinCode: '1',
          AFinDate: dataArray[i][69],
          AFinAmount: dataArray[i][69]

        }]: []),
        ...(dataArray[i][69] ? [{
          AFinType: "TNP",      
          AFinCode: '2',
          AFinDate: dataArray[i][69],
          AFinAmount: dataArray[i][69]
        }]: [])

      ]
      }] : []),
      ...(dataArray[i][29] ? [{
        LearnAimRef: dataArray[i][30],
        AimType: dataArray[i][29],
        AimSeqNumber: '1',
        LearnStartDate: dataArray[i][31],
        LearnPlanEndDate: dataArray[i][32],
        FundModel: dataArray[i][33],
        PHours: dataArray[i][37],
        ProgType: dataArray[i][34],
        StdCode: dataArray[i][35],
        DelLocPostCode: dataArray[i][36],
        EPAOrgID: dataArray[i][39],
        
        CompStatus: dataArray[i][72],
        LearnActEndDate: dataArray[i][69],
        Outcome: dataArray[i][69],
        //not always an achdate
        AchDate: dataArray[i][69],
        // not always and out grade
        OutGrade: dataArray[i][69],
        SWSupAimId: crypto.randomUUID(),
        LearningDeliveryFAM: [
          //69 is placeholder number use row info where this comes from
          ...(dataArray[i][69] ? [{
              
            LearnDelFAMType: 'FFI',
            LearnDelFAMCode: dataArray[i][69]
          }]: []),
          ...(dataArray[i][69] ? [{
              
            LearnDelFAMType: 'SOF',
            LearnDelFAMCode: dataArray[i][69]
          }]: []),
          ...(dataArray[i][69] ? [{
              
            LearnDelFAMType: 'ACT',
            LearnDelFAMCode: dataArray[i][69]
          }]: [])
        ],
  AppFinRecord: [
        //69 is a place hodler get dates from file
        ...(dataArray[i][69] ? [{
          AFinType: "TNP",      
          AFinCode: '1',
          AFinDate: dataArray[i][69],
          AFinAmount: dataArray[i][69]

        }]: []),
        ...(dataArray[i][69] ? [{
          AFinType: "TNP",      
          AFinCode: '2',
          AFinDate: dataArray[i][69],
          AFinAmount: dataArray[i][69]
        }]: [])

      ]
      }] : []),
      //4th learner delivery
      ...(dataArray[i][29] ? [{
        LearnAimRef: dataArray[i][30],
        AimType: dataArray[i][29],
        AimSeqNumber: '4',
        LearnStartDate: dataArray[i][31],
        LearnPlanEndDate: dataArray[i][32],
        FundModel: dataArray[i][33],
        PHours: dataArray[i][37],
        ProgType: dataArray[i][34],
        StdCode: dataArray[i][35],
        DelLocPostCode: dataArray[i][36],
        EPAOrgID: dataArray[i][39],
        
        CompStatus: dataArray[i][72],
        LearnActEndDate: dataArray[i][69],
        Outcome: dataArray[i][69],
        //not always an achdate
        AchDate: dataArray[i][69],
        // not always and out grade
        OutGrade: dataArray[i][69],
        SWSupAimId: crypto.randomUUID(),
        LearningDeliveryFAM: [
          //69 is placeholder number use row info where this comes from
          ...(dataArray[i][69] ? [{
              
            LearnDelFAMType: 'FFI',
            LearnDelFAMCode: dataArray[i][69]
          }]: []),
          ...(dataArray[i][69] ? [{
              
            LearnDelFAMType: 'SOF',
            LearnDelFAMCode: dataArray[i][69]
          }]: []),
          ...(dataArray[i][69] ? [{
              
            LearnDelFAMType: 'ACT',
            LearnDelFAMCode: dataArray[i][69]
          }]: [])
        ],
  AppFinRecord: [
        //69 is a place hodler get dates from file
        ...(dataArray[i][69] ? [{
          AFinType: "TNP",      
          AFinCode: '1',
          AFinDate: dataArray[i][69],
          AFinAmount: dataArray[i][69]

        }]: []),
        ...(dataArray[i][69] ? [{
          AFinType: "TNP",      
          AFinCode: '2',
          AFinDate: dataArray[i][69],
          AFinAmount: dataArray[i][69]
        }]: [])

      ]
      }] : []),
      //5th learning aim
      ...(dataArray[i][29] ? [{
        LearnAimRef: dataArray[i][30],
        AimType: dataArray[i][29],
        AimSeqNumber: '5',
        LearnStartDate: dataArray[i][31],
        LearnPlanEndDate: dataArray[i][32],
        FundModel: dataArray[i][33],
        PHours: dataArray[i][37],
        ProgType: dataArray[i][34],
        StdCode: dataArray[i][35],
        DelLocPostCode: dataArray[i][36],
        EPAOrgID: dataArray[i][39],
        
        CompStatus: dataArray[i][72],
        LearnActEndDate: dataArray[i][69],
        Outcome: dataArray[i][69],
        //not always an achdate
        AchDate: dataArray[i][69],
        // not always and out grade
        OutGrade: dataArray[i][69],
        SWSupAimId: crypto.randomUUID(),
        LearningDeliveryFAM: [
          //69 is placeholder number use row info where this comes from
          ...(dataArray[i][69] ? [{
              
            LearnDelFAMType: 'FFI',
            LearnDelFAMCode: dataArray[i][69]
          }]: []),
          ...(dataArray[i][69] ? [{
              
            LearnDelFAMType: 'SOF',
            LearnDelFAMCode: dataArray[i][69]
          }]: []),
          ...(dataArray[i][69] ? [{
              
            LearnDelFAMType: 'ACT',
            LearnDelFAMCode: dataArray[i][69]
          }]: [])
        ],
  AppFinRecord: [
        //69 is a place hodler get dates from file
        ...(dataArray[i][69] ? [{
          AFinType: "TNP",      
          AFinCode: '1',
          AFinDate: dataArray[i][69],
          AFinAmount: dataArray[i][69]

        }]: []),
        ...(dataArray[i][69] ? [{
          AFinType: "TNP",      
          AFinCode: '2',
          AFinDate: dataArray[i][69],
          AFinAmount: dataArray[i][69]
        }]: [])

      ]
      }] : []),

      ]
      }] : [])
    ],
    
    
  });
}
  const xml = xmlbuilder.create({
    Message: xmlBase
  }, {
    encoding: 'UTF-8',
    standalone: true
  })
  .att('xmlns', 'ESFA/ILR/2023-24')
  .att('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance')
  .end({ pretty: true });

  fs.writeFile("data.xml", xml, (err) => {
    if (err) {
      console.error(err);
      event.reply('xml-creation-failed', err.message);
    } else {
      console.log("The XML file was saved successfully.");
      event.reply('xml-created', 'data.xml');
    }
  });

}
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});


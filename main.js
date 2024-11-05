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
      // replace with value from field
      Year: "2324",
    
      FilePreparationDate: dateOnlyString,
    },
    Source: {
      ProtectiveMarking: "OFFICIAL-SENSITIVE-Personal",
      UKPRN: "10085696",
      SoftwareSupplier: "Education & Skills Funding Agency",
      SoftwarePackage: "ILR Learner Entry",
      // check that this is ILR software version then replace with field
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

ipcMain.on("upload-csv", (event, dataArray) => {
  console.log(dataArray);
  if (dataArray.some((learner, learnerIndex) => 
    learner.some((item, index) => {
      const exceptionIndices = [0,11,16, 17, 18, 19, 20, 21, 23, 24, 25, 26, 27, 28, 35, 36, 37, 38, 
        39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 
        60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76];
      if (item === "" && !exceptionIndices.includes(index)) {
        const missingField = dataArray[0][index] || `Field at index ${index}`;
        event.reply('show-alert', `Data missing: ${missingField} for learner ${learnerIndex}`);
        return true;
      }
      return false;
    })
  )) {
    // Optional: If you want a summary message after individual alerts
    event.reply('show-alert', 'Please fill in all required fields');
  }
else{ 
  let refNumber = 0
for (let i = 1; i < dataArray.length; i++) {
  refNumber = i.toString().padStart(4, '0');
  xmlBase.Learner.push({
    //learner refference number just aceding
    LearnRefNumber: refNumber,
    ULN: dataArray[i][1],
    FamilyName: dataArray[i][3],
    GivenNames: dataArray[i][2],
     DateOfBirth: dataArray[i][5],
     //need to encode to number
    Ethnicity: dataArray[i][7],
    Sex: dataArray[i][4],
    //need to encode to number
    LLDDHealthProb: dataArray[i][12],
    NINumber: dataArray[i][6],
    PlanLearnHours: dataArray[i][32],
    PostcodePrior: dataArray[i][8],
    Postcode: dataArray[i][9],
    AddLine1: dataArray[i][10],
    TelNo: dataArray[i][11],
    PriorAttain: {
      // need to encode to number
      PriorLevel: dataArray[i][15], 
      DateLevelApp: dataArray[i][14]
    },

    LearnerEmploymentStatus: [
      //test if we need these spread operators to return arrays or if its ai halucination shit
    
      ...(dataArray[i][18] ? [{  
        EmpStat: dataArray[i][18],
        DateEmpStatApp: dataArray[i][17],
        EmploymentStatusMonitoring: [
          ...(dataArray[i][21] ? [{  // 
            ESMType: "EII",
            ESMCode: dataArray[i][21]
          }] : []),
          ...(dataArray[i][23] ? [{ 
            ESMType: "LOE",
            ESMCode: dataArray[i][23]
          }] : []),
          // cant find value on airtable mirroring loe
          ...(dataArray[i][23] ? [{  
            ESMType: "BSE",
            ESMCode: dataArray[i][23]
          }] : []),
          ...(dataArray[i][22] ? [{  
            ESMType: "LOU",
            ESMCode: dataArray[i][22]
          }] : []),
          ...(dataArray[i][19] ? [{  
            ESMType: "SEI",
            ESMCode: "1"
          }] : []),
          //no full time education on air table
          ...(dataArray[i][19] ? [{  
            ESMType: "PEI",
            ESMCode: "1"
          }] : []),
          // no small enployer for first entry
          ...(dataArray[i][27] ? [{  
            ESMType: "SEM",
            ESMCode: "1"
          }] : []),
          // no made redundant
          ...(dataArray[i][19] ? [{  
            ESMType: "OET",
            ESMCode: "1"
          }] : []),
          //no small or medium employer
          ...(dataArray[i][19] ? [{  
            ESMType: "OET",
            ESMCode: "2"
          }] : []),
          // no employer has changed
          ...(dataArray[i][19] ? [{  
            ESMType: "OET",
            ESMCode: "3"
          }] : [])
        ]
      }] : []),
      ...(dataArray[i][24] ? [{  
        EmpStat: dataArray[i][24],
        DateEmpStatApp: dataArray[i][23],
        EmploymentStatusMonitoring: [
          ...(dataArray[i][25] ? [{  // 
            ESMType: "EII",
            ESMCode: dataArray[i][25]
          }] : []),
          ...(dataArray[i][28] ? [{ 
            ESMType: "LOE",
            ESMCode: dataArray[i][28]
          }] : []),
          // cant find value on airtable mirroring loe
          ...(dataArray[i][23] ? [{  
            ESMType: "BSE",
            ESMCode: dataArray[i][23]
          }] : []),
          //no unemployment lenght for 2nd entry
          ...(dataArray[i][22] ? [{  
            ESMType: "LOU",
            ESMCode: dataArray[i][22]
          }] : []),
          ...(dataArray[i][26] ? [{  
            ESMType: "SEI",
            ESMCode: "1"
          }] : []),
          //no full time education on air table
          ...(dataArray[i][19] ? [{  
            ESMType: "PEI",
            ESMCode: "1"
          }] : []),
          ...(dataArray[i][27] ? [{  
            ESMType: "SEM",
            ESMCode: "1"
          }] : []),
          // no made redundant
          ...(dataArray[i][19] ? [{  
            ESMType: "OET",
            ESMCode: "1"
          }] : []),
          //no small or medium employer
          ...(dataArray[i][19] ? [{  
            ESMType: "OET",
            ESMCode: "2"
          }] : []),
          // no employer has changed
          ...(dataArray[i][19] ? [{  
            ESMType: "OET",
            ESMCode: "3"
          }] : [])
        ]
      }] : [])
    ],
    LearningDelivery: [
      // First aim - only include if required fields are present
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
        CompStatus: dataArray[i][55],
        SWSupAimId: crypto.randomUUID(),
        LearningDeliveryFAM: [
          {
            LearnDelFAMType: 'SOF',
            LearnDelFAMCode: dataArray[i][45]
          },
          ...(dataArray[i][41] ? [{
            LearnDelFAMType: dataArray[i][41],
            LearnDelFAMCode: dataArray[i][42],
            LearnDelFAMDateFrom: dataArray[i][43]
          }] : [])
        ],
        AppFinRecord: [
          ...(dataArray[i][46] ? [{
            AFinType: dataArray[i][46],
            AFinCode: dataArray[i][47],
            AFinDate: dataArray[i][48],
            AFinAmount: dataArray[i][49]?.replace('£', '')
          }] : []),
          ...(dataArray[i][50] ? [{
            AFinType: dataArray[i][50],
            AFinCode: dataArray[i][51],
            AFinDate: dataArray[i][52],
            AFinAmount: dataArray[i][54]?.replace('£', '')
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
        ProgType: dataArray[i][66],
        StdCode: dataArray[i][67],
        DelLocPostCode: dataArray[i][68],
        CompStatus: dataArray[i][72],
        SWSupAimId: crypto.randomUUID(),
        LearningDeliveryFAM: [
          {
            LearnDelFAMType: 'SOF',
            LearnDelFAMCode: dataArray[i][69]
          }
        ]
      }] : [])
    ]
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

  // Create XML from testObject
}
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});


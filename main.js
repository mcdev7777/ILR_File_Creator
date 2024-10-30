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
  if (dataArray.some((learner) => 
    learner.some((item, index) => 
      // add additional exceptions see if you can say which row is missing
      item === "" && index !== 18 && index !== 38
    )
  )) {    event.reply('show-alert', 'data missing');
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
      {
        // encode to number
        EmpStat: dataArray[i][16], 
        DateEmpStatApp: dataArray[i][17],
        // some have more than two employment status monitoring
        EmploymentStatusMonitoring: {
          //looks like some have LOU sections some hca EII some both order inconsistent
          //LOE and SEM exist too
          //check precence of 18 or 20 to see if they should exist
          // mess with tool to figure out
          ESMType: 'LOU',
          ESMCode: dataArray[i][18] ? '1' : '2'
        }
      },
      {
        //where does this 10 come from
        EmpStat: '10',
        DateEmpStatApp: [i][20],
        EmploymentStatusMonitoring: {
          //where do these come from?
          ESMType: 'EII',
// probably drop down response "paid employment like"
          ESMCode: '1'
        }
      }
    ],
    LearningDelivery: [
      {
        LearnAimRef: dataArray[i][25],
        AimType: dataArray[i][24],
        AimSeqNumber: '1',
        LearnStartDate: dataArray[i][26],
        LearnPlanEndDate: dataArray[i][27],
        FundModel: dataArray[i][28],
        PHours: dataArray[i][32],
        ProgType: dataArray[i][29],
        StdCode: dataArray[i][30],
        DelLocPostCode: dataArray[i][31],
        EPAOrgID: dataArray[i][34],
        CompStatus: dataArray[i][48],
        //random number meets citeria
        SWSupAimId: "temp ID till we figure out what goes here",
        LearningDeliveryFAM: [
          {
            LearnDelFAMType: 'SOF',
            LearnDelFAMCode: dataArray[i][39]
          },
          {
            LearnDelFAMType: dataArray[i][35],
            LearnDelFAMCode: dataArray[i][36],
            LearnDelFAMDateFrom: dataArray[i][37]
          }
        ],
        AppFinRecord: [
          {
            AFinType: dataArray[i][40],
            AFinCode: dataArray[i][41],
            AFinDate: dataArray[i][42],
            AFinAmount: dataArray[i][43].replace('£', '')
          },
          {
            AFinType: dataArray[i][44],
            AFinCode: dataArray[i][45],
            AFinDate: dataArray[i][46],
            AFinAmount: dataArray[i][47].replace('£', '')
          }
        ]
      },
      {
        LearnAimRef: dataArray[i][50],
        AimType: dataArray[i][49],
        AimSeqNumber: '2',
        LearnStartDate: dataArray[i][51],
        LearnPlanEndDate: dataArray[i][52],
        FundModel: dataArray[i][53],
        ProgType: dataArray[i][54],
        StdCode: dataArray[i][55],
        DelLocPostCode: dataArray[i][56],
        CompStatus: dataArray[i][59],
        // where do these come from are they actually generated by app
        SWSupAimId: "temp ID till we figure out what goes here",
        LearningDeliveryFAM: [
          {
            LearnDelFAMType: 'SOF',
            LearnDelFAMCode: dataArray[i][58]
          }
        ]
      }
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


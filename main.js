const { app, BrowserWindow, ipcMain, globalShortcut } = require("electron");
const path = require("node:path");
const fs = require("fs");
const xmlbuilder = require("xmlbuilder");
const currentDate = new Date(Date());

const isoWithoutMsOrZ = currentDate.toISOString().split('.')[0];
let xmlBase = {
  Header: {
    CollectionDetails: {
      Collection: "ILR",
      Year: "2324",
      FilePreparationDate: "2024-09-11",
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

ipcMain.on("upload-csv", (event, dataArray) => {
  console.log("upload-csv event");
  if (dataArray.some((learner) => learner.some((item) => item === ""))) {
    event.reply('show-alert', 'data missing');
  }
else{ 
  console.log(dataArray);
for (let i = 1; i < dataArray.length; i++) {
  xmlBase.Learner.push({
    Name: dataArray[i][0],
    ULN: dataArray[i][1],
    GivenNames: dataArray[i][2],
    FamilyName: dataArray[i][3],
    Sex: dataArray[i][4],
    DateOfBirth: dataArray[i][5],
    
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


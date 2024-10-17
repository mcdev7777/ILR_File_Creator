const { app, BrowserWindow, ipcMain, globalShortcut } = require("electron");
const path = require("node:path");
const fs = require("fs");
const xmlbuilder = require("xmlbuilder");
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
      DateTime: "2024-09-11T05:09:12",
    },
  },
  LearningProvider: {
    UKPRN: "10085696",
  },
  Learner: [],
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

  const xml = xmlbuilder.create(xmlBase).end({ pretty: true });

  fs.writeFile("data.xml", xml, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("The XML file was saved successfully.");
    }
  });
}
  // Create XML from testObject
 
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

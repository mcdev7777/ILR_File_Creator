const fs = require("fs");
const os = require("os");
const path = require("node:path");
const xmlbuilder = require("xmlbuilder");
const xmllint = require("xmllint");
const { pushLearners } = require("./src/utils/pushLearners");
const { Worker } = require("worker_threads");
const {
  app,
  BrowserWindow,
  ipcMain,
  globalShortcut,
  dialog,
  shell
} = require("electron");

// ====== FILE SYSTEM ======
const tempDir = path.join(os.tmpdir(), `electron-ilr_file_creator-xmls`);
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true })
let XMLfilePath = "";

// ====== DATES & VERSIONS ======
const currentDate = new Date(Date());
const isoWithoutMsOrZ = currentDate
  .toISOString()
  .split(".")[0];
const dateOnlyString = isoWithoutMsOrZ
  .replace(/T.*/, "");
const formatDateTime = (date) => {
  const yyyymmdd = date
    .toISOString()
    .split("T")[0]
    .replace(/-/g, "");
  const hhmmss = date
    .toTimeString()
    .split(" ")[0]
    .replace(/:/g, "");
  return `${yyyymmdd}-${hhmmss}`;
};

function convertAcademicYear(yearString) {
  if (!/^\d{4}$/.test(yearString)) throw new Error("Invalid input. Please provide a 4-digit year string.");
  const firstTwoDigits = yearString.slice(0, 2);
  const lastTwoDigits = yearString.slice(2);
  return `20${firstTwoDigits}-${lastTwoDigits}`;
}

// ====== XML SCHEMA ======
let versionForExport = "";
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
  Learner: [],
};

// ====== START UP ======
ipcMain.on("log-message", (event, message) => { console.log("Renderer:", message) });

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, "renderer.js"),
      nodeIntegration: true,
      contextIsolation: false,
      // TODO: these are bad practice and I should change if time can set isolation to true and set a file allowing only the apis I know I want to use
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

// ====== EVENTS ======
ipcMain.on("upload-csv", (event, dataArray, version) => {
  try {
    versionForExport = version;
    xmlBase.Header.Source.Release = version;
    xmlBase.Header.CollectionDetails.Year = version.split(".")[0];

    // Test for Empty Values
    const CheckBoxPattern = /0 checked out/;
    for (let I = 1; I < dataArray.length; I++) {
      for (let i = 0; i < dataArray[I].length; i++) {
        if (CheckBoxPattern.test(dataArray[I][i])) { dataArray[I][i] = "" }
      }
    }
    
    // ====== MAIN EVENT RIGHT HERE FOLKS ======
    pushLearners(dataArray, xmlBase);

    // ====== EXPORT ======
    let xml = xmlbuilder
      .create({ Message: xmlBase }, { encoding: "utf-8" })
      .att("xmlns", `ESFA/ILR/${convertAcademicYear(version.split(".")[0])}`)
      .att("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance")
      .end({ pretty: true });
    
    XMLfilePath = path.join(
      tempDir,
      `ILR-10085696-${version.split(".")[0]}-${formatDateTime(currentDate)}-01.xml`,
    );
    
    fs.writeFile(XMLfilePath, xml, (err) => {
      if (err) {
        event.reply("xml-creation-failed", err.message);
      } else {
        event.reply(
          "xml-created",
          `ILR-10085696-${version.split(".")[0]}-${formatDateTime(currentDate)}-01.xml`,
        );
      }
    });
    
    let xsd = fs.readFileSync(path.join(__dirname, "schemafile.xsd"), "utf-8");

    // ====== WALDO THE WOBBLY WORKER ======
    /* TODO: Replace the leaky library
      This worker is required because the library used is old and busted and causes a memory leak.
      The worker can validate the xml before the memory leak causes it to crash but if we
      used the library in the main process the crash would shut down the app
      We can check if there is a better library for validating xmls against schemas created in the future
      but at the time of creation there was not (seems to work better outside the developer environment anyway)
      */
    const worker = new Worker(path.join(__dirname, "xmlValidator.js"), {
      workerData: { xml, xsd },
    });

    worker.on("message", (result) => {
      // this currently never happens because the way the DFE formated their XMLs always generates two warnings but if they
      // fix that in future versions its worth thinking about.
      if (result.valid) {
        // event.reply('xml-validation-success', result);
      } else {
        event.reply("xml-validation-errors", result);
      }
    });

    worker.on("error", (error) => {
      console.error("Worker error:", error);
      event.reply("xml-validation-errors", [error.message]);
    });

    worker.on("exit", (code) => {
      if (code !== 0) console.error(`Worker stopped with exit code ${code}`)
    });
  } catch (error) {
    console.error("An error occurred during XML validation:", error);
  }
});

ipcMain.on("openSave", (event) => {
  async function saveDialogue() {
    try {
      const result = await dialog.showSaveDialog({
        title: "Export XML File",
        defaultPath: path.join(
          app.getPath("documents"),
          `ILR-10085696-${versionForExport.split(".")[0]}-${formatDateTime(currentDate)}-01.xml`,
        ),
        filters: [{ name: "XML Files", extensions: ["xml"] }],
      });
      console.log(
        "result.cancled",
        result.canceled,
        " result filepath ",
        result.filePath,
      );
      if (!result.canceled && result.filePath) {
        console.log("copy file from ", XMLfilePath, " to ", result.filePath);
        await fs.promises.copyFile(XMLfilePath, result.filePath);
      } else {
        console.log("result canceled or has no file path");
      }
    } catch (error) {
      console.error("Error exporting temporary XML:", error);
      throw error;
    }
  }
  saveDialogue();
});

app.on("window-all-closed", () => { app.quit() });

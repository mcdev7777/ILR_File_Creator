const { ipcRenderer, ipcMain } = require("electron");
const Papa = require("papaparse");

function logToMain(message) {
  ipcRenderer.send("log-message", message);
}

/* Current Schema Version
  Change this when the government updates its schema.
  It should then update the UI
  */
const schemaVersion = "2526.1.38.0";

// Create save button (can be created before DOM is ready)
const saveButton = document.createElement("button");
saveButton.textContent = "Save XML File";
saveButton.onclick = async () => {
  ipcRenderer.send("openSave");
};

// Wait for DOM to be ready before accessing elements
document.addEventListener("DOMContentLoaded", () => {
  // Set default version
  const versionElement = document.getElementById("version-number");
  const releaseVersionInput = document.getElementById("releaseVersion");

  if (versionElement && releaseVersionInput) {
    versionElement.value = schemaVersion.trim();
    releaseVersionInput.value = schemaVersion.trim();
  }

  // Set up form submission handler
  const form = document.getElementById("uploadForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      let version = document.getElementById("releaseVersion").value;
      let file = document.getElementById("csvFile").files[0];

      if (!file) {
        alert("Please select a CSV file");
        return;
      }

      Papa.parse(file, {
        complete: (results) => {
          const dataArray = results.data;
          ipcRenderer.send("upload-csv", dataArray, version);
        },
        error: (error) => {
          console.error("Parse error:", error);
          alert("Error parsing CSV file");
        }
      });

      logToMain("submit completed");
    });
  }
});

ipcRenderer.on("show-alert", (event, message) => {
  alert(message);
});

ipcRenderer.on("xml-created", (event, filename) => {
  const outputDiv = document.getElementById("output");
  const downloadLink = document.createElement("a");

  outputDiv.appendChild(saveButton);

  logToMain("xml creation completed");
});

ipcRenderer.on("xml-creation-failed", (event, errorMessage) => {
  const outputDiv = document.getElementById("output");
  outputDiv.textContent = `Error creating XML: ${errorMessage}`;
});

ipcRenderer.on("xml-validation-errors", (event, results) => {
  const div = document.getElementById("error-log-list");

  div.innerHTML = "";

  const list = document.createElement("ul");
  div.appendChild(list);

  // TODO: this is janky af
  let listCount = 0;
  let skipNext = false;

  results.errors.forEach((error) => {
    if (error.trim() != "^") {
      switch (skipNext) {
        case true:
          skipNext = false;
          listCount = 0;
          break;
        case false:
          listCount++;
          if (error.includes("is not absolute")) {
            skipNext = true;
          } else {
            const item = document.createElement("li");
            item.textContent = `${error.type}: ${error}`;
            if (listCount % 2 === 0) {
              item.style.fontStyle = "italic";
              item.style.listStyle = "none";
            }
            list.appendChild(item);
          }
          break;
      }
    }
  });

  logToMain("xml validation completed");
});

const { ipcRenderer } = require('electron');
const Papa = require('papaparse'); 



 const form = document.getElementById('uploadForm');
 const output = document.getElementById('output');

ipcRenderer.on('show-alert', (event, message) => {
  alert(message);
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    let file = document.getElementById('csvFile').files[0];
    Papa.parse(file, {
        complete: (results) => {
            const dataArray = results.data;
             ipcRenderer.send('upload-csv', dataArray);
        }
      });
   
    
});

ipcRenderer.on('xml-created', (event, filename) => {
  const outputDiv = document.getElementById('output');
  const downloadLink = document.createElement('a');
  downloadLink.href = `${filename}`;
  downloadLink.download = filename;
  downloadLink.textContent = 'Download XML File';
  outputDiv.appendChild(downloadLink);
});

ipcRenderer.on('xml-creation-failed', (event, errorMessage) => {
  const outputDiv = document.getElementById('output');
  outputDiv.textContent = `Error creating XML: ${errorMessage}`;
});

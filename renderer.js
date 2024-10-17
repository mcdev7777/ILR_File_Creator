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

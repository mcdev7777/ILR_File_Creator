const { app, BrowserWindow, ipcMain } = require('electron');
function createWindow() {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        // preload: path.join(__dirname, 'renderer.js'),
        nodeIntegration: true, // Allows Node.js modules in the renderer process
        contextIsolation: false,
      },
    });
  
    win.loadFile('index.html');
  }

// let form = document.getElementById('uploadForm');



// form.addEventListener('submit', (e) => {
//     e.preventDefault();

//     let file = document.getElementById('csvFile').files[0];
//     console.log(file);
    
// });

app.whenReady().then(createWindow);

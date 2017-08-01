import {app, BrowserWindow} from 'electron';
import * as path from 'path';
import * as url from 'url';
import * as electronConnect from 'electron-connect';

app.on('ready', () => {

    var mainWindow = new BrowserWindow({
        width: 400,
        height: 300
    });
        
    mainWindow.loadURL(path.join(__dirname, '/../../../', 'index-desktop.html'));
    mainWindow.webContents.openDevTools();

    // Connect to server process 
    electronConnect.client.create(mainWindow);
});

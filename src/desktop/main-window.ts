import {app, BrowserWindow, screen} from 'electron';
import * as path from 'path';
import * as url from 'url';
import * as electronConnect from 'electron-connect';
import { WindowManager } from './window-manager';

app.on('ready', () => {

    var mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        center: true
    });
    
    mainWindow.loadURL(path.join(__dirname, '/../../../', 'index-desktop.html'));
    
    var windowManager = new WindowManager(mainWindow);
    windowManager.undockMaximized();
    
    electronConnect.client.create(mainWindow);
});


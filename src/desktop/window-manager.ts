import {app, screen} from 'electron';

export class WindowManager{

    private window: Electron.BrowserWindow;
    private mainScreen: Electron.Display;

    constructor(window: Electron.BrowserWindow) {
        
        this.window = window;
        this.mainScreen = screen.getPrimaryDisplay();
    }

    public dockLeft(size: number){

        this.window.setBounds({
            x: 0, 
            y: 0, 
            height: this.mainScreen.workArea.height, 
            width: size});

        this.window.setAlwaysOnTop(true);
        this.window.setMenu(null);
    }

    public dockTop(size: number){

        this.window.setBounds({
            x: 0, 
            y: 0, 
            height: size, 
            width: this.mainScreen.workArea.width});

        this.window.setAlwaysOnTop(true);
        this.window.setMenu(null);
    }

    public dockRight(size: number){

        this.window.setBounds({
            x: this.mainScreen.workArea.width - size,
            y: 0, 
            height: this.mainScreen.workArea.height, 
            width: size});

        this.window.setAlwaysOnTop(true);
        this.window.setMenu(null);        
    }

    public dockBottom(size: number){

        this.window.setBounds({
            x: 0, 
            y: this.mainScreen.workArea.height - size, 
            height: size, 
            width: this.mainScreen.workArea.width});

        this.window.setAlwaysOnTop(true);
        this.window.setMenu(null);
        
    }

    public undockCentered(width: number, height: number){
        
        this.window.center();
        this.window.setSize(width, height);

        this.window.setAlwaysOnTop(false);
        this.window.setMenu(null);
    }

    public undockMaximized(){

        this.window.setAlwaysOnTop(false);
        this.window.setMenu(null);
        this.window.maximize();
    }

}

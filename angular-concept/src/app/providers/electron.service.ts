import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame, remote, session, autoUpdater } from 'electron';
import * as childProcess from 'child_process';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import * as fs from 'fs';
// const sqrl = require('electron-squirrel-startup')

@Injectable()
export class ElectronService {

  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  fs: typeof fs;
  session: typeof session;
  data: any;
  path: any;
  webContents: any;
  count: Number = 0;
  // updater: any;
  updater: typeof autoUpdater;

  constructor(private ngxService: NgxUiLoaderService) {
    // Conditional imports
    if (this.isElectron()) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.remote = window.require('electron').remote;
      this.session = window.require('electron').session;
      // this.webContents = window.require('electron').webContents;
      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');
      const log = require("electron-log")
      this.updater = this.remote.require('electron-updater').autoUpdater;
    }
  }
  
  isElectron = () => {
    return window && window.process && window.process.type;
  }

}

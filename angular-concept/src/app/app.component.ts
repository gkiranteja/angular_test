import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ElectronService } from './providers/electron.service';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from './app.config';
import { Router, NavigationEnd } from '@angular/router';
import { LOGOUT, VERSION_CHECK, BUILD_ENVIRONMENT_VERSION } from './urls.config';
import { RequestService } from './providers/request.service';
import { CartService } from './providers/cart.service';
import { SessionTokenService } from './providers/session-token.service';
import { OfflineStoreService } from './providers/OfflineStore.service';
import { offlineMode } from './providers/offlineMode.service';
import { offline } from './providers/offline.service';
import { LoginService } from '../app/providers/login.service';
import { ADDTOCART } from '../app/urls.config';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { filter } from 'rxjs/operators';
import { DbService } from './providers/db.service';
import { PopupServiceService } from './providers/popup-service.service';
import { Subscription } from 'rxjs';
let currentDirectoryLogs;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  token: any;
  login: boolean;
  sideMenue: boolean;
  cartCount: number = -2;
  foregroundcolor: string = "#ff6c00";
  backgroundcolor: string = "#ff6c00";
  currentScreen: string;
  online: boolean;
  network: boolean;

  message: String;
  subscription: Subscription;
  showModal: boolean = false;
  count: number = 0;

  checkingUpdate: boolean = true;
  updateAvailable: boolean = false;
  startDownloading: boolean = false;
  downloaded: boolean = false;
  loaderMessage: string = '';
  storeUploaded: boolean = false;

  constructor(public changeDetectorRef: ChangeDetectorRef, private offline: offline, public modalService: PopupServiceService, private dbService: DbService, public cartService: CartService, private redirect: Router, private requestService: RequestService, public electronService: ElectronService,
    private ngxService: NgxUiLoaderService, private translate: TranslateService, private router: Router, public sessionAndToken: SessionTokenService, public offlineStoreService: OfflineStoreService, public offMode: offlineMode) {
    this.router.navigate(['']);
    this.offMode.events();
    /* START LOGS*/
    let userFileName = this.electronService.remote.app.getPath('userData');
    
    currentDirectoryLogs = userFileName + '/electronLogsData';
    let error = "Trsers logs";
    if (!this.electronService.fs.existsSync(currentDirectoryLogs)) {
      this.electronService.fs.mkdirSync(currentDirectoryLogs);
      let fs = window.require('fs');
      fs.writeFile(currentDirectoryLogs + '/electronLogsData.txt', error + '\r\n', 'utf8', () => { 
        //console.log('created update logs application data');
      });
    } else { 
      let error = "Trasers logs file created";
      this.updateLogsData(error);
    }
    /* END LOGS*/
    

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(value => {
      let routeName = (value as any).url ? (value as any).url.toString() : router.url;
      this.currentScreen = routeName;
      this.offlineStoreService.Breadcrumb.push(routeName);
      if (routeName === '/login' || routeName === '/' || routeName === '/forgotpswd' || routeName === '/signup-form') {
        this.sideMenue = false;
      }
      else {
        this.sideMenue = true;
        if (routeName === '/home') {
          this.getCartData();
        }
        if (navigator.onLine) {
          this.network = true;
        }
        else {
          this.network = false;
        }
      }
      if (document.getElementById('mySidenav') && document.getElementById("main")) {
        let width = parseInt(document.getElementById('mySidenav').style.width);
        if (width > 0) {
          document.getElementById("main").style.width = "calc(100% - 250px)";
          document.getElementById("main").style.marginLeft = "250px";
        }
        else {
          document.getElementById("main").style.width = "";
          document.getElementById("main").style.marginLeft = "";
        }
      }
    });

    translate.setDefaultLang('en');
    console.log('AppConfig', AppConfig);
    this.updateLogsData('setDefaultLang: en');

    if (electronService.isElectron()) {
      console.log('Mode electron');
      console.log('Electron ipcRenderer', electronService.ipcRenderer);
      console.log('NodeJS childProcess', electronService.childProcess);
      this.updateLogsData('Mode electron service');
    } else {
      console.log('Mode web');
      this.updateLogsData('Mode web service');
    }
    this.offMode.isOnline();

    this.count = this.count + 1;

    if(BUILD_ENVIRONMENT_VERSION.IN_STOREUPLOAD == 'windows') {
      const updater = this.electronService.updater;
      if (this.checkingUpdate)
        this.electronService.updater.checkForUpdates();
      // const notify = ;
      updater.on('checking-for-update', () => {
      console.log('Checking for update...');
      this.updateLogsData('checking-for-update:');
      })
      updater.on('update-available', (info, e) => {
        this.updateLogsData('update-available:'+ JSON.stringify(info) + '\r\n' + 'update-available:'+ JSON.stringify(e));
        if (!this.downloaded || this.checkingUpdate) {
          this.updateLogsData('updated version is not downloaded or update available:' + this.count +'\r\n'+ 'An updated version of the Trasers app is available. Click Ok to start the download.');
          console.log("Available: " + this.count);
          // window.alert("An updated version of the Trasers app is available. Click Ok to start the download.")
          window.alert("An updated version of the Trasers app (v"+ BUILD_ENVIRONMENT_VERSION.VERSION +") is available. Click Ok to start the download.")
          this.loaderMessage = 'Downlaod started';
          this.ngxService.start();
        }
      })
      updater.on('update-not-available', (info, e) => {
        console.log('Update not available.');
        this.updateLogsData('update-not-available:' + JSON.stringify(info) +'\r\n'+ 'update-not-available:' + JSON.stringify(e));
      })
      updater.on('error', (err) => {
        this.updateLogsData('Error in auto-updater. ' + JSON.stringify(err));
        console.log('Error in auto-updater. ' + err);
      })
      updater.on('update-downloaded', (info) => {
        this.updateLogsData('update-downloaded started');
        this.loaderMessage = 'Downlaod completed'
        this.downloaded = true;
        this.checkingUpdate = false;
        console.log("Download Done: " + this.count);
        window.alert("An updated version of the Trasers app has been downloaded. Click Ok to restart your app.");
        updater.quitAndInstall();
        this.updateLogsData('update-downloaded ' + JSON.stringify(info) + '\r\n'+  "Download Done: " + this.count +'\r\n'+ "An updated version of the Trasers app has been downloaded. Click Ok to restart your app." +'\r\n'+ "quitAndInstall" );
      })
      // updater.on('download-progress', (progressObj) => {
      //   setTimeout(() => {
      //     this.loaderMessage = 'Downlaoding ' + progressObj.percent + '%';
      //   }, 10);
      //   // this.loaderMessage = 'Downlaoding ' + progressObj.percent + '%';
      //   // this.changeDetectorRef.detectChanges();
      // })
    }

  }

  updateLogsData(dataLog){
    let fs = window.require('fs');
    fs.readFile(currentDirectoryLogs + '/electronLogsData.txt', 'utf8', function(err, data) {
        var dataList = data +'\r\n'+ dataLog;
        fs.writeFile(currentDirectoryLogs + '/electronLogsData.txt', dataList, 'utf8', () => { 
          //console.log('created updated logs application data');
        });
    });
  }

  versionCheck() {
    this.requestService.get(VERSION_CHECK, {}).subscribe((data) => {
      this.updateLogsData("versionCheck:" + VERSION_CHECK +'\r\n'+ 'version data:' + JSON.stringify(data) );
      // this.execute('bitsadmin /TRANSFER trasers /PRIORITY high http://localhost/Trasers.exe C:\Users\rahul\Downloads\Trasers.exe', (output) => {
      //   alert(output);
      // });

      if (data['version'] != "1.0.0") {
        this.updateLogsData("You are running a depreciated version of this software. Please download the new version from " + data['download_url']);
        this.sendMessage("You are running a depreciated version of this software. Please download the new version from " + data['download_url']);
      }
    })
  }

  sendMessage(txt): void {
    // send message to subscribers via observable subject 
    this.modalService.sendMessage(txt);
  }

  networkStatus() {
    this.updateLogsData('network status:' + navigator.onLine);
    this.storeUploaded = (BUILD_ENVIRONMENT_VERSION.IN_STOREUPLOAD == 'windows') ? true : false;
    return !navigator.onLine;
  }

  ngOnInit() {
    console.log('app component');
    let userFileName = this.electronService.remote.app.getPath('userData');
    let dir = userFileName + '/Trasers';
    if (!this.electronService.fs.existsSync(dir)) {
      this.electronService.fs.mkdirSync(dir);
    }
    this.offlineStoreService.store('trasersPath', dir);
    this.login = Boolean(localStorage.getItem('login'));

    this.subscription = this.modalService.getMessage().subscribe(message => {
      if (!message || message['text'] == '') {
        this.showModal = false;
        return false;
      }
      this.message = message['text'];
      this.showModal = true;
      console.log("showmodal flag" + this.showModal);
    });
    this.subscription = this.cartService.getMessage().subscribe(message => {
      this.cartCount = message['count'];
    });
    //Auto update for download reports data based on expiryDate.
    // this.offline.getUserReportsFolderNames();
  }

  closeAlertModal() {
    if (document.getElementById('alert_modal')) {
      document.getElementById('alert_modal').style.display = "none";
    }
    this.showModal = false;
  }



  getCartData() {
    let token = this.sessionAndToken.getTokenAndSession();
    console.log(token);
    let path = this.offlineStoreService.fetch('trasersPath');
    let dir = path + '/' + token['uid'];
    this.offlineStoreService.store('user_uid', token['uid']);
    this.offlineStoreService.store('usersFolder', path + '/' + token['uid']);
    if (!this.electronService.fs.existsSync(dir)) {
      this.electronService.fs.mkdirSync(dir);
    }
    let options = {
      'headers': {
        'Content-type': 'application/json',
        'Cookie': token['sess_name'] + '=' + token['sessid'],
        'X-Csrf-Token': token['token'],
      },
      withCredentials: true,
      'basi-headers': {
        'user': 'webadmin',
        'pwd': 'tr1@nzadm1npa55',
      }
    }
    const items = this.requestService.get(ADDTOCART + '/' + token['uid'], options);
    items.subscribe((data) => {
      this.cartCount = data['cart_count'];
      this.ngxService.stop();
    });
  }

}

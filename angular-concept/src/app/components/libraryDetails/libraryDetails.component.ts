import { Component, OnInit } from '@angular/core';
import { CartService } from './../../providers/cart.service';
import { ElectronService } from './../../providers/electron.service';
import { LIBRARY_DETAILS_JSON, LIBRARY_DETAILS, RATE } from './../../urls.config';
import { RequestService } from './../../providers/request.service';
import { ActivatedRoute } from '@angular/router';
import { SessionTokenService } from '../../providers/session-token.service';
import { OfflineStoreService } from '../../providers/OfflineStore.service';
import { Router } from '@angular/router';
import { SidemenuComponent } from './../sidemenu/sidemenu.component';
import { setTimeout } from 'core-js/library/web/timers';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MenuServiceService } from './../../providers/menu-service.service';
let $ = (window as any).$;
import { ReportService } from './../../providers/report.service';
import { Subscription } from 'rxjs';
import { offlineMode } from './../../providers/offlineMode.service';
import { PopupServiceService } from './../../providers/popup-service.service';
let shell = window.require('electron').shell;
// const autoUpdater = require("electron-updater").autoUpdater;

@Component({
  selector: 'app-libraryDetails',
  templateUrl: './libraryDetails.component.html',
  styleUrls: ['./libraryDetails.component.scss'],
  providers: [RequestService, ElectronService]
})
export class LibraryDetailsComponent implements OnInit {

  private reports: any[];
  id: number;
  data: object;
  token: any;
  sideMenus: SidemenuComponent;
  cartCount: number = 0;
  subscription: Subscription;
  libraryDetails: any;
  includedReports: any;
  libraryDetailsError: boolean = false;
  includedReportsError: boolean = false;
  relatedLibraries: any;
  relatedLibrariesError: boolean =false;

  constructor(public modalService: PopupServiceService, private menuService: MenuServiceService, public cartService: CartService, private electronService: ElectronService, private redirect: Router, private requestService: RequestService, private route: ActivatedRoute,
    public sessionAndToken: SessionTokenService, private router: Router, private ngxService: NgxUiLoaderService, private offlineStoreService: OfflineStoreService, private reportService: ReportService, public offMode: offlineMode) {
    this.cartService.showCart = true;
    this.offMode.isOnline();
  }

  open(link) {
    shell.openExternal(link);
  }

  ngOnInit() {
    // this.ngxService.start();
    this.token = this.sessionAndToken.getTokenAndSession();
    this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.getLibraryDetail(this.id);
      let online = navigator.onLine;
      if (online) {
        this.token = this.sessionAndToken.getTokenAndSession();
        // this.cartService.getCartItems();
      }
    });
    // While comming from full-view-screen in offline to online, site is navigating to home with out scroll
    // document.getElementsByTagName('body')[0].style.overflow = 'auto';
  }

  getLibraryDetail(libId) {
    // alert("libary Id:"+ this.id);
    this.ngxService.start();
      let options = {
        'headers': {
          'Content-type': 'application/json',
          'Cookie': this.token['sess_name'] + '=' + this.token['sessid'],
          'X-Csrf-Token': this.token['token'],
        }
      }

      let reports = this.requestService.get(LIBRARY_DETAILS + libId, options);
      let sub = reports.subscribe((data) => {
          console.log("getLibraryDetail:::", data);
          this.data = data;
          this.libraryDetails = data;
          this.getIncludedReports();
          this.getRelatedLibraries();
          this.ngxService.stop();
      },
      (err) => {
          this.ngxService.stop();
          console.log("GetReportDetails:::", err);
          this.libraryDetailsError = true;
          // this.menuService.sendMessage('Something went wrong, please try again');
      });
      // this.data = LIBRARY_DETAILS_JSON;
      // this.libraryDetails = LIBRARY_DETAILS_JSON;
      console.log("getLibraryDetail:::", this.data);
      setTimeout(() => { sub.unsubscribe(); this.ngxService.stop(); }, this.requestService.timeout);
  }

  getIncludedReports(){
    let inCludedReports = this.libraryDetails["included_reports"], parentData = [], childData = [], j = 0, k = 0;
    if (inCludedReports != '' && inCludedReports != undefined && inCludedReports != null) {
      for (let i = 0; i < inCludedReports.length; i++) {
        j++; childData[k] = inCludedReports[i]; k++;
        if (childData.length === 4 || i === (inCludedReports.length - 1)) {
          parentData.push(childData);
          childData = [], k = 0;
        }
      }
      this.includedReports = parentData;
    }else{
      this.includedReportsError = true;
    }
    const $ = (window as any).$;
    setTimeout(function () { $('#myCarousel2').carousel({ interval: 3000, cycle: true }); }, 1000);

  }

  getRelatedLibraries() {
    let relatedLibraries = this.libraryDetails["related_library"], parentData = [], childData = [], j = 0, k = 0;
    if (relatedLibraries != '' && relatedLibraries != undefined && relatedLibraries != null) {
      for (let i = 0; i < relatedLibraries.length; i++) {
        j++; childData[k] = relatedLibraries[i]; k++;
        if (childData.length === 4 || i === (relatedLibraries.length - 1)) {
          parentData.push(childData);
          childData = [], k = 0;
        }
      }
      this.relatedLibraries = parentData;
    }else{
      this.relatedLibraries = true;
    }
    const $ = (window as any).$;
    setTimeout(function () { $('#myCarousel1').carousel({ interval: 3000, cycle: true }); }, 1000);
  }

  rateReport(n) {
    if (this.data['isDownloadable'] == 'False') {
      //alert('Please purchase the report first.')
      // this.sendMessage('Please purchase the report first.');
    } else {
      this.data['user_rating'] = n;
      this.ngxService.start();
      let options = {
        headers: {
          'Content-type': 'application/json',
          'Cookie': this.token['sess_name'] + '=' + this.token['sessid'],
          'X-Csrf-Token': this.token['token'],
        },
        'basi-headers': {
          'user': 'webadmin',
          'pwd': 'tr1@nzadm1npa55',
        }
      }
      let data = { id: this.id, rating: n };
      const rating = this.requestService.post(RATE, data, options);
      let sub = rating.subscribe((data) => {
        this.ngxService.stop();
        if (data && data['result'] && data['result'] === 'success') {
          this.data['avg_rating'] = data['avg_rating']
          // this.data['user_rating'] = data['user_rating']
          // this.changeDetectorRef.detectChanges();
        }
      });
      setTimeout(() => { sub.unsubscribe(); this.ngxService.stop(); }, this.requestService.timeout);
    }
  }

  gotoLibraryDetails(libId) {
    this.getLibraryDetail(libId);
  }

  clearMessage(): void {
    // clear message
    this.menuService.clearMessage();
  }

}

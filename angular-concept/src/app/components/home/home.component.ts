import { Component, OnInit } from '@angular/core';
import { CartService } from './../../providers/cart.service';
import { ElectronService } from './../../providers/electron.service';
import { HOMESCREEN, ADDTOCART, HOMESCREEN_REPORTS, LIBRARY_DETAILS, REPORT_DETAILS } from './../../urls.config';
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
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [RequestService, ElectronService]
})
export class HomeComponent implements OnInit {

  private reports: any[];
  data: object;
  popular: any;
  latest: any;
  recent: any;
  showData: any;
  showDataActive: string;
  sideMenus: SidemenuComponent;
  showNewsData: any;
  showBlogData: any;
  token: any;
  cartCount: number = 0;
  category: string = 'popular';
  role_id: string = "";
  industry_id: string = "";
  flag: boolean = false;
  subscription: Subscription;
  oldIndustryId: any = 0;
  oldIndustryIds: object = {
    roleId: 0,
    industryId: 0
  };
  showArticlesData: any;
  showMyLibrariesData:any;
  showRecommendedLibraryData: any;
  showLibrariesRelatedReportsData: any;
  displayNameForLibraries: string;

  constructor(public modalService: PopupServiceService, private menuService: MenuServiceService, public cartService: CartService, private electronService: ElectronService, private redirect: Router, private requestService: RequestService, private route: ActivatedRoute,
    public sessionAndToken: SessionTokenService, private router: Router, private ngxService: NgxUiLoaderService, private offlineStoreService: OfflineStoreService, private reportService: ReportService, public offMode: offlineMode) {
    this.cartService.showCart = true;
    this.showDataActive = 'popular'; //popular / library
    this.offMode.isOnline();
  }

  open(link) {
    shell.openExternal(link);
  }

  ngOnInit() {
    // this.ngxService.start();
    this.token = this.sessionAndToken.getTokenAndSession();
    this.cartService.getCartItems();
    this.subscription = this.reportService.getBussines().subscribe(business => {
      this.role_id = business.text;
      this.subscription = this.reportService.getIndustry().subscribe(industry => {
        this.industry_id = industry.text;
        this.oldIndustryIds['roleId'] = this.role_id;
        this.oldIndustryIds['industryId'] = industry.text;
        if (this.industry_id != this.oldIndustryId && this.oldIndustryId != undefined) {
          this.oldIndustryId = this.industry_id;
          this.flag = true;
          this.getReports();
        }
      },
        error => {
          this.callDefaultReports();
        });
    },
      error => {
        this.callDefaultReports();
      });

    if (!this.flag) {
      let ids = this.reportService.sendData();
      this.industry_id = ids.industryId;
      this.role_id = ids.bussinessId;
      if (ids.industryId != undefined && ids.bussinessId != undefined) {
        this.oldIndustryIds['roleId'] = this.role_id;
        this.oldIndustryIds['industryId'] = this.industry_id;
        this.getReports();
      }
    }

    this.sendMessage();
    // While comming from full-view-screen in offline to online, site is navigating to home with out scroll
    document.getElementsByTagName('body')[0].style.overflow = 'auto';

  }

  callDefaultReports() {
    let ids = this.reportService.sendData();
    this.industry_id = ids.industryId;
    this.role_id = ids.bussinessId;
    this.getReports();
  }

  sendMessage(): void {
    // send message to subscribers via observable subject 
    this.menuService.sendMessage('home');
  }

  clearMessage(): void {
    // clear message
    this.menuService.clearMessage();
  }

  getReports() {
    if (this.oldIndustryIds['.roleId'] !== this.role_id && this.oldIndustryIds['industryId'] != this.industry_id) {
      console.log("BREAK API");
      return false;
    } else {
      this.ngxService.start();
      console.log("CALL API API");
      let options = {
        'headers': {
          'Content-type': 'application/json',
          'Cookie': this.token['sess_name'] + '=' + this.token['sessid'],
          'X-Csrf-Token': this.token['token'],
        },
        'basi-headers': {
          'user': 'webadmin',
          'pwd': 'tr1@nzadm1npa55',
        }
      }
      let data = {
        role_id: this.role_id,
        industry_id: this.industry_id
      };
      this.oldIndustryId = this.industry_id;
      this.oldIndustryIds['roleId'] = this.role_id;
      this.oldIndustryIds['industryId'] = this.industry_id;


      let reports = this.requestService.get(HOMESCREEN_REPORTS, options);
      // let reports = this.requestService.get(HOMESCREEN, options);
      let sub = reports.subscribe((data) => {
        // $('.modal').modal('hide').data('bs.modal', null);
        // this.data = data;
        // this.showData = data['popular'];  // popular /latest /recent
        // this.setNewsData(this.data, 'popular');
        // this.setBlogData(this.data, 'popular');
        // this.ngxService.stop();
        // setTimeout(function () {
        //   $('#myCarousel').carousel({ interval: 5000, cycle: true });
        // }, 100);
        // this.ngxService.stop();


        // let showMyLibraryValue = this.showMyLibrary();
        // let showOtherLibraryVALUE = this.showOtherLibrary();
        // let showLibrariesRelatedReportsValue = this.showLibrariesRelatedReports('mylibrarydefaultreports');
        // this.showLibrariesRelatedReports('mylibrarydefaultreports');
        let dataContentJSON = {
          "countOfmylibrary": 1,
          "mylibrary": [
              {
                  "title": "Compass Guide for Global Hi-Tech Analytics - IT",
                  "node_id": "5239",
                  "image": "https://prodtrasersbucket.s3.amazonaws.com/field/image/Slide1_35.JPG",
                  "type": "article"
              },
              {
                  "title": "Compass Guide for Global Hi-Tech Digital - IT",
                  "node_id": "5280",
                  "image": "https://prodtrasersbucket.s3.amazonaws.com/field/image/Slide1_40.JPG",
                  "type": "article"
              },
              {
                  "title": "Compass Guide for Global Hi-Tech Security - IT",
                  "node_id": "5304",
                  "image": "https://prodtrasersbucket.s3.amazonaws.com/field/image/Slide1_56.JPG",
                  "type": "article"
              },
              {
                  "title": "TrueNorth Guide for Hi-Tech - IT?",
                  "node_id": "5895",
                  "image": "https://prodtrasersbucket.s3.amazonaws.com/field/image/Slide1_99.JPG",
                  "type": "article"
              },
              {
                  "title": "Abstracts for CEOs: Customer Acquisition & Growth in Hi-tech",
                  "node_id": "8001",
                  "image": "https://prodtrasersbucket.s3.amazonaws.com/field/image/Trasers-2019-CEO-TrueNorth-HiTech_Abstracts_Customer_Acq_Growth_v5.6-1_2.jpg",
                  "type": "article"
              },
              {
                  "title": "Abstracts for CEOs: Customer Value Enablement :Human Capital in Hi-Tech",
                  "node_id": "8016",
                  "image": "https://prodtrasersbucket.s3.amazonaws.com/field/image/Trasers-2019-CEO-TrueNorth_Abstracts_Customer_Enablement_HCM-Hi-Tech-v5.5-1.jpg",
                  "type": "article"
              },
              {
                  "title": "Abstracts for CEOs : Customer Value Delivery in Hi-Tech",
                  "node_id": "8039",
                  "image": "https://prodtrasersbucket.s3.amazonaws.com/field/image/Slide1_1149.JPG",
                  "type": "article"
              },
              {
                  "title": "Compass Guide for Global Hi-Tech Cloud - IT",
                  "node_id": "8113",
                  "image": "https://prodtrasersbucket.s3.amazonaws.com/field/image/2019-Global-Hi-Tech-Compass-Cloud-v10.1-%28TTNOTE0809201813%29-1_0.jpg",
                  "type": "article"
              }
          ],
          "recommendedlibrary": [
              {
                  "title": "Technology Transformation for Cloud in Hi-Tech - The Complete Library",
                  "node_id": "6870",
                  "image": "https://prodtrasersbucket.s3.amazonaws.com/%5Bnode%3Anid%5D/Trasers-Hitech-Marketing.jpg"
              },
              {
                  "title": "Technology Transformation for Analytics in Hi Tech - The Complete Library",
                  "node_id": "6884",
                  "image": "https://prodtrasersbucket.s3.amazonaws.com/%5Bnode%3Anid%5D/Trasers-Hitech-Service-Management.jpg"
              },
              {
                  "title": "Technology Transformation for Digital in Hi-Tech - The Complete Library",
                  "node_id": "6898",
                  "image": "https://prodtrasersbucket.s3.amazonaws.com/%5Bnode%3Anid%5D/Trasers-Hitech-Legal.jpg"
              },
              {
                  "title": "Technology Transformation for Security in Hi-Tech - The Complete Library",
                  "node_id": "6912",
                  "image": "https://prodtrasersbucket.s3.amazonaws.com/%5Bnode%3Anid%5D/Trasers-Hitech-Legal_1.jpg"
              },
              {
                "title": "Technology Transformation for Cloud in Hi-Tech - The Complete Library",
                "node_id": "6870",
                "image": "https://prodtrasersbucket.s3.amazonaws.com/%5Bnode%3Anid%5D/Trasers-Hitech-Marketing.jpg"
              },
              {
                "title": "Technology Transformation for Analytics in Hi Tech - The Complete Library",
                "node_id": "6884",
                "image": "https://prodtrasersbucket.s3.amazonaws.com/%5Bnode%3Anid%5D/Trasers-Hitech-Service-Management.jpg"
              },
              {
                "title": "Technology Transformation for Digital in Hi-Tech - The Complete Library",
                "node_id": "6898",
                "image": "https://prodtrasersbucket.s3.amazonaws.com/%5Bnode%3Anid%5D/Trasers-Hitech-Legal.jpg"
              },
              {
                "title": "Technology Transformation for Security in Hi-Tech - The Complete Library",
                "node_id": "6912",
                "image": "https://prodtrasersbucket.s3.amazonaws.com/%5Bnode%3Anid%5D/Trasers-Hitech-Legal_1.jpg"
              },
              {
                "title": "Technology Transformation for Cloud in Hi-Tech - The Complete Library",
                "node_id": "6870",
                "image": "https://prodtrasersbucket.s3.amazonaws.com/%5Bnode%3Anid%5D/Trasers-Hitech-Marketing.jpg"
              },
              {
                "title": "Technology Transformation for Analytics in Hi Tech - The Complete Library",
                "node_id": "6884",
                "image": "https://prodtrasersbucket.s3.amazonaws.com/%5Bnode%3Anid%5D/Trasers-Hitech-Service-Management.jpg"
              }
          ],
          "recentlyviewed": [
              {
                  "title": "Trasers Reports for Finance & Accounting Transformation KPI Frameworks in Hi-Tech",
                  "node_id": "7120",
                  "image": "https://prodtrasersbucket.s3.amazonaws.com/field/image/TR-Finance-KPI-Frameworks-HiTech-v8.3-1.jpg",
                  "type": "article",
                  "rating": 0,            
                  "isroleaccess": "True",
                  "isspot": "True",
                  "isaddedtolist":"True"
              }
          ]
      };
        // this.data = data;
         this.data = dataContentJSON; 
        this.showMyLibrary();
        this.showRecommendedLibrary();
        // this.showLibrariesRelatedReports('default', null);
      },
        (err) => {
          this.ngxService.stop();
          // this.modalService.sendMessage('Something went wrong, please try again');
          // this.menuService.sendMessage('Something went wrong, please try again');
        });
      setTimeout(() => { sub.unsubscribe(); this.ngxService.stop(); }, this.requestService.timeout);
      // this.requestService.unsubscribtion(sub);
      //setTimeout(() =>{ sub.unsubscribe();this.ngxService.stop();}, 5000);
    }
  }

  showMyLibrary() {
    this.ngxService.start();
    let countOfLibraries = parseInt(this.data["countOfmylibrary"]);
    this.displayNameForLibraries = (countOfLibraries = 1 ) ? "My Reports": "My Libraries";

    let myLibraryData = this.data["mylibrary"], parentData = [], childData = [], j = 0, k = 0;
    if (myLibraryData != '' && myLibraryData != undefined && myLibraryData != null) {
      for (let i = 0; i < myLibraryData.length; i++) {
        j++; childData[k] = myLibraryData[i]; k++;
        if (childData.length === 3 || i === (myLibraryData.length - 1)) {
          parentData.push(childData);
          childData = [], k = 0;
        }
      }
      this.showMyLibrariesData = parentData;
      console.log("showMyLibrariesData---:", this.showMyLibrariesData);
      const $ = (window as any).$;
      setTimeout(function () { $('#myCarousel1').carousel({ interval: 3000, cycle: true }); }, 1000);
      this.ngxService.stop();
    } else {
      this.ngxService.stop();
    }
  }
  showRecommendedLibrary() {
    this.ngxService.start();
    let otherLibraryData = this.data["recommendedlibrary"], parentData = [], childData = [], j = 0, k = 0;
    if (otherLibraryData != '' && otherLibraryData != undefined && otherLibraryData != null) {
      for (let i = 0; i < otherLibraryData.length; i++) {
        j++; childData[k] = otherLibraryData[i]; k++;
        if (childData.length === 4 || i === (otherLibraryData.length - 1)) {
          parentData.push(childData);
          childData = [], k = 0;
        }
      }
      this.showRecommendedLibraryData = parentData;
      console.log("showRecommendedLibraryData::", this.showRecommendedLibraryData);
      const $ = (window as any).$;
      setTimeout(function () { $('#myCarousel2').carousel({ interval: 3000, cycle: true }); }, 1000);
      this.ngxService.stop();
    } else {
      this.ngxService.stop();
    }
    this.GetLibraryDetails();
    this.GetReportDetails();
  }

  showLibrariesRelatedReports(type: any, productID) {
    if(type == 'default'){
      this.ngxService.start();
      let library = this.data['mylibrarydefaultreports']; //mylibrarydefaultreports:
      this.reArrangeReportsData(library);
    } else {
      let reportsType = false;
      if(type == 'mylibrarydefaultreports') {
        reportsType = true;
      }
      let options = {
        'headers': {
          'Content-type': 'application/json',
          'Cookie': this.token['sess_name'] + '=' + this.token['sessid'],
          'X-Csrf-Token': this.token['token'],
        },
        'basi-headers': {
          'user': 'webadmin',
          'pwd': 'tr1@nzadm1npa55',
        }
      }
      let response = this.requestService.get(HOMESCREEN_REPORTS + productID + '/' + reportsType, options);
      response.subscribe((data) => {
          console.log(data);
          this.reArrangeReportsData(data);
        this.ngxService.stop();
      }, 
      error =>{
        // this.modalService.sendMessage('Something went wrong, please try again');
        this.ngxService.stop();
      });
    }
  }

  reArrangeReportsData(library) {
    let libraryData = library['reports'], parentData = [], childData = [], j = 0, k = 0;
      if (libraryData != '' && libraryData != undefined && libraryData != null) {
        for (let i = 0; i < libraryData.length; i++) {
          j++; childData[k] = libraryData[i]; k++;
          if (childData.length === 2 || i === (libraryData.length - 1)) {
            parentData.push(childData);
            childData = [], k = 0;
          }
        }
        this.showLibrariesRelatedReportsData = parentData;
        const $ = (window as any).$;
        setTimeout(function () { $('#myCarouselrating3').carousel({ interval: 3000, cycle: true }); }, 1000);
    }
  }

  gotoLibraryDetails(libId, libType) {
    if(libType == 'My Reports') {
      this.redirect.navigate(['/reportDetails/'+ libId]);
    } else {
      this.redirect.navigate(['/libraryDetails/'+ libId]);
    }
  }
  /*
  new data is displayed with carousel in view part with limitation of 3 elements for each slide.
  So news data object is splited into multiple arrays with of length 3 and pushed into parentArray(tdl)
  After split is over, pushed all arrays into showNewsData for render view.
  This function is also using for tab navigation view dats of popular / latest / recent
  */
  setNewsData(data, key) {
    let news = data[key].news,
      parentData = [],
      childData = [],
      j = 0, k = 0;
    if (news) {
      for (let i = 0; i < news.length; i++) {
        j++; childData[k] = news[i]; k++;
        if (childData.length == 3 || i == (news.length - 1)) {
          parentData.push(childData);
          childData = [], k = 0;
        }
      }
    }
    this.showNewsData = parentData;
    setTimeout(function () {
      $('#myCarouselnews').carousel({ interval: 2000, cycle: true });
    }, 100);
  }
  /*
  blogs data is displayed with carousel in view part with limitation of 3 elements for each slide.
  So blogs data object is splited into multiple arrays with of length 3 and pushed into parentArray(tdl)
  After split is over, pushed all arrays into showBlogData for render view.
  This function is also using for tab navigation view dats of popular / latest / recent
  */
  setBlogData(data, key) {
    let blog = data[key].blog, parentData = [], childData = [], j = 0, k = 0;
    if (blog) {
      for (let i = 0; i < blog.length; i++) {
        j++; childData[k] = blog[i]; k++;
        if (childData.length == 3 || i == (blog.length - 1)) {
          parentData.push(childData);
          childData = [], k = 0;
        }
      }
    }

    this.showBlogData = parentData;
    setTimeout(function () {
      $('#myCarouselblog').carousel({ interval: 2000, cycle: true });
    }, 100);
  }

  getCurrentTabData(key) {
    this.category = key;
    this.showData = this.data[key];
    this.showDataActive = key;
    this.setNewsData(this.data, key);
    this.setBlogData(this.data, key);
  }

  GetLibraryDetails() {
      this.ngxService.start();
      let options = {
        'headers': {
          'Content-type': 'application/json',
          'Cookie': this.token['sess_name'] + '=' + this.token['sessid'],
          'X-Csrf-Token': this.token['token'],
        }
      }

      let reports = this.requestService.get(LIBRARY_DETAILS + '7938/'+ true, options);
      let sub = reports.subscribe((data) => {
        console.log("GetLibraryDetails:::", data);
      },
        (err) => {
          this.ngxService.stop();
          // this.menuService.sendMessage('Something went wrong, please try again');
        });
      setTimeout(() => { sub.unsubscribe(); this.ngxService.stop(); }, this.requestService.timeout);
  }

GetReportDetails() {
      this.ngxService.start();
      let options = {
        'headers': {
          'Content-type': 'application/json',
          'Cookie': this.token['sess_name'] + '=' + this.token['sessid'],
          'X-Csrf-Token': this.token['token'],
        }
      }

      let reports = this.requestService.get(REPORT_DETAILS + '7938/5239', options);
      let sub = reports.subscribe((data) => {
        console.log("GetReportDetails:::", data);
      },
        (err) => {
          this.ngxService.stop();
          // this.menuService.sendMessage('Something went wrong, please try again');
        });
      setTimeout(() => { sub.unsubscribe(); this.ngxService.stop(); }, this.requestService.timeout);
  }
}

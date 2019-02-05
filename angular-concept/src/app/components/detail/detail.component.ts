import { Component, OnInit, NgZone, ChangeDetectionStrategy, ChangeDetectorRef, HostListener } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DETAIL, RATE, BUYINGOPTIONSCAL, ADDTOLIST, ADDTOMYLIB, LOGOUT, SET_WISHLIST, BUILD_ENVIRONMENT_VERSION } from './../../urls.config';
import { ElectronService } from '../../providers/electron.service';
import { RequestService } from '../../providers/request.service';
import { DbService } from '../../providers/db.service';
import { CommonService } from '../../providers/common.service';
import { offline } from '../../providers/offline.service';
import { OfflineStoreService } from '../../providers/OfflineStore.service';
import { BookComponent } from '../book/book.component';
import { ActivatedRoute } from '@angular/router';
import { SessionTokenService } from '../../providers/session-token.service'
import { CartService } from './../../providers/cart.service';
import { Router } from '@angular/router';
import { setTimeout } from 'core-js/library/web/timers';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { reportData } from '../../interfaces/details.interface';
import { Location } from '@angular/common';
import { count } from 'rxjs/operator/count';
import { PopupServiceService } from './../../providers/popup-service.service';
let $ = (window as any).$;

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  providers: [RequestService, offline],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailComponent implements OnInit {

  id: number;
  libid: number;
  data: any;
  token: any;
  rated: boolean = false;
  msg: string = "";
  reportData: reportData;
  showRepoer: boolean;
  cartCount: number = 0;
  showArticlesData: any;
  online: boolean;
  nonRatingImg: string = './../../assets/images/rating.svg';
  ratingImg: string = './../../assets/images/filled_star.svg';
  tableOfInsights: any;
  executiveSummary: any;
  notDownloadble: boolean = false;
  sSeat: any = {};
  sHour: any = {};
  sReport: any = {};
  seats: any = [];
  hours: any = [];
  report: any = [];
  freeHours: Number = 0.0;
  finalPrice: Number = 0.0;
  loaderMessage: string;
  // emptyAddUser: boolean = false;
  isAddedToWishList: boolean = false;
  storeUploaded: boolean = false;

  constructor(public dbService: DbService, public modalService: PopupServiceService, public commonService: CommonService, public cartService: CartService, private electronService: ElectronService, private redirect: Router, private requestService: RequestService, private route: ActivatedRoute, public sessionAndToken: SessionTokenService, private offline: offline,
    private ngxService: NgxUiLoaderService, private domSanitizer: DomSanitizer, private offlineStoreService: OfflineStoreService,
    private changeDetectorRef: ChangeDetectorRef, private _location: Location, private zone: NgZone) {
    this.redirect.routeReuseStrategy.shouldReuseRoute = function () {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      return false;
    };
  }

  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {
      this.closeNav()
    }
  }

  ngOnInit() {
    this.ngxService.start();
    this.storeUploaded = (BUILD_ENVIRONMENT_VERSION.IN_STOREUPLOAD == 'windows') ? true : false;
    this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.getDetail();
      let online = navigator.onLine;
      if (online) {
        this.token = this.sessionAndToken.getTokenAndSession();
        this.cartService.getCartItems();
      }
    });
    $(window).scrollTop();
    $('.search_cart').css('display', 'block');
    // setTimeout(function(){
    //   var myDiv = document.getElementById('right_content_top_wraper');
    //   scrollTo(myDiv.offsetTop, 100);
    //   $(window).scrollTop(); 
    //   $('.right_content_top').scrollTop();
    //   document.body.scrollTop = 0; // For Safari
    //   document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    //   alert('scrolled');  
    // }, 5000);
  }

  selectPlan(e) {
    // this.emptyAddUser = false;
    this.sReport = this.report[e.target.value]
    this.calculatePayment()
  }

  selectHours(e) {
    // this.emptyAddUser = false;
    this.sHour = this.hours[e.target.value]
    this.calculatePayment()
  }

  selectSeats(e) {
    // this.emptyAddUser = false;
    this.sSeat = this.seats[e.target.value]
    this.calculatePayment()
  }

  calculatePayment() {
    this.ngxService.start();
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
      basicprice: this.sReport.price.replace(",", ""), seats: this.sSeat.option_name, hrs: this.sHour.option_name
    };
    let res = this.requestService.put(BUYINGOPTIONSCAL + this.sSeat.option_name, data, options);
    res.subscribe((data) => {
      if (data) {
        this.ngxService.stop();
        this.freeHours = data['free_hours'];
        this.finalPrice = data['final_price'];
        this.changeDetectorRef.detectChanges();
      }
    }, (error) => {
      this.ngxService.stop();
    });
  }
  sendMessage(txt): void {
    // send message to subscribers via observable subject 
    this.modalService.sendMessage(txt);
  }

  clearMessage(): void {
    // clear message
    this.modalService.clearMessage();
  }

  onScroll() {
    let currentScroll = $('.right_content_top').scrollTop();

    if (currentScroll > 100) {
      //hide the cart Icon
      $('.search_cart').css('display', 'none');
    } else {
      //show the cart iscon
      $('.search_cart').css('display', 'block');
    }
  }

  back() {
    let routs = this.offlineStoreService.Breadcrumb;
    let prev = routs[routs.length - 2];
    this.redirect.navigate([prev]);
  }

  addToMyLibrary() {
    this.ngxService.start();
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
    let data = {};
    let lib = this.requestService.put(ADDTOMYLIB + '/' + this.id, data, options);
    lib.subscribe((data) => {
      if (data && data['msg']) {
        this.ngxService.stop();
        this.getDetail();
        this.sendMessage(data['msg']);
      }
    });
  }

  addToList() {
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
    let data = {};
    let list = this.requestService.put(ADDTOLIST + '/' + this.id, data, options);
    list.subscribe((data) => {
      if (data && data['msg']) {
        this.ngxService.stop();
        this.getDetail();
        this.sendMessage(data['msg']);
      }
    });
  }

  addToCart(upselling = false) {
    //If add user is selected as 0 then restrict to addToCart option;
    // this.emptyAddUser = false;
    // var selectObj = document.getElementById('edit-attributes-2');
    // var selectValue = parseInt((selectObj as any).value);
    // if(selectValue == 0 ){
    //   this.emptyAddUser = true;
    //   return false;
    // }

    let addons = {};
    if (this.sReport != '' && this.sReport != undefined && this.sReport != null) {
      let addons = {
        p_oid: this.sReport['oid'],
        p_aid: this.sReport['aid'],
        s_oid: this.sSeat['oid'],
        s_aid: this.sSeat['aid'],
        h_oid: this.sHour['oid'],
        h_aid: this.sHour['aid'],
      }
    }
    if (!upselling)
      this.cartService.addToCart(this.id, addons);
    else
      this.cartService.addToCart(this.libid, addons);
  }

  rateReport(n) {
    if (this.data['isDownloadable'] == 'False') {
      //alert('Please purchase the report first.')
      this.sendMessage('Please purchase the report first.');
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

  getFid(a, n) {
    for (let i = 0; i < a.length; i++) {
      if (a[i].image.indexOf(n) != -1)
        return a[i].fid;
    }
    return -1;
  }


  getDetail() {
    this.online = navigator.onLine;
    if (!this.online) {
      let path = this.offlineStoreService.fetch('trasersPath');
      let userDT = JSON.parse(localStorage.getItem('user-details'));
      let uid = userDT.uid;
      path = path + '/' + uid + '/' + this.id;
      localStorage.setItem('report-path', path);
      this.data = {};
      var s3Images = [];
      this.ngxService.start();
      this.offline.crypto(userDT['password'], 'create-decrypt-pattren');
      this.electronService.fs.readFile(path + '/01data.json', 'utf8', (err, data) => {
        this.data = JSON.parse(data);
        if (data['digital_report_s3_images'] != '' && data['digital_report_s3_images'] != undefined && data['digital_report_s3_images'] != null) {
          s3Images = this.data['digital_report_s3_images'];
        }
        // this.data['digital_report_s3_images'] = [];
        // files.sort(function (a, b) {
        //   return (Number(a.match(/(\d+)/g)[0]) - Number((b.match(/(\d+)/g)[0])));
        // });
        this.reportData = {
          purchased: true,
          index: this.data['flipbook_tableofcontent'] || [],
          data: this.data['digital_report_s3_images'] || [],
          fullScreen: true,
          roleAccess: this.data['isroleaccess'],
          price: this.data
        };
        this.changeDetectorRef.detectChanges();
        // this.ngxService.stop();
      });
    } else {
      this.ngxService.start();
      const options = {
        'Content-type': 'application/json',
        'Authorization': 'Basic d2ViYWRtaW46dHIxQG56YWRtMW5wYTU1',
      };
      const reports = this.requestService.get(DETAIL + '/' + this.id, options);
      let sub = reports.subscribe((data) => {
        this.dbService.captureFids(data['digital_report_s3_images'] || [], this.token['uid'], this.id);
        this.dbService.getConsolidatedNotes(this.token['uid'], this.id, this.token['email']);
        this.dbService.getConsolidatedFeedbacks(this.token['uid'], this.id, this.token['email']);
        this.dbService.getConsolidatedCNs(this.token['uid'], this.id, this.token['email']);
        this.dbService.getConsolidatedCRs(this.token['uid'], this.id, this.token['email']);
        setTimeout(() => {
          this.ngxService.stop(); // stop foreground loading with 'default' id
        }, 100);
        this.reportData = {
          purchased: data['isDownloadable'],
          index: data['flipbook_tableofcontent'] || [],
          data: data['digital_report_s3_images'] || [],
          fullScreen: false,
          roleAccess: data['isroleaccess'],
          price: data['price']
        };
        this.data = data;
        if (this.data.recommended_library != '' && this.data.recommended_library != undefined && this.data.recommended_library != null) {
          this.libid = this.data.recommended_library.product_node_id;
          this.seats = this.data.recommended_library.additional_seats_options;
          this.hours = this.data.recommended_library.hour_options;
          this.report = this.data.recommended_library.payment_options;
        }
        for (let i = 0; i < this.report.length; i++) {
          this.report[i]['price'] = Number(this.report[i]['price']).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        }
        this.sHour = this.hours[0];
        this.sSeat = this.seats[0];
        this.sReport = this.report[0];
        if (this.sHour != undefined && this.sSeat != undefined && this.sReport != undefined) {
          this.calculatePayment();
        }

        if (this.data.article_summary != '' && this.data.article_summary != undefined && this.data.article_summary != null) {
          this.data.article_summary = this.commonService.removeHtmlTags(this.data.article_summary);
        }
        if (this.data.table_of_insights != '' && this.data.table_of_insights != undefined && this.data.table_of_insights != null) {
          this.tableOfInsights = this.data.table_of_insights; //.toUpperCase();
        }
        if (this.data.executive_summary != '' && this.data.executive_summary != undefined && this.data.executive_summary != null) {
          this.executiveSummary = this.data.executive_summary; //.toUpperCase();
        }
        if (data['user_rating'] == 0) {
          this.rated = false;
        }
        this.showRelatedArticles();
        this.changeDetectorRef.detectChanges();
        this.ngxService.stop();
      },
        (err) => {
          // this.sendMessage('Something went wrong, please try again');
        });
      setTimeout(() => { sub.unsubscribe(); this.ngxService.stop(); }, this.requestService.timeout);
    }
  }

  readMore(item) {
    this.id = item.unique_id;
    this.redirect.navigate(['/detail/', this.id]);
  }

  addToWishList(nodeId) {    
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
      let data = {};
      const rating = this.requestService.put(SET_WISHLIST + nodeId, data, options);
      let sub = rating.subscribe((data) => {
        this.isAddedToWishList = true;
        this.ngxService.stop();
        this.changeDetectorRef.detectChanges();
        if (data && data['msg']) {
          this.sendMessage(data['msg']);
        }
      },
      (error)=>{
        this.isAddedToWishList = false;
        this.ngxService.stop();
        this.sendMessage(error);
      });
      setTimeout(() => { sub.unsubscribe(); this.ngxService.stop(); }, this.requestService.timeout);
  }

  viewReport() {
    const data = this.data;
    this.reportData = {
      purchased: data['isDownloadable'],
      index: data['flipbook_tableofcontent'] || [],
      data: data['digital_report_s3_images'] || [],
      fullScreen: true,
      roleAccess: data['isroleaccess'],
      price: data['price']
    };
    document.getElementsByTagName('body')[0].style.overflow = 'hidden';
  }

  saveOffline() {
    this.ngxService.start();
    let data = this.data;
    let images = [];
    if (data['digital_report_s3_images'] != '' && data['digital_report_s3_images'] != undefined && data['digital_report_s3_images'] != null) {
      images = JSON.parse(JSON.stringify(data['digital_report_s3_images']));
    }
    let saveData = data;
    let len = saveData['digital_report_s3_images'].length;
    for (let i = 0; i < len; i++) {
      let name = saveData['digital_report_s3_images'][i]['image'];
      let index = name.lastIndexOf('/');
      let fileName = name.substr(index + 1, name.length - 1);
      fileName = fileName.replace(/\s+/g, '_');
      fileName = fileName.replace(/%/g, '_');
      saveData['digital_report_s3_images'][i]['image'] = fileName;
    }
    if (saveData['downloadpdffilepath']) {
      saveData['downloadpdffilepath'] = '';
    }
    this.offlineStoreService.store('currentReport', JSON.stringify(saveData));
    if (data['isDownloadable']) {
      var inx = 0;
      images.forEach((element, index, array) => {
        const payload = {
          id: this.id,
          fileName: saveData['digital_report_s3_images'][index]['image'],
          image: element.image
        };
        let userDT = JSON.parse(localStorage.getItem('user-details'));
        this.offline.crypto(userDT['password'], 'create-encrypt-pattren');
        this.offline.save(payload, (result) => {
          inx++;
          if (result.error) {
            this.ngxService.stop();
            //alert('An error ocurred creating the file ' + result.error);
            this.sendMessage('An error ocurred creating the file ' + result.error);
            // this.loaderMessage = '';
            return false;
          }
          if(inx === 1){
            // this.loaderMessage = 'Downlod started';
          }
          // this.loaderMessage = 'Downloding ' + Math.floor((inx / array.length) * 100) + '%';
          if (inx === array.length) {
            // this.loaderMessage = '';
            this.ngxService.stop();
            // alert('Report succesfully downloaded');
            this.sendMessage("Report succesfully downloaded to My Downloads");
            this.offline.getUserReportsFolderNames();
          }
          this.changeDetectorRef.detectChanges();
        });
      });
    }
  }
  showRelatedArticles() {
    let news = this.data['related_article'], parentData = [], childData = [], j = 0, k = 0;
    if (news != '' && news != undefined && news != null) {
      for (let i = 0; i < news.length; i++) {
        j++; childData[k] = news[i]; k++;
        if (childData.length === 3 || i === (news.length - 1)) {
          parentData.push(childData);
          childData = [], k = 0;
        }
      }
      this.showArticlesData = parentData;
      const $ = (window as any).$;
      $('#myCarouselrating').carousel({ interval: 3000, cycle: true });
    }
  }

  openNav() {
    document.getElementById('myNav').style.display = 'block';
  }

  closeNav() {
    if (navigator.onLine && this.offlineStoreService.fetch('network-switch')) {
      if (this.offlineStoreService.fetch('network-switch') == 'online') {
        this.redirect.navigate(['/home']);
      }
      else {
        this.redirect.navigate(['mydownloads']);
      }
    }
    if (navigator.onLine) {
      this.reportData = {
        purchased: this.data['isDownloadable'],
        index: this.data['flipbook_tableofcontent'] || [],
        data: this.data['digital_report_s3_images'] || [],
        fullScreen: false,
        roleAccess: this.data['isroleaccess'],
        price: this.data['price']
      }
      document.getElementById("myNav").style.display = "none";
      document.getElementsByTagName("body")[0].style.overflow = "auto";
    }
    else {
      this.zone.run(() => {
        this.redirect.navigate(['/mydownloads']);
      });
    }
    this.offlineStoreService.store('fullScreen', false);
  }
}

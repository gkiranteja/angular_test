import { Component, OnInit, Input, Output, NgZone, SimpleChanges, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, HostListener } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ElectronService } from '../../providers/electron.service';
import { Router } from '@angular/router';
import { flipPage } from '../../interfaces/books.interface';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { PopupServiceService } from './../../providers/popup-service.service';
import { CartService } from './../../providers/cart.service';
// import { DETAIL } from './../../urls.config';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import {
  ASHARE_NOTES, ASET_NOTES_DETAILS,
  ASHARE_FEEDBACKS, ASET_FEEBACK_DETAILS,
  ASHARE_CR, ASET_CUSTOM_RESEARCH_DETAILS,
  ASHARE_CN, ASET_CONTRIBUTENOTES_DETAILS,
  ONE_TIME_SHARE, KEY, OTS_DISCOUNT, BUILD_ENVIRONMENT_VERSION
} from '../../urls.config';
import { SessionTokenService } from '../../providers/session-token.service';
import { RequestService } from '../../providers/request.service';
import { OfflineStoreService } from '../../providers/OfflineStore.service';
import { offlineMode } from '../../providers/offlineMode.service';
import { DbService } from '../../providers/db.service';
import { bloomAdd } from '@angular/core/src/render3/di';
import { offline } from '../../providers/offline.service';
let $ = (window as any).$;

const httpOptions = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true'
  })
};
@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
  host: {
    '(window:resize)': 'onResize($event)'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RequestService, ElectronService]
})
export class BookComponent implements OnInit {
  @Input() reportData: object;
  @Input() menueExpanded;
  @Input() id: any;
  @Output() minimize = new EventEmitter();
  @Output() maximize = new EventEmitter();
  @Output() download = new EventEmitter();
  @Output() notesEmit = new EventEmitter();
  @Output() addTocart = new EventEmitter();
  @Input() isDownload: string;
  @Input() menueChange: string;

  tumbnails: boolean = false;
  tumbnailsStyles: object = {
    'width': '100%',
    'margin-left': '0px'
  };
  dataArray: Array<object> = [];
  loading: boolean = false;
  showPDF: boolean = false;
  pdfPagesCount: number = 0;
  slideNumber: number = 0;
  fullScreen: boolean;
  bookContainer: HTMLElement;
  activeIndex: number = 0;
  flipPage: flipPage = {
    totalCount: 0,
    currentPageNumber: 1
  };
  cuurentImage: object;
  turnJS: any;
  zoomViewPort: any;
  isMoreEnable: any = false;
  msg: any = '';
  token: any;
  notesContent: any;
  showNotesData: any;
  feedbackContent: any;
  showFeedbackData: any;
  customResearchContent: any;
  showCustomResearchData: any;
  contributeNotesContent: any;
  showContributeNotesData: any;
  online: boolean;
  noteSaved: boolean = false;
  feedbackSaved: boolean = false;
  CRsaved: boolean = false;
  ctSaved: boolean = false;
  resizeRation: number = 0.5;
  selectedOption: any;
  selectedOptionValue: any;
  data: any;
  options: any;
  waterMark: string;
  menuewidth: string = '';
  imagesCount: number = 0;
  imageZoom: number = 1;
  activeImage: number = 0;
  notDownloadble: boolean = false;
  showShare: boolean = false;
  count: Number = 0;
  noImageLoader: string;
  storeUploaded: boolean = false;


  otsId: number = 0;
  ElemntsArray = [{ email_shared_to: '' }];
  userEmail: string;
  maxRows: number = 10;
  firstRowDelete: boolean = false;
  dummyImageArray = ["./../../assets/images/add.svg", "./../../assets/images/add.svg", "./../../assets/images/add.svg"];
  classes = ["add-icon", "add-icon", "add-icon"];
  allReferrelas = [];
  showError: boolean = false;
  exceedLimit: boolean = false;
  showResponseStatus: boolean = false;
  showResponse: any;
  showOTS: boolean = false;
  price: number = 130;
  discountedPrice: number = 130;
  ots: boolean = false;
  engage: boolean = false;
  zoomInOutValues: object = {
    isLoaded: false,
    width: 0,
    height: 0
  };
  $imageViewer: any;
  intialImageWidth: number;
  intialImageHeight: number;

  constructor(
    private http: HttpClient,
    private electronService: ElectronService,
    private changeDetectorRef: ChangeDetectorRef,
    public sessionAndToken: SessionTokenService,
    private requestService: RequestService,
    private ngxService: NgxUiLoaderService,
    private offlineStoreService: OfflineStoreService,
    private router: Router,
    public offlineMode: offlineMode,
    private dbService: DbService,
    private offline: offline,
    private modalService: PopupServiceService,
    public cartService: CartService,
    private zone: NgZone) {
    this.notesEmit = new EventEmitter();
    this.offlineMode['fullViewRef'] = this.changeDetectorRef;
  }

  pickSectionHeader() {
    this.count = 0;
    let fid = this.cuurentImage;
    for (let item in this.dbService.fids) {
      this.count = Number(this.count) + 1;
      if (Number(item) === Number(fid)) {
        break;
      }
    }
    var header = this.reportData['index'][0];
    for (let item in this.reportData['index']) {
      header = this.reportData['index'][item];
      if (this.count <= Number(this.reportData['index'][item]['flipweight'])) {
        break;
      }
    }
    return header['title'];
  }

  ngOnInit() {
    // this.lastPage = this.dbService.fids.length - 1 
    // this.ngxService.start();
    let userObj = JSON.parse(localStorage.getItem('user-profile'));
    this.userEmail = userObj.email_address;
    for (let i = 0; i < this.maxRows; i++) {
      this.dummyImageArray[i] = "./../assets/images/add.svg";
      this.classes[i] = "add-icon";
    }
    this.loader();
    let userReports = JSON.parse(localStorage.getItem('user-reports'));
    if (userReports) {
      if (userReports.indexOf(this.id.toString()) >= 0) {
        this.notDownloadble = true;
      }
    }
    if (navigator.onLine) {
      this.token = this.sessionAndToken.getTokenAndSession();
    } else {
      this.token = JSON.parse(localStorage.getItem('user-details'))
      this.reportData['purchased'] = 'True';
    }
    this.storeUploaded = (BUILD_ENVIRONMENT_VERSION.IN_STOREUPLOAD == 'windows') ? true : false;
    let $ = (window as any).$;
    // this.noteSaved = false;
    // this.feedbackSaved = false;
    // this.CRsaved = false;
    // this.ctSaved = false;
    this.data = this.reportData;
    //alert("boook component" + JSON.stringify(this.data));
    this.fullScreen = this.reportData['fullScreen'];
    this.offlineStoreService.store('fullScreen', this.fullScreen);
    let reportData = this.reportData['data'];
    if (this.fullScreen && this.token) {
      this.waterMark = this.token['email'];
    }
    this.flipPage['totalCount'] = reportData.length;
    this.bookContainer = document.getElementById('book');
    let container = this.bookContainer;
    let dataArray = [];
    // reportData.forEach(element => {
    let element = reportData[0];
    this.createImages(container, element);
    // this.dataArray.push({fid:url: element.image});
    // });
    this.online = navigator.onLine;
    if (this.online) {
      this.dataArray = this.reportData['data'];
      if (this.dataArray[0]['fid']) {
        this.cuurentImage = this.dataArray[0]['fid'];
      }

      this.options = {
        'headers': {
          'Content-type': 'application/json',
          'Cookie': this.token['sess_name'] + '=' + this.token['sessid'],
          'X-Csrf-Token': this.token['token'],
        },
        'basi-headers': {
          'user': 'webadmin',
          'pwd': 'tr1@nzadm1npa55',
        }
      };
      this.data = { UID: this.token['uid'], NID: this.id, RWID: 888, RWNAME: 'Digital', CREATEDBY: this.token['email'] };
      this.msg = '';
    }
    $('.contribute_dropdown_list').off('keyup keydown');

    document.getElementById('detailScreen').addEventListener('mouseenter', () => {
      let width = document.getElementById('main').style.width;
      if (width != this.menuewidth) {
        let el = this.bookContainer;
        let prop = this.flipResponsive();
        $(el).turn('size', prop.width, prop.height);
      }
      this.menuewidth = width;
    });

    this.changeDetectorRef.detectChanges();
  }//ngInit


  loader() {
    if (!navigator.onLine) {
      this.ngxService.stop();
      this.loading = !this.loading;
      if (!this.loading) {
        this.noImageLoader = 'no-image-loader';
      }
      this.changeDetectorRef.detectChanges();
    }
  }

  createImages(container, element) {
    let div, img;
    div = document.createElement('div');
    div.className = 'page';
    // div.id = 'flipPage';
    img = document.createElement('img');
    img.style.width = "100%";
    img.style.height = "100%";
    img.id = 'flipImage';
    img.onload = function () {
      this.parentNode.classList.remove("page");
    }
    this.online = navigator.onLine;
    if (!this.online) {
      let userDT = JSON.parse(localStorage.getItem('user-details'));
      this.offline.crypto(userDT['password'], 'create-decrypt-pattren');
      let imgPath = ''
      if (localStorage.getItem('report-path')) {
        imgPath = localStorage.getItem('report-path');
        imgPath = imgPath + '/images/' + element.image;
      }
      else {
        imgPath = element.image;
      }
      this.requestService.get(imgPath, { responseType: 'text' }).subscribe(
        (data: string) => {
          data = this.offline.crypto(userDT['password'], '', data);
          data = data.split("").reverse().join("");
          let src = 'data:image/jpeg;base64,' + data;
          img.src = src;
          this.dataArray.push({ image: src, fid: element.fid });
          this.changeDetectorRef.detectChanges();
          div.appendChild(img);
          container.appendChild(div);
          this.newCreateImages(container);
        },
        (err) => {
          console.log('Error in encoding image');
        }
      );
    }
    else {
      img.src = element.image;
      div.appendChild(img);
      container.appendChild(div);
      this.newCreateImages(container);
      this.dataArray.push({ image: element.image });
    }
  }

  newCreateImages(container) {
    this.imagesCount++;
    if (this.imagesCount < this.reportData['data'].length) {
      let element = this.reportData['data'][this.imagesCount];
      this.createImages(container, element);
    }
    else {
      this.Fliping();
      this.loader();
    }
  }

  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if ($('#noteTextArea').is(':focus') || $('#addFeedback').is(':focus') || $('#addcustomResearch').is(':focus') || $('#addContributeNotes').is(':focus') ||
      $('#contributeCategory').is(':focus')) {
      return;
    }
    if (event.keyCode === 39) {
      this.flipNext();
    }
    else if (event.keyCode === 37) {
      this.flipPrev();
    }
  }

  resetFontColor(event) {
    let id = '#' + event.target.id;
    $(id).click(function () { $(this).css('color', 'black'); });
  }

  onResize(event) {
    let $ = (window as any).$;
    let el = this.bookContainer;
    let prop = this.flipResponsive();
    $(el).turn('size', prop.width, prop.height);
  }

  Fliping() {
    let el = this.bookContainer;
    // this.resizeFlipImages(el, this.resizeRation);
    this.runImgViewer2(0);
    this.flipImagePlugin(el);
  }

  runImgViewer2(i) {
    if (this.fullScreen) {
      let $img = $('.page-wrapper #flipImage').eq(i);
      // if (!this.$imageViewer) {
      this.$imageViewer = $img.imgViewer2({
        zoomStep: 0.5,
        zoomMax: undefined,
        zoomable: true,
        dragable: true,
        onClick: $.noop,
        onReady: $.noop
      });
      // }
    }
  }


  flipResponsive() {
    let width = 0;
    let height = 0;
    if (this.fullScreen) {
      width = document.getElementById('myNav').clientWidth - 480;
      height = document.getElementById('myNav').clientHeight - 240;
      if (width <= 960 && height <= 660) {
        width = document.getElementById('myNav').clientWidth - 330;
        height = document.getElementById('myNav').clientHeight - 250;
      }
      if (width <= 694 && height <= 518) {
        width = document.getElementById('myNav').clientWidth - 200;
        height = document.getElementById('myNav').clientHeight - 260;
      }
    }
    else {
      width = document.getElementsByClassName('width75')[0].clientWidth;
      height = 340;
    }
    /*While making zoom-in we have to increasing the desfault size(ex:10x10) of the image to screen size(ex:20x20) 
      after that we are making the zooming on that images.
      While making zoom-out we have to decresing the image size upto initial dymentions(ex:20x20).
      After reach to the initial increased dimentions we need to decrease to original size(ex:10x10).
      To fetch the original sizes, we are storing these values into 'zoomInOutValues'
     */
    if (this.zoomInOutValues['isLoaded'] === false) {
      this.zoomInOutValues['isLoaded'] = true;
      this.zoomInOutValues['width'] = width;
      this.zoomInOutValues['height'] = height;
    }
    this.intialImageWidth = width;
    this.intialImageHeight = height;
    return {
      width: width,
      height: height
    }
  }

  flipImagePlugin(el) {
    // run the plugin
    let $ = (window as any).$;
    $(el).bind('turning', (event, page, view) => {
      this.flipPage['currentPageNumber'] = page;
      this.cuurentImage = this.dataArray[page - 1]['fid']
      if (this.cuurentImage == this.dbService.lastPage)
        this.showShare = true;
      else
        this.showShare = false;
      this.getNotes();
      this.getContributeNotes();
      this.getFeedbacks();
      this.getCustomResearch();
      // this.changeDetectorRef.detectChanges();
    })
    $(el).bind("turned", (event, page, view) => {
      this.flipPage['currentPageNumber'] = page;
      this.changeDetectorRef.detectChanges();
    });
    let prop = this.flipResponsive();
    this.turnJS = $(el).turn({
      width: prop.width,
      height: prop.height,
      display: 'single',
      autoCenter: true,
      next: true
    });
    // hide the body overflow
    document.body.className = 'hide-overflow';
  }

  tumbnailsMenue() {
    this.tumbnails = !this.tumbnails;
    if (this.tumbnails == false) {
      this.tumbnailsStyles = {
        'width': '100%',
        'margin-left': '0px'
      }
    }
    else {
      this.tumbnailsStyles = {};
    }
    this.changeDetectorRef.detectChanges();
  }

  flipNext() {
    // this.isMoreEnable = false;
    this.turnJS.turn("next");
    if (this.activeImage < (this.dataArray.length -1)) {
      this.activeImage++;
    }
    let i = this.flipPage['currentPageNumber'] + 1;
    // this.cuurentImage = this.dataArray[i - 1]['fid'];
    this.msg = '';
    this.ots = false;
  }

  flipPrev() {
    // this.isMoreEnable = false;
    let i = this.flipPage['currentPageNumber'] - 1;
    // this.cuurentImage = this.dataArray[i - 1]['fid'];
    this.turnJS.turn("previous");
    if (this.activeImage >= 1) {
      this.activeImage--;
    }
    this.msg = '';
    this.ots = false;
  }

  goToIndex(i) {
    i = parseInt(i);
    this.activeIndex = i;
    i = i - 1;
    this.flipPageTo(i);
  }

  flipPageTo(i) {
    // this.isMoreEnable = false;
    // this.cuurentImage = this.dataArray[i]['fid'];
    i = i + 1;
    this.turnJS.turn('page', i);
    this.activeImage = i - 1;
    // this.getNotes()
    // this.getContributeNotes()
    // this.getFeedbacks()
    // this.getCustomResearch()
  }

  /*While making the zoom-in we are increasing the div and images sizes. 
    For that we calculate the 'myNav' size and increase the container.
    After that we are making the zoom functionality within that container.
  */
  flipZoomIn() {
    let current = this.activeImage || 0;
    $(this.bookContainer).turn('size', $(window).width() + 40, $(window).height() + 40);
    $('.width75.right-side-view').css('margin-top', '-30px');
    this.runImgViewer2(current);
    $('.leaflet-control-zoom-in')[current].click();

    // let $ = (window as any).$;
    // let el = this.bookContainer;
    // let prop = { width: $('.page-wrapper #flipImage')[current].clientWidth - 100, height: $('.page-wrapper #flipImage')[current].clientHeight - 200 };
    // $(el).turn('size', prop.width, prop.height);

    // this.imageZoom = this.imageZoom + 0.2;
    // this.bookContainer.style['transform'] = 'scale(' + this.imageZoom + ')';
    // let width = parseInt(document.querySelectorAll('.page-wrapper[page="1"]')[0]['style']['width']) * 2;
    // document.querySelectorAll('.page-wrapper[page="1"]')[0]['style']['width'] = width.toString() + 'px';
    // document.querySelectorAll('.page-wrapper[page="1"] img')[0]['style']['width'] = width.toString() + 'px';
  }

  /*While making the zoom-out based on the increased zoom-in values.
    Once if its reached <=1 then we are descresed the div and image sizes, which is previously increased.
  */
  flipZoomOut() {
    let current = this.activeImage || 0;
    this.runImgViewer2(current);
    $('.leaflet-control-zoom-out')[current].click();
    // if (($('.page-wrapper img.leaflet-image-layer')[current].clientWidth - 550) <= this.intialImageWidth) {//correction
    //   $(this.bookContainer).turn('size', this.intialImageWidth, this.intialImageHeight);
    //   $('.width75.right-side-view').css('margin-top', '30px');
    // }
    // let el = this.bookContainer;
    // let prop = { width: $('.page-wrapper #flipImage')[current].clientWidth - 100, height: $('.page-wrapper #flipImage')[current].clientHeight - 200 };
    // $(el).turn('size', prop.width, prop.height);
    // if (this.imageZoom > 1) {
    //   this.imageZoom = this.imageZoom - 0.2;
    // }
    // if (this.imageZoom <= 1) {
    //   let $ = (window as any).$;
    //   let el = this.bookContainer;
    //   $(el).turn('size', this.zoomInOutValues['width'], this.zoomInOutValues['height']);
    // }
    // this.bookContainer.style['transform'] = 'scale(' + this.imageZoom + ')';
  }

  onMouseWheel(e) {
    if (this.fullScreen) {
      // if (e.deltaY < 0) {
      this.flipZoomIn();
      // }
      // if (e.deltaY > 0) {
      //   this.flipZoomOut();
      // }
    }
  }

  showMoreOptions() {
    this.isMoreEnable = !this.isMoreEnable;
    this.showNotesData = {}
    this.showContributeNotesData = {}
    this.showCustomResearchData = {}
    this.showFeedbackData = {}
    if (this.isMoreEnable) {
      let i = this.flipPage['currentPageNumber'] - 1;
      this.cuurentImage = this.dataArray[i]['fid'];
      if (navigator.onLine) {
        this.getNotes()
        this.getContributeNotes()
        this.getFeedbacks()
        this.getCustomResearch()
      } else {
        this.dbService.pullFromLocalDb({
          fid: this.dataArray[i]['fid'], uid: this.token['uid'], nid: this.id,
        }, 'notes', 'notes', this)
        this.dbService.pullFromLocalDb({
          fid: this.dataArray[i]['fid'], uid: this.token['uid'], nid: this.id,
        }, 'feedbacks', 'feedbacks', this)
        this.dbService.pullFromLocalDb({
          fid: this.dataArray[i]['fid'], uid: this.token['uid'], nid: this.id,
        }, 'custom_research', 'custom_research', this)
        this.dbService.pullFromLocalDb({
          fid: this.dataArray[i]['fid'], uid: this.token['uid'], nid: this.id,
        }, 'contribute_notes as Contribute, category as ContributeCategory', 'contribute_notes', this)
        this.changeDetectorRef.detectChanges();
      }
      //Commenting since it wont work offline, but it is expected to be
      // else {
      //   this.showNotesData = this.dbService.pullFromLocalDb({
      //     fid: this.dataArray[i]['fid'], uid: this.token['uid'], nid: this.id,
      //   }, 'notes', 'notes')
      //   this.showFeedbackData = this.dbService.pullFromLocalDb({
      //     fid: this.dataArray[i]['fid'], uid: this.token['uid'], nid: this.id,
      //   }, 'feedbacks', 'feedbacks')
      //   this.showContributeNotesData = this.dbService.pullFromLocalDb({
      //     fid: this.dataArray[i]['fid'], uid: this.token['uid'], nid: this.id,
      //   }, 'contribute_notes as Contribute, category as ContributeCategory', 'contribute_notes')
      //   this.showCustomResearchData = this.dbService.pullFromLocalDb({
      //     fid: this.dataArray[i]['fid'], uid: this.token['uid'], nid: this.id,
      //   }, 'custom_research', 'custom_research')
      // }
    }
  }

  closeNav() {
    if (navigator.onLine && this.offlineStoreService.fetch('network-switch')) {
      if (this.offlineStoreService.fetch('network-switch') == 'online') {
        this.router.navigate(['/home']);
      }
      else {
        this.router.navigate(['mydownloads']);
      }
    }
    else if (navigator.onLine) {
      this.minimize.emit();
    }
    else {
      this.zone.run(() => {
        this.router.navigate(['mydownloads']);
      });
    }
    this.offlineStoreService.store('fullScreen', false);
    this.offlineStoreService.store('fullScreen', false);
    this.zoomInOutValues = {
      isLoaded: false,
      width: 0,
      height: 0
    };
  }

  expand() {
    this.maximize.emit();
  }

  saveOffline() {
    this.download.emit();
    this.notDownloadble = true;
  }

  /**********More button functionalities************************* */
  /* GET and SAVED NOTES */
  getNotes() {
    let dataObj;
    dataObj = Object.assign({}, this.data);
    dataObj['FID'] = this.cuurentImage;
    this.showNotesData = {};
    if (navigator.onLine) {
      this.showNotesData = this.dbService.fids[dataObj['FID']];
    } else {
      this.dbService.pullFromLocalDb({
        fid: this.cuurentImage, uid: this.token['uid'], nid: this.id,
      }, 'notes', 'notes', this)
    }
  }

  setNotesData() {
    if (!this.showNotesData.Notes || !this.showNotesData.Notes.trim()) {
      $('#noteId').text("Notes cannot be left blank.");
      $('#noteId').css('display', 'block');
      $('#noteId').css({ 'color': 'red' });
      setTimeout(() => {
        $('#noteId').css('display', 'none');
      }, 3000);
      return;
    }
    let synced = 0;
    if (navigator.onLine) {
      let lib, options, dataObj;
      options = JSON.parse(JSON.stringify(this.options));
      dataObj = Object.assign({}, this.data);
      dataObj['FID'] = this.cuurentImage;
      dataObj['Notes'] = this.showNotesData.Notes;
      dataObj['RWNAME'] = this.pickSectionHeader();
      this.showNotesData['rwname'] = dataObj['RWNAME'];
      console.log("set notes " + JSON.stringify(dataObj))
      lib = this.requestService.post(ASET_NOTES_DETAILS, dataObj, { 'headers': { 'x-api-key': KEY, 'Content-Type': 'application/json', 'Accept': 'application/json', 'x-amzn-apigateway-api-id': '6uz9oy1op3' } });
      lib.subscribe((data) => {
        synced = 1
        this.saveNotesOffline(this.showNotesData.Notes, synced)
        this.notesContent = '';
        // this.getNotes();
        $('#noteId').text(data.Message);
        $('#noteId').css('display', 'block');
        $('#noteId').css({ 'color': 'green' });
        this.noteSaved = true;
        setTimeout(() => {
          this.noteSaved = false;
          //this.changeDetectorRef.detectChanges();
          $('#noteId').css('display', 'none');
        }, 3000);
      },
        err => {

          alert("Could not contact server. You data is temporarily saved locally.");
        });
    } else {
      this.saveNotesOffline(this.showNotesData.Notes, synced)
    }
  }

  getUserDetails() {
    let user = localStorage.getItem('user-details');
    user = JSON.parse(user);
    return user;
  }

  shareNotes() {
    let lib, options, dataObj;
    let user = this.getUserDetails();
    options = JSON.parse(JSON.stringify(this.options));
    // user['email'] = 'rahul.sharma@xcubelabs.com';
    dataObj = {
      UID: this.token['uid'], NID: this.id, To: user['email'], From: 'webmaster@trasers.com',
      Username: user['email'], ReportName: 'Digital', MailSenderName: 'Trasers'
    };
    lib = this.requestService.post(ASHARE_NOTES, dataObj, { 'headers': { 'x-api-key': KEY, 'Content-Type': 'application/json', 'Accept': 'application/json', 'x-amzn-apigateway-api-id': '6uz9oy1op3' } });
    lib.subscribe((data) => {
      $('#noteId').text(data.Message);
      $('#noteId').css('display', 'block');
      $('#noteId').css({ 'color': 'green' });
      setTimeout(() => {
        this.noteSaved = false;
        $('#noteId').css('display', 'none');
      }, 3000);
    },
      err => {
        alert("Could not contact server. Your notes might not have been shared.");
      });
  }

  shareFeedbacks() {
    let lib, options, dataObj;
    let user = this.getUserDetails();
    options = JSON.parse(JSON.stringify(this.options));
    // user['email'] = 'rahul.sharma@xcubelabs.com';
    dataObj = {
      UID: this.token['uid'], NID: this.id, CCUserEmailID: user['email'], To: 'reach@trasers.com',
      From: 'webmaster@trasers.com', Username: user['username'], ReportName: 'Digital', MailSenderName: 'Trasers'
    };
    lib = this.requestService.post(ASHARE_FEEDBACKS, dataObj, { 'headers': { 'x-api-key': KEY, 'Content-Type': 'application/json', 'Accept': 'application/json', 'x-amzn-apigateway-api-id': '6uz9oy1op3' } });
    lib.subscribe((data) => {
      $('#feedbackId').text(data.Message);
      $('#feedbackId').css('display', 'block');
      $('#feedbackId').css({ 'color': 'green' });
      setTimeout(() => {
        this.noteSaved = false;
        $('#feedbackId').css('display', 'none');
      }, 3000);
    },
      err => {
        alert("Could not contact server. Your feedbacks might not have been shared.");
      });
  }

  shareCR() {
    let lib, options, dataObj;
    let user = this.getUserDetails();
    options = JSON.parse(JSON.stringify(this.options));
    // user['email'] = 'rahul.sharma@xcubelabs.com';
    dataObj = {
      UID: this.token['uid'], NID: this.id, CCUserEmailID: user['email'], To: 'reach@trasers.com',
      From: 'webmaster@trasers.com', Username: user['username'], ReportName: 'Digital', MailSenderName: 'Trasers'
    };
    lib = this.requestService.post(ASHARE_CR, dataObj, { 'headers': { 'x-api-key': KEY, 'Content-Type': 'application/json', 'Accept': 'application/json', 'x-amzn-apigateway-api-id': '6uz9oy1op3' } });
    lib.subscribe((data) => {
      $('#crId').text(data.Message);
      $('#crId').css('display', 'block');
      $('#crId').css({ 'color': 'green' });
      setTimeout(() => {
        this.noteSaved = false;
        $('#crId').css('display', 'none');
      }, 3000);
    },
      err => {
        alert("Could not contact server. Your feedbacks might not have been shared.");
      });
  }

  shareCN() {
    let lib, options, dataObj;
    let user = this.getUserDetails();
    options = JSON.parse(JSON.stringify(this.options));
    // user['email'] = 'rahul.sharma@xcubelabs.com';
    dataObj = {
      UID: this.token['uid'], NID: this.id, CCUserEmailID: user['email'], To: 'reach@trasers.com',
      From: 'webmaster@trasers.com', Username: user['username'], ReportName: 'Digital', MailSenderName: 'Trasers'
    };
    lib = this.requestService.post(ASHARE_CN, dataObj, { 'headers': { 'x-api-key': KEY, 'Content-Type': 'application/json', 'Accept': 'application/json', 'x-amzn-apigateway-api-id': '6uz9oy1op3' } });
    lib.subscribe((data) => {
      $('#ctId').text(data.Message);
      $('#ctId').css('display', 'block');
      $('#ctId').css({ 'color': 'green' });
      setTimeout(() => {
        this.noteSaved = false;
        $('#ctId').css('display', 'none');
      }, 3000);
    },
      err => {
        alert("Could not contact server. Your feedbacks might not have been shared.");
      });
  }

  saveNotesOffline(notes, synced, msg = true) {
    this.dbService.pushToLocalDb('notes', 'notes', {
      uid: this.token['uid'], nid: this.id, fid: this.cuurentImage, value1: notes, email: this.token['email'],
      rwname: this.showNotesData.rwname
    }, synced, this);
    if (msg) {
      this.noteSaved = true;
      $('#noteId').css('display', 'block');
      $('#noteId').text('Your notes have been saved');
      $('#noteId').css({ 'color': 'green' });
      setTimeout(() => {
        this.noteSaved = false;
        $('#noteId').css('display', 'none');
      }, 3000);
    }
  }

  saveFeedbacksOffline(feedbacks, synced, msg = true) {
    this.dbService.pushToLocalDb('feedbacks', 'feedbacks', {
      uid: this.token['uid'], nid: this.id, fid: this.cuurentImage, value1: feedbacks, email: this.token['email'],
      rwname: this.showFeedbackData.rwname
    }, synced, this);
    if (msg) {
      this.noteSaved = true;
      $('#feedbackId').text('Your feedback has been saved');
      $('#feedbackId').css('display', 'block');
      $('#feedbackId').css({ 'color': 'green' });
      setTimeout(() => {
        this.noteSaved = false;
        $('#feedbackId').css('display', 'none');
      }, 3000);
    }
  }

  saveCrOffline(cr, synced, msg = true) {
    this.dbService.pushToLocalDb('custom_research', 'custom_research', {
      uid: this.token['uid'], nid: this.id, fid: this.cuurentImage, value1: cr, email: this.token['email'],
      rwname: this.showCustomResearchData.rwname
    }, synced, this);
    if (msg) {
      this.noteSaved = true;
      $('#crId').text('Your custom research has been saved');
      $('#crId').css('display', 'block');
      $('#crId').css({ 'color': 'green' });
      setTimeout(() => {
        this.noteSaved = false;
        $('#crId').css('display', 'none');
      }, 3000);
    }
  }

  saveCnOffline(cn, cc, synced, msg = true) {
    this.dbService.pushToLocalDb('contribute_notes', ['contribute_notes', 'category'], {
      uid: this.token['uid'], nid: this.id, fid: this.cuurentImage, value1: cn, value2: cc, email: this.token['email'],
      rwname: this.showContributeNotesData.rwname
    }, synced, this);
    if (msg) {
      this.noteSaved = true;
      $('#ctId').text('Your contribute notes have been saved');
      $('#ctId').css('display', 'block');
      $('#ctId').css({ 'color': 'green' });
      setTimeout(() => {
        this.noteSaved = false;
        $('#ctId').css('display', 'none');
      }, 3000);
    }
  }

  /* GET and SAVED FEEDBACK */
  getFeedbacks() {
    let dataObj;
    dataObj = Object.assign({}, this.data);
    dataObj['FID'] = this.cuurentImage;
    this.showFeedbackData = {};
    if (navigator.onLine) {
      this.showFeedbackData = this.dbService.fids[dataObj['FID']];
    } else {
      this.dbService.pullFromLocalDb({
        fid: this.cuurentImage, uid: this.token['uid'], nid: this.id,
      }, 'feedbacks', 'feedbacks', this)
    }
  }
  saveFeedbackData() {
    if (!this.showFeedbackData.Feedback || !this.showFeedbackData.Feedback.trim()) {
      $('#feedbackId').text("Feedback cannot be left blank.");
      $('#feedbackId').css('display', 'block');
      $('#feedbackId').css({ 'color': 'red' });
      setTimeout(() => {
        $('#feedbackId').css('display', 'none');
      }, 3000);
      return;
    }
    let synced = 0;
    if (navigator.onLine) {
      let lib, dataObj, options;
      options = JSON.parse(JSON.stringify(this.options));
      dataObj = Object.assign({}, this.data);
      dataObj['FID'] = this.cuurentImage;
      dataObj['Feedback'] = this.showFeedbackData.Feedback;
      dataObj['RWNAME'] = this.pickSectionHeader();
      this.showFeedbackData['rwname'] = dataObj['RWNAME'];
      console.log("set fb " + JSON.stringify(dataObj))
      lib = this.requestService.post(ASET_FEEBACK_DETAILS, dataObj, { 'headers': { 'x-api-key': KEY, 'Content-Type': 'application/json', 'Accept': 'application/json', 'x-amzn-apigateway-api-id': '6uz9oy1op3' } });
      lib.subscribe((data) => {
        synced = 1;
        this.saveFeedbacksOffline(this.showFeedbackData.Feedback, synced)
        this.feedbackContent = '';
        // this.getFeedbacks();
        $('#feedbackId').text(data.Message);
        $('#feedbackId').css('display', 'block');
        $('#feedbackId').css({ 'color': 'green' });
        this.feedbackSaved = true;
        setTimeout(() => {
          this.feedbackSaved = false;
          $('#feedbackId').css('display', 'none');
        }, 3000);
      },
        err => {
          alert("Could not contact server. You data is temporarily saved locally.");
        });
    } else {
      this.saveFeedbacksOffline(this.showFeedbackData.Feedback, synced)
    }
  }

  /* GET and SAVED CUSTOM RESEARCH */
  getCustomResearch() {
    let dataObj;
    dataObj = Object.assign({}, this.data);
    dataObj['FID'] = this.cuurentImage;
    this.showCustomResearchData = {};
    if (navigator.onLine) {
      this.showCustomResearchData = this.dbService.fids[dataObj['FID']];
    } else {
      this.dbService.pullFromLocalDb({
        fid: this.cuurentImage, uid: this.token['uid'], nid: this.id,
      }, 'custom_research', 'custom_research', this)
    }
  }
  saveCustomResearchData() {
    if (!this.showCustomResearchData.CustomResearch || !this.showCustomResearchData.CustomResearch.trim()) {
      $('#crId').text("Custom research cannot be left blank.");
      $('#crId').css('display', 'block');
      $('#crId').css({ 'color': 'red' });
      setTimeout(() => {
        $('#crId').css('display', 'none');
      }, 3000);
      return;
    }
    let synced = 0;
    if (navigator.onLine) {
      let lib, objData, options, dataObj;
      options = JSON.parse(JSON.stringify(this.options));
      dataObj = Object.assign({}, this.data);
      dataObj['FID'] = this.cuurentImage;
      dataObj['RWNAME'] = this.pickSectionHeader();
      this.showCustomResearchData['rwname'] = dataObj['RWNAME'];
      dataObj['CustomResearch'] = this.showCustomResearchData.CustomResearch;
      lib = this.requestService.post(ASET_CUSTOM_RESEARCH_DETAILS, dataObj, { 'headers': { 'x-api-key': KEY, 'Content-Type': 'application/json', 'Accept': 'application/json', 'x-amzn-apigateway-api-id': '6uz9oy1op3' } });
      lib.subscribe((data) => {
        synced = 1;
        this.saveCrOffline(this.showCustomResearchData.CustomResearch, synced)
        this.customResearchContent = '';
        // this.getCustomResearch();
        $('#crId').text(data.Message);
        $('#crId').css('display', 'block');
        $('#crId').css({ 'color': 'green' });
        this.CRsaved = true;
        setTimeout(() => {
          this.CRsaved = false;
          $('#crId').css('display', 'none');
        }, 3000);
      },
        err => {
          alert("Could not contact server. You data is temporarily saved locally.");
        });
    } else {
      this.saveCrOffline(this.showCustomResearchData.CustomResearch, synced)
    }
  }

  /* GET and SAVED CONTRIBUTE NOTES */
  getContributeNotes() {
    let dataObj;
    dataObj = Object.assign({}, this.data);
    dataObj['FID'] = this.cuurentImage;
    this.selectedOption = ""
    this.selectedOptionValue = ""
    this.showContributeNotesData = {}
    if (navigator.onLine) {
      this.showContributeNotesData = this.dbService.fids[dataObj['FID']];
      this.selectedOption = this.dbService.fids[dataObj['FID']]['ContributeCategory'];
      this.selectedOptionValue = this.dbService.fids[dataObj['FID']]['ContributeCategory'];
    } else {
      this.dbService.pullFromLocalDb({
        fid: this.cuurentImage, uid: this.token['uid'], nid: this.id,
      }, 'contribute_notes, category', 'contribute_notes', this)
    }
  }

  setDropDownVal() {
    $('.contribute_dropdown_list').val(this.selectedOptionValue);
    $('.contribute_dropdown_list').on('keyup keydown', function (e) {
      // e.stopPropagation();
      e.preventDefault();
    });
  }

  saveContributeNotesData() {
    if (!this.showContributeNotesData.ContributeNotes || !this.showContributeNotesData.ContributeNotes.trim()) {
      $('#ctId').text("Contribute notes cannot be left blank.");
      $('#ctId').css('display', 'block');
      $('#ctId').css({ 'color': 'red' });
      setTimeout(() => {
        $('#ctId').css('display', 'none');
      }, 3000);
      return;
    }
    if (!this.selectedOption) {
      $('#ctId').text("Please select a category.");
      $('#ctId').css('display', 'block');
      $('#ctId').css({ 'color': 'red' });
      setTimeout(() => {
        $('#ctId').css('display', 'none');
      }, 3000);
      return;
    }
    let synced = 0
    if (navigator.onLine) {
      let lib, options, dataObj;
      options = JSON.parse(JSON.stringify(this.options));
      dataObj = Object.assign({}, this.data);
      dataObj['FID'] = this.cuurentImage;
      dataObj['RWNAME'] = this.pickSectionHeader();
      this.showContributeNotesData['rwname'] = dataObj['RWNAME'];
      dataObj['Contribute'] = this.showContributeNotesData.ContributeNotes;
      dataObj['ContributeCategory'] = this.selectedOption;
      lib = this.requestService.post(ASET_CONTRIBUTENOTES_DETAILS, dataObj, { 'headers': { 'x-api-key': KEY, 'Content-Type': 'application/json', 'Accept': 'application/json', 'x-amzn-apigateway-api-id': '6uz9oy1op3' } });
      lib.subscribe((data) => {
        synced = 1
        this.saveCnOffline(this.showContributeNotesData.ContributeNotes, this.selectedOption, synced)
        this.contributeNotesContent = '';
        // this.getContributeNotes();
        $('#ctId').text(data.Message);
        $('#ctId').css('display', 'block');
        $('#ctId').css({ 'color': 'green' });
        this.ctSaved = true;
        setTimeout(() => {
          this.ctSaved = false;
          $('#ctId').css('display', 'none');
        }, 3000);
      },
        err => {
          alert("Could not contact server. You data is temporarily saved locally.");
        });
    } else {
      this.saveCnOffline(this.showContributeNotesData.ContributeNotes, this.selectedOption, synced)
    }
  }

  showOTSPopUP() {
    //this.elementsArray = [0,1,2];
    this.ots = true;
    this.engage = false;
    this.discountedPrice = 0;
    this.showOTS = true;
    //this.firstRowDelete = true;
    // document.getElementById('menu26').style.display = "block";
    this.getDiscountedPrice();

  }

  getDiscountedPrice() {
    try {
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
      // alert("data prcie input " +JSON.stringify( this.data))
      // alert("reportData prcie input " +JSON.stringify( this.reportData))
      // alert(this.data['price']);
      // alert(this.reportData['price']);
      let data = {};
      data['basic_price'] = this.reportData['price'];
      data['nid'] = this.id;
      data['email'] = this.userEmail;
      // this.data = this.reportData;


      //alert("dsicounted prcie input " + JSON.stringify(data));
      let response = this.requestService.put(OTS_DISCOUNT + '/' + this.id, data, options);
      response.subscribe((resp) => {
        this.showResponseStatus = true;
        if (resp && resp['ots_discount_value']) {
          this.discountedPrice = resp['ots_discount_value'];
          this.price = this.discountedPrice;
        }
        else {
          console.log("no responses");
        }
        this.ngxService.stop();
        this.changeDetectorRef.detectChanges();
      },
        error => {
          // this.modalService.sendMessage('Something went wrong, please try again');
          this.ngxService.stop();
          this.changeDetectorRef.detectChanges();
        });

    } catch (e) { console.log("Error in getDiscountedPrice()" + e) }
  }


  prepareObj() {
    let validEmailRegEx, isEmailValid;
    this.allReferrelas = [];
    this.showError = false; this.exceedLimit = false; this.showResponseStatus = false;
    this.showError = false;
    let validation = this.makeValidation();
    //alert(validation);
    if (!validation) {
      this.showError = true;
      return false;
    }
    try {
      let referralObj = [];
      let enteredEmails = [];
      let obj1 = {};
      console.log(this.ElemntsArray.length);
      this.allReferrelas = [];
      var obj = {};
      obj['node_id'] = this.id;
      obj['user_id'] = this.token['uid'];
      obj['noofusr'] = this.ElemntsArray.length;
      obj['email_shared_by'] = this.userEmail;
      let ElemntsArray = this.ElemntsArray;

      obj['onetimeshare'] = ElemntsArray;
      this.setOneTimeShareData(obj);


    } catch (e) {
      console.log("Error in prepareObj()" + e);
    }
  }
  setOneTimeShareData(data) {
    try {
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
      //alert(JSON.stringify(data))
      let response = this.requestService.put(ONE_TIME_SHARE + '/' + this.id, data, options);
      response.subscribe((resp) => {
        this.showResponseStatus = true;
        if (resp && resp['msg']) {
          //alert(JSON.stringify(resp))
          this.ElemntsArray = [{ email_shared_to: '' }]; this.firstRowDelete = false;
          this.modalService.sendMessage(resp['msg']);
          //this.addTocart.emit();

          this.router.navigate(['/cart']);
        }
        else {
          //alert("no responses");
        }
        this.ngxService.stop();
        this.changeDetectorRef.detectChanges();
      },
        error => {
          // this.modalService.sendMessage('Something went wrong, please try again');
          this.ngxService.stop();
          this.changeDetectorRef.detectChanges();
        });

    } catch (e) { console.log("Error in postReferral" + e) }
  }

  RemoveFiled(index) {
    index = parseInt(index)
    //alert(index)
    this.showError = false;
    this.exceedLimit = false;
    if (this.ElemntsArray.length <= 1) return;
    //alert(this.otsId)
    if (this.otsId >= 1) this.otsId--;
    if (this.otsId <= 0) this.otsId = 0;
    //alert(this.otsId)
    if (this.otsId >= 0)
      this.ElemntsArray.splice(index, 1);
    // var exist = this.ElemntsArray.indexOf(index); 
    // if (exist > -1) {
    //   this.ElemntsArray.splice(exist, 1);
    // }
    if (this.ElemntsArray.length > 1) {
      this.firstRowDelete = true;
    } else {
      this.firstRowDelete = false;
    }
    // alert("length" + this.ElemntsArray.length)
    this.setDefaultClasses();
    this.caliculatePrice();
    this.changeDetectorRef.detectChanges();
    console.log("After splicing Elements Array" + this.ElemntsArray + "and index is " + this.otsId);


  }
  addNewFiled(index?: number) {
    //alert(this.otsId)
    this.showError = false;
    this.exceedLimit = false;
    let validation = this.makeValidation();
    if (!validation) {
      this.showError = true;
      return false;
    }
    this.otsId++;
    // alert("after increment" + this.otsId)
    if (this.otsId >= this.maxRows) {
      this.otsId = this.maxRows - 1;
      this.exceedLimit = true;
      return;
    }
    // alert("after increment" + this.otsId)
    console.log("index of element" + index + "id is " + this.otsId);
    this.ElemntsArray.push({ 'email_shared_to': '' });
    this.dummyImageArray[this.otsId] = "./../../assets/images/multiply.svg";
    this.classes[this.otsId] = "cross-icon";

    //this.setDefaultClasses();
    if (this.ElemntsArray.length > 1) {
      this.firstRowDelete = true;
    } else {
      this.firstRowDelete = false;
    }
    //alert("length" + this.ElemntsArray.length)
    this.caliculatePrice();
    this.changeDetectorRef.detectChanges();

  }
  makeValidation() {
    for (let i = 0; i < this.ElemntsArray.length; i++) {
      var inputValue = this.ElemntsArray[i].email_shared_to;
      inputValue = inputValue.trim();
      //validEmailRegEx = /^[A-Z0-9_'%=+!`#~$*?^{}&|-]+([\.][A-Z0-9_'%=+!`#~$*?^{}&|-]+)*@[A-Z0-9-]+(\.[A-Z0-9-]+)+$/i;
      //isEmailValid = validEmailRegEx.test(validEmailRegEx);
      var reg = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
      var isValid = reg.test(inputValue);
      if (isValid == false) break;
    }
    return isValid;
  }

  caliculatePrice() {
    this.price = this.discountedPrice * this.ElemntsArray.length;

  }

  closeOTS() {
    // document.getElementById('menu26').style.display = "none";
    this.ElemntsArray = [{ email_shared_to: '' }]; this.firstRowDelete = false;
    this.showError = false;
    this.exceedLimit = false;
    this.discountedPrice = 0;

  }
  setDefaultClasses() {
    if (this.ElemntsArray.length == 1) {
      for (let i = 0; i < this.maxRows; i++) {
        this.dummyImageArray[i] = "./../../assets/images/add.svg";
        this.classes[i] = "add-icon";
      }
    }
  }


}

import { Component, OnInit, OnChanges, SimpleChanges, Output, EventEmitter, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { RequestService } from './../../providers/request.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DbService } from './../../providers/db.service';
import { SessionTokenService } from '../../providers/session-token.service'
import { GET_USER_DETAILS, UPDATE_PROFILE_IMAGE, LOGOUT, BUILD_ENVIRONMENT_VERSION } from './../../urls.config';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonService } from './../../providers/common.service';
import { HighlightDelayBarrier } from 'blocking-proxy/built/lib/highlight_delay_barrier';
import { LoginService } from '../../providers/login.service'
let $ = (window as any).$;
import { MenuServiceService } from './../../providers/menu-service.service';
import { Subscription } from 'rxjs';
import { OfflineStoreService } from '../../providers/OfflineStore.service';
import { PopupServiceService } from './../../providers/popup-service.service';
import { ProfileNameService } from './../../providers/profileName.service';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidemenuComponent implements OnInit {
  message: String;
  subscription: Subscription;
  token: any;
  user: any;
  profileImage: string;

  profileName: String;
  tmpProfileImg: string;
  base64imageString = [];
  confirmLogout: boolean = false;
  confirmUpdate: boolean = false;
  showMenu: boolean = false;
  hide_closeicon: boolean;
  menue_text: boolean;
  imgeFormates: string = '.png, .jpg, .jpeg';
  profileImageError: string;
  offlineProfileImage: SafeUrl;
  @Input() network: boolean;
  buildVersion: string;
  @Input() activeMenue: string;
  tooltipName: String;

  constructor(private domSanitizer: DomSanitizer, private changeDetectorRef: ChangeDetectorRef, private menuService: MenuServiceService, public dbService: DbService, private requestService: RequestService, public sessionAndToken: SessionTokenService, private redirect: Router, private ngxService: NgxUiLoaderService, private commonService: CommonService, private LG: LoginService, private offlineStoreService: OfflineStoreService, public modalService: PopupServiceService, public profileNameService: ProfileNameService) { }

  ngOnInit() {
    let userDT = JSON.parse(localStorage.getItem('user-details'));
    let profileImg = JSON.parse(localStorage.getItem('profile-image'));
    if (profileImg != '' && profileImg != null && profileImg != undefined) {
      if (userDT['uid'] == Object.keys(profileImg)[0]) {
        this.offlineProfileImage = this.domSanitizer.bypassSecurityTrustResourceUrl(profileImg[userDT['uid']]);
      }
    }
    this.token = this.sessionAndToken.getTokenAndSession();
    this.getUserDetails();
    this.menue_text = false;
    this.hide_closeicon = false;
    $('#edit_profileicon').hide();
    this.subscription = this.menuService.getMessage().subscribe(message => {
      this.message = message;
      JSON.stringify(this.message);
      this.labelName = 'home'
    }
    );

    this.subscription = this.profileNameService.getMessage().subscribe(message => {
      this.profileName = message['profileName'];
      this.changeDetectorRef.detectChanges();
    });

  }

  ngOnChanges(changes: SimpleChanges) {
    // if (changes.sideMenuUpdate) {
    //   this.profileNameService.profileGlobalName = this.profileNameService.profileGlobalName;
    //   this.tooltipName = this.profileNameService.profileGlobalName;
    // }
    if (changes.network) {
      this.network = !changes.network.currentValue;
      $('#exampleModal').modal('hide');
      let userDT = JSON.parse(localStorage.getItem('user-details'));
      let profileImg = JSON.parse(localStorage.getItem('profile-image'));
      if (profileImg != '' && profileImg != null && profileImg != undefined) {
        if (userDT['uid'] == Object.keys(profileImg)[0]) {
          this.offlineProfileImage = this.domSanitizer.bypassSecurityTrustResourceUrl(profileImg[userDT['uid']]);
        }
      }
    }
    if (changes.activeMenue) {
      let label = changes.activeMenue.currentValue;
      let routs = this.offlineStoreService.Breadcrumb;
      let prev = routs[routs.length - 2];
      if (label.indexOf('detail') >= 0) {
        let routs = this.offlineStoreService.Breadcrumb;
        let prev = routs[routs.length - 2];
        label = prev;
      }
      if (label.indexOf('/') >= 0) {
        label = label.replace("/", "");
      }
      if (label != null && label != 'null' && label != 'logout') {
        this.labelName = label;
      }
    }
    this.changeDetectorRef.detectChanges();
  }

  getUserDetails() {
    if (navigator.onLine && !localStorage.getItem('user-profile')) {
      this.LG.getUserDetails((result) => {
        this.renderUserDetais(result);
        // this.profileNameService.renderUserDetais();
      });
    }
    else {
      this.renderUserDetais(JSON.parse(localStorage.getItem('user-profile')));
      // this.profileNameService.renderUserDetais(JSON.parse(localStorage.getItem('user-profile')));
    }
  }//getUserDetails

  renderUserDetais(result) {
    // let length = parseInt(result.length);
    // length = length - 1;
    this.user = result;
    this.profileImage = result.user_picture;
    this.tmpProfileImg = this.profileImage;
    this.commonService.userName = result.first_name;
    this.profileName = result.first_name;
    this.tooltipName = result.first_name;
    this.buildVersion = BUILD_ENVIRONMENT_VERSION.VERSION;
    this.changeDetectorRef.detectChanges();
    this.ngxService.stop();
  }

  showUpdateMsg() {
    //document.getElementById('fileName').innerHTML = "";
    this.confirmUpdate = true;
    this.confirmLogout = false;
    this.profileImage = this.tmpProfileImg;
  }

  logout() {
    if (navigator.onLine) {
      let $ = (window as any).$;
      let options = {
        'headers': {
          'Content-type': 'application/json',
          'Cookie': this.token['sess_name'] + '=' + this.token['sessid'],
          'X-Csrf-Token': this.token['token'],
          'Authorization': "Basic " + btoa("webadmin:tr1@nzadm1npa55")
        }
      }
      let res = this.requestService.get(LOGOUT, options);
      let sub = res.subscribe((data) => {
        $('.logout-dismiss').trigger('click');
        if (data && data[0]) {
          this.redirect.navigate(['login']);
        }
      },
        (error: any) => {
          $('.logout-dismiss').trigger('click');
          console.log('logout Error' + JSON.stringify(error));
        });
      setTimeout(() => { sub.unsubscribe(); this.ngxService.stop(); }, this.requestService.timeout);
    }
  }

  sendMessage(txt): void {
    // send message to subscribers via observable subject 
    this.modalService.sendMessage(txt);
  }

  /*Image API*/
  imageApi() {
    let options = {
      'headers': {
        'Content-type': 'application/json',
        'Cookie': this.token['sess_name'] + '=' + this.token['sessid'],
        'X-Csrf-Token': this.token['token'],
      },
      'withCredentials': true,
      'basi-headers': {
        'user': 'webadmin',
        'pwd': 'tr1@nzadm1npa55',
      }
    }//options
    //'Content-type': 'application/x-www-form-urlencoded',
    let image = new Object();
    image["filedetails"] = this.profileImage;
    let changeimage = this.requestService.put(UPDATE_PROFILE_IMAGE + this.token['uid'], image, options);
    changeimage.subscribe((result: any) => {
      console.log("result-->" + JSON.stringify(result))
      this.profileImage = "";
      this.getUserDetails();
    });

  }//imageApi

  /* Convert image file to Base64 */

  onUploadChange(evt: any) {
    const file = evt.target.files[0];
    const fileName = file.name;
    let index = fileName.lastIndexOf('.');
    let ext = fileName.substr(index + 1, fileName.length - 1);
    if (this.imgeFormates.indexOf(ext) == -1) {
      evt.target.value = '';
      this.profileImageError = 'Only ' + this.imgeFormates + ' are supported';
      return false;
    }
    else {
      this.profileImageError = '';
    }
    if (file) {
      const reader = new FileReader();
      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }
  }
  handleReaderLoaded(e) {
    let img = 'data:image/png;base64,' + btoa(e.target.result);
    this.profileImage = img;
  }
  /* Convert image file to Base64 */



  /*change active class on sidemenu */
  labelName: String = 'home';

  opensideNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.width = "calc(100% - 250px)";
    document.getElementById("main").style.marginLeft = "250px";
    // document.getElementById("main").style.marginTop = "40px";  
  }

  closeNav() {
    document.getElementById("mySidenav").style.width = "";
    document.getElementById("main").style.marginLeft = "";
    document.getElementById("main").style.width = "";
    // document.getElementById("main").style.marginTop = "";
  }
  menutoggle(label: any) {
    //show logout popup
    if (label == 'logout') {
      this.confirmLogout = true;
      this.confirmUpdate = false;
    }
    /* off-canvas sidebar toggle */
    $('.row-offcanvas').toggleClass('active');
    $('.collapse').toggleClass('in').toggleClass('hide_menu').toggleClass('show_menu');
    this.showMenu = !this.showMenu;

    if (this.showMenu) {
      $("#mySidenav").removeClass("decrease_width");
      $("#mySidenav").addClass("increase_width");
      //  $("#home").addClass("increase_width");
      //  $("#library").addClass("increase_width");
      //  $("#purchase").addClass("increase_width");
      //  $("#logout").addClass("increase_width");
      this.menue_text = true;
      this.opensideNav();
      $('#hamburger_hide').hide();
      this.hide_closeicon = true;
      $("#edit_profileicon").show();
    }
    else {
      $("#mySidenav").removeClass("increase_width");
      $("#mySidenav").addClass("decrease_width");
      //  $("#home").addClass("decrease_width");
      //  $("#library").addClass("decrease_width");

      //  $("#purchase").addClass("decrease_width");
      //  $("#logout").addClass("decrease_width");
      this.menue_text = false;
      this.closeNav();
      $('#hamburger_hide').show();
      this.hide_closeicon = false;
      $("#edit_profileicon").hide();
    }
  }
  closeiconNav() {
    this.showMenu = true;
    this.menutoggle(null);
    // this.hide_closeicon = false;
  }

  updateUrl(event) {
    this.profileImage = "./../assets/images/user.svg";
    this.offlineProfileImage = "./../assets/images/user.svg";
  }


}

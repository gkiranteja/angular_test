import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RequestService } from '../../providers/request.service';
import { SessionTokenService } from '../../providers/session-token.service';
import { ElectronService } from './../../providers/electron.service';
import { CommonService } from './../../providers/common.service';
import { LoginService } from './../../providers/login.service';
import { Router } from '@angular/router';
import { LOGIN, TERMS_AND_CONDITIONS, LOGIN_BODY_DETAILS, PRIVACY_AND_POLICY } from '../../urls.config';
import { OfflineStoreService } from '../../providers/OfflineStore.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
let $ = (window as any).$;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public obj: object;

  public session: string;
  public sessionName: string;
  public token: string;
  termsAndConditions: any;
  privacyPolicy: any;
  privacyPolicyText: SafeHtml;
  privacyPolicyTextFlag = false;
  loginBodyContent: any;
  termsText: SafeHtml;
  termsTextFlag = false;
  loginBodyText: string;
  whiteSpace_Username = false;
  whiteSpace_Password = false;
  header: string;
  error_msg = false;
  noSpcae: boolean = false;
  userName: string;

  constructor(private commonService: CommonService, private electronService: ElectronService, private request: RequestService, private redirect: Router, public sessionAndToken: SessionTokenService, private ngxService: NgxUiLoaderService, private OfflineStoreService: OfflineStoreService, private LG: LoginService, private domSanitizer: DomSanitizer) { }

  ngOnInit() {
    if (!navigator.onLine && !localStorage.getItem('user-details')) {
      alert('Please connect to network');
    }
    if (navigator.onLine) {
      this.getLoginBodyContent();
    }
    let uid = localStorage.getItem('offline-user');
    let userData = localStorage.getItem('user-details');
    this.electronService.remote.session.defaultSession.clearStorageData({
      storages: ['cookie']
    }, (data) => {
      console.log(data);
    });
  }

  getTermsAndConditions() {
    this.ngxService.start();
    const url = TERMS_AND_CONDITIONS + '?nid=' + 3581;
    this.termsAndConditions = {};

    this.request.get(url, { responseType: 'application/json' }).subscribe(
      (result: any) => {
        // console.log("  getTermsAndConditions success" + JSON.stringify(result))
        this.termsAndConditions = JSON.parse(result);
        console.log(' getTermsAndConditions success' + JSON.stringify(this.termsAndConditions));
        this.termsText = this.commonService.removeHtmlTags(this.termsAndConditions[0].body);
        this.header = 'Terms of Use';
        this.privacyPolicyTextFlag = false;
        this.termsTextFlag = true;
        this.ngxService.stop();
      },
      (error: any) => {
        console.log('  getTermsAndConditions Error' + JSON.stringify(error));
        this.ngxService.stop();
      },

    );
  }
  getPrivacyPolicy() {
    this.ngxService.start();
    // this.privacyPolicyText = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.';
    this.header = 'Privacy Policy';
    let url = PRIVACY_AND_POLICY + '?nid=' + 3582;
    this.privacyPolicy = {};
    let rep = this.request.get(url, { responseType: 'application/json' }).subscribe(
      (result: any) => {
        this.privacyPolicy = JSON.parse(result);
        console.log('getPrivacyPolicy success' + JSON.stringify(this.privacyPolicy));
        // this.privacyPolicyText = this.privacyPolicy[0].body.replace(/(<p[^>]+?>|<p>|<\/p>)/img, '');
        this.privacyPolicyText = this.commonService.removeHtmlTags(this.privacyPolicy[0].body);
        // setTimeout(function () {
        //   $('.terms_use_modal .modal-body').css('font-family', 'Open Sans');
        //   $('.terms_use_modal .modal-body h3').css('font-size', '20px');
        // }, 1000);
        this.privacyPolicyTextFlag = true;
        this.termsTextFlag = false;
        this.ngxService.stop();
      },
      (error: any) => {
        console.log('privacyPolicy Error' + JSON.stringify(error));
        this.ngxService.stop();
      })
    setTimeout(() => { rep.unsubscribe(); this.ngxService.stop(); }, this.request.timeout);
  }

  onClickSubmit(data) {
    this.noSpcae = false;
    console.log(JSON.stringify(data));
    this.noSpcae = false;
    this.whiteSpace_Username = false;
    this.whiteSpace_Password = false;
    this.error_msg = false;
    const val = /^\S*$/.test(data.userName);
    console.log(':::::::::::::::::::::::' + val);
    if (!val) { this.noSpcae = true; }


    if (data.userName.trim().length === 0) {
      this.whiteSpace_Username = true;
    } else if (data.password.trim().length === 0) {
      this.whiteSpace_Password = true;
    } else {
      if (this.noSpcae) { return; }
      this.ngxService.start();
      this.LG.login(data.userName, data.password, (status) => {
        if (status == 'Error') {
          this.error_msg = true;
          this.ngxService.stop();
        }
        else {
          this.redirect.navigate(['home']);
        }
      });
      // this.commonService.login(data.userName, data.password)
    }



    // if (data.userName.trim().length === 0) {
    //   alert("Please enter username or email id")
    //   return
    // } else if (data.password.trim().length === 0) {
    //   alert("Please enter password")
    //   return
    // }



    // this.ngxService.start();
    // this.commonService.login(data.userName, data.password)
  }


  /*Show Password*/
  public showPassword = 'password';
  toggleShowPassword = function () {
    if (this.showPassword === 'text') {
      this.showPassword = 'password';
    } else {
      this.showPassword = 'text';
    }
  }; // toggleShowPassword

  /*Username and password Whitespace Validation*/
  validation(data, id) {
    this.whiteSpace_Username = false;
    this.whiteSpace_Password = false;
    if (data.length > 0) {
      if (data.trim().length === 0) {
        if (id == "userName") {
          this.whiteSpace_Username = true;
        }
        if (id == "password") {
          this.whiteSpace_Password = true;
        }
      }//if(trim())
    }//if(>0)
  }//validation

  getLoginBodyContent() {
    let url;
    url = LOGIN_BODY_DETAILS + '?nid=' + 2684;
    this.termsAndConditions = {};

    let rep = this.request.get(url, { responseType: 'application/json' }).subscribe(
      (result: any) => {
        this.loginBodyContent = JSON.parse(result);
        // container is bootstrap default class, to restrict that css we are removing that class.
        this.loginBodyText = this.loginBodyContent[0].body.replace('<div class="container">', '<div>');
      },
      (error: any) => {
        console.log('LoginContentBody Error' + JSON.stringify(error));
      });
    setTimeout(() => { rep.unsubscribe(); this.ngxService.stop(); }, this.request.timeout);
  }

}

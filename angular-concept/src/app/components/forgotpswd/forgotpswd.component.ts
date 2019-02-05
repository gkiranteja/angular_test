import { Component, OnInit } from '@angular/core';
import { ElectronService } from './../../providers/electron.service';
import { Router } from '@angular/router';
import { RequestService } from '../../providers/request.service'
import { SessionTokenService } from '../../providers/session-token.service'
import { FORGOT, LOGIN_BODY_DETAILS } from '../../urls.config';
import { FormGroup } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { PopupServiceService } from './../../providers/popup-service.service';

@Component({
  selector: 'app-forgotpswd',
  templateUrl: './forgotpswd.component.html',
  styleUrls: ['./forgotpswd.component.scss']
})
export class ForgotpswdComponent implements OnInit {

  msg: String;
  validUname: boolean = false;
  forgotBodyContent: any;
  forgotBodyText: any;
  constructor(private electronService: ElectronService, private request: RequestService,
    private redirect: Router, public sessionAndToken: SessionTokenService,
    private router: Router, private ngxService: NgxUiLoaderService,
    public modalService: PopupServiceService) { }

  ngOnInit() {
    this.getForgotBodyContent();
  }

  // POST, email

  resetFlags() {
    this.msg = '';
    this.validUname = false;

  }

  onClickSubmit(data) {
    this.validUname = false;
    if (data.uname.trim().length == 0) {
      this.validUname = true;
      //alert("Enter Registered e-mail address");
      this.sendMessage('Enter Registered e-mail address');
    }

    this.electronService.remote.session.defaultSession.clearStorageData({
      storages: ['cookie']
    }, (data) => {
      console.log(data)
    })
    if (this.validUname) return;
    this.ngxService.start();
    let options = {
      headers: {
        'Content-Type': 'application/json'
      },
      'basi-headers': {
        'user': 'webadmin',
        'pwd': 'tr1@nzadm1npa55',
      }
    }
    let body = {
      name: data['uname']
    }

    let sub = this.request.post(FORGOT, body, options).subscribe(
      (result: any) => {
        this.ngxService.stop();
        if (result && result[0]) {
         // alert('The link to reset your password has been mailed to you.')
          this.sendMessage('The link to reset your password has been mailed to you.');
          this.redirect.navigate(['login']);
        }
      },
      (error: any) => {
        if (error && error.error && error.error[0]) {
          this.msg = error.error[0];
          //this.msg = this.msg.replace(/(<em[^>]+?>|<em>|<\/em>)/img, "");
          //console.log(this.msg);
          this.msg = "Please enter registered e-mail address";
          this.ngxService.stop();
        }
      }
    );
    setTimeout(() =>{ sub.unsubscribe();this.ngxService.stop();}, this.request.timeout);
  }

  getForgotBodyContent () {
    let url;
    url = LOGIN_BODY_DETAILS + '?nid=' + 2684;
    let sub = this.request.get(url, { responseType: 'application/json' }).subscribe(
      (result: any) => {
        this.forgotBodyContent = JSON.parse(result);
        //container is bootstrap default class, to restrict that css we are removing that class.
        this.forgotBodyText = this.forgotBodyContent[0].body.replace('<div class="container">', '<div>');
      },
      (error: any) => {
        console.log('ForgotBodyContent Error' + JSON.stringify(error));
      });
      setTimeout(() =>{ sub.unsubscribe();this.ngxService.stop();}, this.request.timeout);
  }
  sendMessage(txt): void {
    // send message to subscribers via observable subject 
    this.modalService.sendMessage(txt);
  }

  clearMessage(): void {
    // clear message
    this.modalService.clearMessage();
  }


}

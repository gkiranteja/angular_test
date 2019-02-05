import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
import { RequestService } from './request.service';
import { SessionTokenService } from './session-token.service';
import { OfflineStoreService } from './OfflineStore.service';
import { Router } from '@angular/router';
import { LOGIN } from './../urls.config';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Location } from '@angular/common';

@Injectable()
export class CommonService {
  userName: String;
  data: object;
  reportData: object;

  constructor(public _location: Location, private electronService: ElectronService, private request: RequestService, private redirect: Router, public sessionAndToken: SessionTokenService, private ngxService: NgxUiLoaderService) { }

  back() {
    this._location.back();
  }

  login(username, password) {
    for (var i = 1; i <= localStorage.length; i++) {
      console.log(localStorage.key(i));
    }
    // this.electronService.remote.session.defaultSession.clearStorageData({}, (data) => { 
    //   console.log(data)
    // })
    let payload = {};
    const resp = {};
    payload['username'] = username;
    payload['password'] = password;
    const options = {
      headers: {
        'Content-Type': 'application/json'
      },
    };

    this.request.post(LOGIN, payload, options).subscribe(
      (result: any) => {
        this.ngxService.stop();
        const resp = JSON.parse(JSON.stringify(result));
        this.sessionAndToken.setTokenAndSession(resp.session_name, resp.sessid, resp.token, resp.user.uid, resp.user.email, true);
        this.redirect.navigate(['home']);
      },
      (error: any) => {
        if (error.error && error.error[0]) {
          console.log("Please Enter Valid Username and Password")
          // alert(error.error[0])
          this.ngxService.stop();
        }
      }
    );
  }

  removeHtmlTags(txt) {
    // let termsText = txt;//.replace(/<[^>]*>/g, '');
    var html = txt;
    var div = document.createElement("div");
    div.innerHTML = html;
    var text = div.textContent || div.innerText || "";
    // txt = text;
    text = text.replace(/<[^>]*>/g, '');
    text = text.replace(/\s\s+/g, ' ');
    return text;
  }

}
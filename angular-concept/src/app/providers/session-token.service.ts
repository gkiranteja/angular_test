import { Injectable } from '@angular/core';
import { ElectronService } from './../providers/electron.service';

@Injectable()
export class SessionTokenService {
  public token: any;

  constructor() { }

  public setTokenAndSession(sessionName, session, token, uid, email, login) {
    this.token = {
      sessid: session,
      sess_name: sessionName,
      token: token,
      uid: uid,
      email: email,
      login: login,
    }
    console.log('offline user setted');
    // localStorage.setItem('offline-user', uid);
  }

  public getTokenAndSession() {
    return this.token;
  }

}

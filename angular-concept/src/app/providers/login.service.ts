import { Injectable } from '@angular/core';
import { LOGIN, GET_USER_DETAILS } from '../urls.config';
import { RequestService } from '../providers/request.service';
import { ElectronService } from '../providers/electron.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SessionTokenService } from '../providers/session-token.service';
import { OfflineStoreService } from '../providers/OfflineStore.service';
import { Router } from '@angular/router';
import { offline } from '../providers/offline.service';
import { PopupServiceService } from './../providers/popup-service.service';


@Injectable()
export class LoginService {

    loginAttemts = 0;
    constructor(private request: RequestService,
        private electronService: ElectronService,
        private ngxService: NgxUiLoaderService,
        private sessionAndToken: SessionTokenService,
        private router: Router,
        private offlineStoreService: OfflineStoreService,
        private offline: offline,
        public modalService: PopupServiceService
    ) { }

    profileImage(uid, url) {
        this.request.get(url, { responseType: 'blob' }).subscribe(
            (data: Blob) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    let obj = {};
                    obj[uid] = reader.result;
                    localStorage.setItem('profile-image', JSON.stringify(obj));
                };
                reader.readAsDataURL(data);
            },
            (err) => {
                console.log('Error in saving profile image', err.message);
            });
    }

    login(username, password, callBack) {
        if (!navigator.onLine) {
            if (localStorage.getItem('user-details')) {
                let user = JSON.parse(localStorage.getItem('user-details'));
                if (username == user['username'] && password == user['password']) {
                    localStorage.setItem('user-details', JSON.stringify(user));
                    this.offline.getUserReportsFolderNames();
                    this.ngxService.stop();
                    callBack('Loged-in');
                }
            }
            else {
                this.ngxService.stop();
                callBack('Error');
                return false;
            }
        }
        else {
            this.electronService.remote.session.defaultSession.clearStorageData({
                storages: ['cookies']
            }, (data) => {
                console.log(data);
            });
            const payload = {};
            const resp = {};
            payload['username'] = username;
            payload['password'] = password;
            console.log("payload is" + JSON.stringify(payload));
            const options = {
                headers: {
                    'Content-Type': 'application/json'
                },
            };

            this.request.post(LOGIN, payload, options).subscribe(
                (result: any) => {
                    const resp = JSON.parse(JSON.stringify(result));
                    this.sessionAndToken.setTokenAndSession(resp.session_name, resp.sessid, resp.token, resp.user.uid, resp.user.email || payload['username'], true);
                    let userDT = payload;
                    userDT['uid'] = resp.user.uid;
                    userDT['email'] = resp.user.mail;
                    localStorage.setItem('user-details', JSON.stringify(userDT));
                    this.offline.getUserReportsFolderNames();
                    this.ngxService.stop();
                    this.getUserDetails(() => {
                        callBack('Loged-in');
                    });
                },
                (error: any) => {
                    if (error) {
                        this.loginAttemts++
                        if (this.loginAttemts <= 3) {
                            this.login(username, password, callBack);
                        }
                        else {
                            callBack('Error');
                        }
                    }
                }
            );
        }
    }

    getUserDetails(callBack) {
        let token = this.sessionAndToken.getTokenAndSession();
        if (token) {
            let options = {
                'headers': {
                    'Content-type': 'application/json',
                    'Cookie': token['sess_name'] + '=' + token['sessid'],
                    'X-Csrf-Token': token['token'],
                },
                'withCredentials': true,
                'basi-headers': {
                    'user': 'webadmin',
                    'pwd': 'tr1@nzadm1npa55',
                }
            }//options
            this.ngxService.start();
            let get_user_details = this.request.get(GET_USER_DETAILS + token['uid'], options);
            let setTimerVal = setTimeout(() => {
                sub.unsubscribe();
                this.ngxService.stop();
            }, this.request.timeout);
            let sub = get_user_details.subscribe(
                (result: any) => {
                    clearTimeout(setTimerVal);
                    if (result.length > 0) {
                        let userDT = result[result.length - 1];
                        localStorage.setItem('user-profile', JSON.stringify(userDT));
                        this.profileImage(token['uid'], userDT['user_picture']);
                        callBack(userDT);
                    }
                    else if(result){
                        localStorage.setItem('user-profile', JSON.stringify(result));
                        this.profileImage(token['uid'], result['user_picture']);
                        callBack(result);
                    }
                },
                (err) => {
                    clearTimeout(setTimerVal);
                }
            );
        }
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
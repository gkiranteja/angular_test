import { Injectable, ApplicationRef, NgZone } from '@angular/core';
import { ElectronService } from './electron.service';
import { RequestService } from './request.service';
import { SessionTokenService } from './session-token.service';
import { Router } from '@angular/router';
import { ADDTOCART } from './../urls.config';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { PopupServiceService } from './../providers/popup-service.service';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ProfileNameService {

    private subject = new Subject<any>();
    profileGlobalName: String;
    items: any;

    constructor(public modalService: PopupServiceService, private electronService: ElectronService, private requestService: RequestService,
        private redirect: Router, public sessionAndToken: SessionTokenService, private ngxService: NgxUiLoaderService, private refreshData: ApplicationRef,
        private zone: NgZone) { }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }

    sendMessage(txt): void {
        // send message to subscribers via observable subject 
        this.modalService.sendMessage(txt);
    }
    clearMessage(): void {
        // clear message
        this.modalService.clearMessage();
    }

    renderUserDetais(userName?: string) {
        //this.profileGlobalName = result[length].first_name;
        //ref.detectChanges();
        let userDT = JSON.parse(localStorage.getItem('user-profile'));
        // let length = parseInt(userDT.length);
        // length = length - 1;
        //this.refreshData.tick();
        // this.zone.run(() => {
            this.profileGlobalName = userName ? userName : userDT.first_name;
            this.subject.next({ profileName: this.profileGlobalName });
            // this.redirect.navigate(['/refresh']);
            // setTimeout(() => {
            //     this.redirect.navigate(['/profile']);
            // }, 100);
        // });
    }

}
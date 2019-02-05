import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ElectronService } from './electron.service';
import { SessionTokenService } from './session-token.service';
import { RequestService } from './request.service';
import { DbService } from './db.service';
import { OfflineStoreService } from './OfflineStore.service';
import { BootController } from './bootControler.service';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { NgxUiLoaderService } from 'ngx-ui-loader';
let $ = (window as any).$;


@Injectable()
export class offlineMode {
    offline: boolean = false;
    fullViewRef: any;

    constructor(private electronService: ElectronService,
        private sessionAndToken: SessionTokenService,
        private offlineStoreService: OfflineStoreService,
        private router: Router,
        private ngxService: NgxUiLoaderService,
        private zone: NgZone,
        private dbService: DbService) { }
    events() {
        window.addEventListener('online', () => {
            const isLoggedIn = JSON.parse(localStorage.getItem('user-details'));

            if(isLoggedIn)
                this.offline = false;
            else
                this.offline = true;
            this.dbService.syncStatus = 1;
            this.dbService.syncWithRemoteDb();
            if (!this.offlineStoreService.paths['fullScreen']) {
                this.onlineMode();
            }
            else {
                this.offlineStoreService.store('network-switch', 'online');
            }
            if(this.fullViewRef) {
                this.fullViewRef.detectChanges();
            }
        });

        window.addEventListener('offline', () => {
            this.offline = true;
            this.dbService.syncStatus = 0;
            if (!this.offlineStoreService.paths['fullScreen'] && location.pathname.indexOf('login') == -1) {
                this.offlineMode();
            }
            else {
                this.offlineStoreService.store('network-switch', 'offline');
            }
            if(this.fullViewRef) {
                this.fullViewRef.detectChanges();
            }
        });
    }

    isOnline() {
        const isLoggedIn = JSON.parse(localStorage.getItem('user-details'));
        if(isLoggedIn)
            this.offline = false;
        else
            this.offline = true;
    }

    onlineMode() {
        // this.ngZone.runOutsideAngular(() => BootController.getbootControl().restart());
        $('#myModal').modal('hide');
        this.ngxService.start();
        this.zone.run(() => {
            this.router.navigate(['']);
        });
    }

    offlineMode() {
        $('#myModal').modal('hide');
        this.zone.run(() => {
            if (location.pathname.indexOf('mydownloads') >= 0) {
                this.router.navigate(['/refresh']);
            }
            setTimeout(() => {
                this.router.navigate(['/mydownloads']);
            }, 100);
        });
    }

}
import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { PopupServiceService } from '../app/providers/popup-service.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { OfflineStoreService } from '../app/providers/OfflineStore.service';  //'./OfflineStore.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor(public modalService: PopupServiceService, private injector: Injector, private OfflineStoreService: OfflineStoreService) { }
    handleError(err) {
        if (err && Number(err['status']) === 401) {
            let ngxService = this.injector.get(NgxUiLoaderService);
            ngxService.start();
            let msg = { text: "You have logged into multiple devices with this account. You will be logged out from this session as there is another active session running", redirect: "login" };
            this.modalService.sendMessage(JSON.stringify(msg));
        }
        else if (err && err['status']) {
            this.modalService.sendMessage('Something went wrong, please try again');
        }
        this.setLogsData(err);
    }

    setLogsData(error){
        var dataArray = [];
        let userDT = JSON.parse(localStorage.getItem('user-details'));
        let userFileName: any = this.OfflineStoreService.fetch('usersFolder');
        if (userFileName === undefined) {
            console.log("You didn't save the file");
            return;
        }
        let fs = window.require('fs');
        let dir = userFileName + '/logsData';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
            fs.writeFile(dir + '/logDataViews.txt', error+'\r\n', 'utf8', () => { 
                //console.log('created error application data') 
            });
        }else{
            fs.readFile(dir + '/logDataViews.txt', 'utf8', function(err, data) {
                var dataList = data +'\r\n'+ error+'\r\n';
                fs.writeFile(dir + '/logDataViews.txt', dataList, 'utf8', () => { 
                    //console.log('created error application data') 
                });
            });
        }
    }
}
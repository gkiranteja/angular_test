import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ElectronService } from './electron.service';
import { RequestService } from './request.service';
import { OfflineStoreService } from './OfflineStore.service';
import 'rxjs/add/operator/map';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Injectable()
export class offline {
    headers: any;
    encryptionPattren: Array<string>;
    encryptedPattrens: object;

    constructor(
        private http: HttpClient,
        private electronService: ElectronService,
        private request: RequestService,
        private ngxService: NgxUiLoaderService,
        private OfflineStoreService: OfflineStoreService) {
        this.encryptionPattren = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '3', '4', '5', '6', '7', '8', '9'];
        this.encryptedPattrens = {};
    }

    crypto(key: string, type?: string, data?: string) {
        let encryptKey = key;
        let encryptData = data ? data : '';
        let attach = 0;
        let pattren = this.encryptionPattren;
        let pattrenLen = pattren.length;
        let keyLen = encryptKey.length;
        if (keyLen) {
            if (type == 'create-encrypt-pattren') {
                this.encryptedPattrens = {};
                for (let i = 0; i < pattrenLen; i++) {
                    attach += 1;
                    for (let j = 0; j < keyLen; j++) {
                        let id = encryptKey[j] + attach;
                        this.encryptedPattrens[pattren[i]] = id;
                    }
                }
            }
            if (type == 'create-decrypt-pattren') {
                this.encryptedPattrens = {};
                for (let i = 0; i < pattrenLen; i++) {
                    attach += 1;
                    for (let j = 0; j < keyLen; j++) {
                        let id = encryptKey[j] + attach;
                        this.encryptedPattrens[id] = pattren[i];
                    }
                }
            }
            if (type === 'encrypt') {
                let nth = 100;
                if (encryptData.length > 2000) {
                    nth = 1000;
                }
                for (let k = 0; k < encryptData.length; k += nth) {
                    if (this.encryptedPattrens[encryptData[k]]) {
                        var replacer = '[[' + this.encryptedPattrens[encryptData[k]] + ']]';
                        encryptData = encryptData.substr(0, k) + replacer + encryptData.substr(k + 1);
                        k = k + (replacer.length - 1);
                    }
                }
            }
            else {
                while (encryptData.indexOf('[[') >= 0) {
                    let startIndex = encryptData.indexOf('[[');
                    let endIndex = encryptData.indexOf(']]');
                    let id = encryptData.substring(startIndex + 2, endIndex);
                    encryptData = encryptData.substr(0, startIndex) + this.encryptedPattrens[id] + encryptData.substr(endIndex + 2);
                }
            }
            return encryptData;
        }
    }

    getUserReportsFolderNames() {
        let dir = this.OfflineStoreService.fetch('trasersPath');
        let userDT = JSON.parse(localStorage.getItem('user-details'));
        if (userDT) {
            let uid = userDT['uid'];
            dir = dir + '/' + uid;
            this.electronService.fs.readdir(dir, (err, files) => {
                if (files) {
                    localStorage.setItem('user-reports', JSON.stringify(files));
                    //Auto update for download reports data based on expiryDate.
                    this.autoUpdateExpiryDates(files, uid);
                }
            });
        }
    }

    autoUpdateExpiryDates(filesData, uId) {
        let dirPath = this.OfflineStoreService.fetch('trasersPath');
        let userDT = JSON.parse(localStorage.getItem('user-details'));
        //loop the nid values
        for (var nId in filesData) {
            console.log("nId::", filesData[nId]);
            //read the JSON file and check the Expiry Date start
            let jsonPath = dirPath + '/' + uId + '/' + filesData[nId] + '/01data.json';
            let folderPath = dirPath + '/' + uId + '/' + filesData[nId] + '/images/';
            let directoryPath = dirPath + '/' + uId + '/' + filesData[nId];
            this.request.get('file:///' + jsonPath, { responseType: 'text' }).subscribe(
                (dataRes: any) => {
                    let data = JSON.parse(dataRes);
                    let createDate, expiryDateValue, expiryDate, currentDate;
                    createDate = new Date(data.created_date);
                    expiryDateValue = new Date(data.expirations_date);
                    currentDate = new Date();
                    expiryDate = expiryDateValue;
                    if (expiryDate != null && expiryDate != undefined && expiryDate != '') {
                        if (currentDate > expiryDate) {
                            this.autoUpdateDownloads(directoryPath, folderPath, jsonPath);
                        }
                    }
                });
        }
    }

    autoUpdateDownloads(directoryPath, folderPath, jsonPath) {
        let imagePath = folderPath;
        this.electronService.fs.readdir(imagePath, (err, files: Array<string>) => {
            if (files.length > 0) {
                let intialCount = 0;
                for (var elm in files) {
                    var imageFile = imagePath + files[elm];
                    if (this.electronService.fs.existsSync(imageFile)) {
                        this.electronService.fs.unlinkSync(imageFile);
                    }
                    intialCount++;
                    if (intialCount == files.length) {
                        if (this.electronService.fs.existsSync(imagePath)) {
                            this.electronService.fs.rmdirSync(imagePath);
                        }
                        if (this.electronService.fs.existsSync(jsonPath)) {
                            this.electronService.fs.unlinkSync(jsonPath);
                        }
                        let that = this;
                        setTimeout(function () {
                            if (that.electronService.fs.existsSync(directoryPath + '/')) {
                                that.electronService.fs.rmdirSync(directoryPath + '/');
                            }
                        }, 1000);

                    }
                }
            }
            if (err) {
                console.log("error:", err);
            }
        });
    }

    renderFile(buffer: ArrayBuffer, key?: string, type?: string) {
        var binary = '';
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        binary = btoa(binary);
        binary = binary.split("").reverse().join("");

        return binary;
    }

    save(fileData: object, callBack: Function) {
        let path = fileData['image'];
        this.request.get(path, { responseType: 'arraybuffer' }).subscribe(
            (file: ArrayBuffer) => {
                var dataArray = [];
                let data = this.renderFile(file);
                let userDT = JSON.parse(localStorage.getItem('user-details'));
                data = this.crypto(userDT['password'], 'encrypt', data);
                let userFileName: any = this.OfflineStoreService.fetch('usersFolder');
                if (userFileName === undefined) {
                    console.log("You didn't save the file");
                    return;
                }
                let fs = window.require('fs');
                let dir = userFileName + '/' + fileData['id'];
                let index = path.lastIndexOf('/');
                let fileName = fileData['fileName'];
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                    fs.mkdirSync(dir + '/images');
                    fs.writeFile(dir + '/01data.json', this.OfflineStoreService.fetch('currentReport'), 'utf8', () => { console.log('created application data') });
                }
                dir = dir + '/images/' + fileName;
                fs.writeFile(dir, data, (err) => {
                    if (err) {
                        callBack({
                            error: err.message
                        });
                    }
                    else {
                        callBack({
                            name: fileName,
                            status: 'sucess',
                            url: dir
                        });
                    }
                });
            },
            (err) => {
                callBack({
                    error: err.message
                });
            }
        );
    }
}
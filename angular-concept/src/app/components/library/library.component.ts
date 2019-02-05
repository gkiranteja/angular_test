import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../providers/request.service';
import { PopupServiceService } from './../../providers/popup-service.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss'],
  providers: [RequestService]
})
export class LibraryComponent implements OnInit {

  public encryptKey: string;
  public encryptionPattren: Array<string>;
  public encryptedPattrens: object;
  public library: object;
  public onlineLibraries: Array<object>;
  public offlineLibraries: Array<object>;
  public fileUrl: string;
  public pwdModal: boolean
  constructor(private request: RequestService, public modalService: PopupServiceService) {
  }

  ngOnInit() {
    this.encryptionPattren = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '3', '4', '5', '6', '7', '8', '9'];
    this.encryptedPattrens = {};
    this.onlineLibraries = [{ name: 'sample', url: '../../../assets/trianz.png' }];
  }

  crypto(key: string, data: string, type?: string) {
    let encryptKey = key;
    let encryptData = data;
    let attach = 0;
    let pattren = this.encryptionPattren;
    let pattrenLen = pattren.length;
    let keyLen = encryptKey.length;
    if (keyLen) {
      this.encryptedPattrens = {};
      for (let i = 0; i < pattrenLen; i++) {
        attach += 1;
        for (let j = 0; j < keyLen; j++) {
          let id = encryptKey[j] + attach;
          if (type === 'encrypt') {
            this.encryptedPattrens[pattren[i]] = id;
          }
          else {
            this.encryptedPattrens[id] = pattren[i];
          }
        }
      }
      if (type === 'encrypt') {
        for (let k = 0; k < encryptData.length; k++) {
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

  _arrayBufferToBase64(buffer: ArrayBuffer, key?: string, type?: string) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      // let bit = String.fromCharCode(bytes[i]);
      // binary += this.crypto(key, bit, 'encrypt');
      binary += String.fromCharCode(bytes[i]);
    }
    return binary;
  }

  saveOffline(file: object) {
    this.request.get('https://stagingapi.trasers.com/api_trasers/trasers_node_data/2393', { "basi-headers": { user: 'webadmin', pwd: 'tr1@nzadm1npa55', } }).subscribe(
      (result) => {
        this.request.get(result['downloadpdffilepath'], { responseType: 'arraybuffer' }).subscribe(
          (result: ArrayBuffer) => {
            // result = new Blob([result], { type: 'application/pdf' });
            let data = this._arrayBufferToBase64(result);
            var remote = window.require('electron').remote;
            var dialog = remote.dialog;
            dialog.showSaveDialog((userFileName) => {
              if (userFileName === undefined) {
                console.log("You didn't save the file");
                return;
              }
              let fs = window.require('fs');
              let dir = userFileName;
              let index = userFileName.lastIndexOf('/');
              let fileName = userFileName.substr(index + 1, userFileName.length - 1);
              if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
              }
              fs.writeFile(userFileName + '/' + fileName + '.pdf', data, 'binary', (err) => {
                if (err) {
                  //alert("An error ocurred creating the file " + err.message)
                  this.sendMessage("An error ocurred creating the file " + err.message)
                }
                else {
                  localStorage.setItem('offline-file-' + fileName, userFileName);
                  //alert("The file has been succesfully saved");
                  this.sendMessage("The file has been succesfully saved");
                }
              });
            });
          },
          (err) => {
            console.log('Error: ' + err);
          }
        );
      },
      (err) => { }
    );
  }

  deleteFile(name) {
    let storagte = localStorage;
    for (var key in storagte) {
      name = 'offline-file-' + name;
      if (key === name) {
        let path = localStorage.getItem(name);
        let fs = window.require('fs');
        fs.readdir(path, function (err, files) {
          files.map(function (file) {
            fs.unlink(path + '/' + file, function (err) {
            });
          });
          fs.rmdir(path, function (err) {
          });
        });
      }
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

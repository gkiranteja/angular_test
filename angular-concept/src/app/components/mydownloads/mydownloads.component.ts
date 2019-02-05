import { Component, OnInit, NgZone, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MYLIBRARY, MYLIBRARYDEL } from './../../urls.config';
import { RequestService } from './../../providers/request.service';
import { ActivatedRoute } from '@angular/router';
import { SessionTokenService } from '../../providers/session-token.service';
import { CartService } from '../../providers/cart.service';
import { OfflineStoreService } from '../../providers/OfflineStore.service';
import { offline } from '../../providers/offline.service';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ElectronService } from '../../providers/electron.service';
import { PopupServiceService } from './../../providers/popup-service.service';

@Component({
  selector: 'app-mydownloads',
  templateUrl: './mydownloads.component.html',
  styleUrls: ['./mydownloads.component.scss']
})
export class MydownloadsComponent implements OnInit {


  items: any;
  token: any;
  errorMsg: boolean = true;
  constructor(
    private electronService: ElectronService,
    private redirect: Router,
    private requestService: RequestService,
    private route: ActivatedRoute,
    public sessionAndToken: SessionTokenService,
    private ngxService: NgxUiLoaderService,
    private OfflineStoreService: OfflineStoreService,
    private zone: NgZone,
    private changeDetectorRef: ChangeDetectorRef,
    public modalService: PopupServiceService,
    private offline: offline,
    public cartService: CartService) {
    this.cartService.showCart = true;
  }

  ngOnInit() {
    this.ngxService.start();
    console.log('myDownloads');
    this.token = this.sessionAndToken.getTokenAndSession();
    this.getDownloadedItems();
  }

  goToDetials(id) {
    this.zone.run(() => {
      this.redirect.navigate(['/detail', id]);
    });
  }

  getDownloadedItems() {
    this.offlineMode();
  }

  offlineMode() {
    if (this.items) {
      for (let item of this.items) {
        this.errorMsg = false;
      }
    }
    let dir = this.OfflineStoreService.fetch('trasersPath');
    let userDT = JSON.parse(localStorage.getItem('user-details'));
    if (userDT) {
      let uid = userDT.uid;
      dir = dir + '/' + uid;
      // this.electronService.fs.readdir(dir, (err, files) => {
      // let userDT = JSON.parse(localStorage.getItem('user-details'));
      this.offline.crypto(userDT['password'], 'create-decrypt-pattren');
      let files = JSON.parse(localStorage.getItem('user-reports')) || [];
      //to get the user logs we created logsData file folder in existing environment, removed this directory while fetching the downloaded data.
      var index = files.indexOf('logsData');
      if (index > -1) {
        files.splice(index, 1);
      }
      files.forEach((file, index, array) => {
        if (this.electronService.fs.statSync(dir + '/' + file).isDirectory()) {
          let path = dir + '/' + file + '/' + '01data.json';
          this.electronService.fs.readFile(path, 'utf8', (err, result) => {
            let path = dir + '/' + file + '/images/';
            result = JSON.parse(result);
            let obj = {
              type: result["category"][0]["tag_name"],
              nid: result["node_id"],
              title: result["node_title"],
              date: result["created_date"]
            };
            let exsist = false;
            if (this.items) {
              for (let i = 0; i < this.items.length; i++) {
                if (this.items[i]['node_id'] && obj.nid) {
                  if (this.items[i]['node_id'] != obj.nid) {
                    exsist = true;
                  }
                }
              }
            }
            if (!exsist) {
              this.electronService.fs.readdir(path, (err, files: Array<string>) => {
                if (files[files.length - 1].indexOf('jpg') == -1) {
                  files.pop();
                }
                // files.sort(function (a, b) {
                //   return (Number(a.match(/(\d+)/g)[0]) - Number((b.match(/(\d+)/g)[0])));
                // });
                let tumnail = result['digital_report_s3_images'][0]['image'];
                // files.forEach((element, index, array) => {
                //   if(element['image'] == files[index]){
                //     tumnail = files[index];
                //     return false;
                //   }
                // });
                this.requestService.get('file:///' + path + tumnail, { responseType: 'text' }).subscribe(
                  (data: string) => {
                    data = this.offline.crypto(userDT['password'], '', data);
                    data = data.split("").reverse().join("");
                    obj['image'] = 'data:image/jpeg;base64,' + data;
                    this.items.push(obj);
                    this.errorMsg = false;
                    this.changeDetectorRef.detectChanges();
                  },
                  (err) => {
                    console.log('Error in encoding image');
                  }
                );
              });
              if (!this.items) {
                this.items = [];
              }
            }
          });
        }
      });
      // });
      this.ngxService.stop();
      return false;
    }
    this.ngxService.stop();
  }

  routeToDetials(e, nid) {
    e.preventDefault();
    e.stopPropagation();
    this.redirect.navigate(['/detail/' + nid]);
  }

  confirmed() {
    return confirm('Are you sure you want to remove this report from your Downloads?')
  }

  removeItem(id) {
    if (!this.confirmed())
      return;
    this.ngxService.start();
    let options = {
      'headers': {
        'Content-type': 'application/json',
        'Cookie': this.token['sess_name'] + '=' + this.token['sessid'],
        'X-Csrf-Token': this.token['token'],
      },
      'basi-headers': {
        'user': 'webadmin',
        'pwd': 'tr1@nzadm1npa55',
      }
    }
    let items = this.requestService.delete(MYLIBRARYDEL + '/' + id, options);
    items.subscribe((data) => {
      this.getDownloadedItems();
      if (data && data['msg'])
        this.sendMessage(data['msg']);
      this.ngxService.stop();
    });
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

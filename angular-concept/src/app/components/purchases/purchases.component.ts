import { Component, OnInit } from '@angular/core';
import { PURCHASES, DETAIL } from './../../urls.config';
import { RequestService } from './../../providers/request.service';
import { ActivatedRoute } from '@angular/router';
import { SessionTokenService } from '../../providers/session-token.service';
import { offline } from '../../providers/offline.service';
import { OfflineStoreService } from '../../providers/OfflineStore.service';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ElectronService } from '../../providers/electron.service';
import { PopupServiceService } from './../../providers/popup-service.service';
import { CartService } from '../../providers/cart.service';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.scss']
})
export class PurchasesComponent implements OnInit {

  items: any = [];
  token: any;
  errorMsg: Boolean = true;

  constructor(
    private electronService: ElectronService,
    private redirect: Router,
    private requestService: RequestService,
    private route: ActivatedRoute,
    public sessionAndToken: SessionTokenService,
    private ngxService: NgxUiLoaderService,
    private OfflineStoreService: OfflineStoreService,
    private offline: offline,
    public modalService: PopupServiceService,
    public cartService: CartService) {
    this.cartService.showCart = true;
  }

  ngOnInit() {
    this.token = this.sessionAndToken.getTokenAndSession();
    this.getMyPurchases();
  }

  saveFile(id) {
    this.ngxService.start();
    const options = {
      'Content-type': 'application/json',
      'Authorization': 'Basic d2ViYWRtaW46dHIxQG56YWRtMW5wYTU1',
    };
    const reports = this.requestService.get(DETAIL + '/' + id, options);
    let sub = reports.subscribe((data) => {
      this.OfflineStoreService.store('currentReport', JSON.stringify(data));

      if (data['isDownloadable']) {
        if (data['digital_report_s3_images'] != '' && data['digital_report_s3_images'] != undefined && data['digital_report_s3_images'] != null) {
          let images: Array<object> = data['digital_report_s3_images'];
          images.forEach((element, index, array) => {
            const payload = {
              id: id,
              image: element['image']
            };
            this.offline.save(payload, (result) => {
              if (result.error) {
                this.sendMessage('An error ocurred creating the file ' + result.error);
                return false;
              } else if (index === array.length - 1) {
                this.ngxService.stop();
                this.sendMessage("Report succesfully downloaded");
                this.offline.getUserReportsFolderNames();
              }
            });
          });
        }
      }
    });
  }

  sendMessage(txt): void {
    // send message to subscribers via observable subject 
    this.modalService.sendMessage(txt);
  }

  getMyPurchases() {
    this.ngxService.start();
    const options = {
      'headers': {
        'Content-type': 'application/json',
        'Cookie': this.token['sess_name'] + '=' + this.token['sessid'],
        'X-Csrf-Token': this.token['token'],
      },
      'basi-headers': {
        'user': 'webadmin',
        'pwd': 'tr1@nzadm1npa55',
      }
    };
    const lib = this.requestService.get(PURCHASES, options);
    let sub = lib.subscribe((data) => {
      this.items = data;
      if (this.items.length > 0)
        this.errorMsg = false
      this.ngxService.stop();
    });

    setTimeout(() => { sub.unsubscribe(); this.ngxService.stop(); }, this.requestService.timeout);
  }
  /*
  updateUrl(event) {
    console.log("updateurl from cart");
    console.log('list:', this.items.cart_list.length);

    for (var i = 0; i < this.cartService.items.cart_list.length; i++) {
      this.cartService.items.cart_list[i].image = "./../assets/images/result.svg";
    }
    // document.getElementById("cart_image").style.width = "70px";
    // document.getElementById("cart_image").style.height = "70px";
    // document.getElementById("cart_image").style.margin = "27px 22px";

    let floorElements = document.getElementsByClassName("upload-purchase-image img") as HTMLCollectionOf<HTMLElement>;
    if (floorElements) {
      for (let i in floorElements) {
        floorElements[i].style.width = "70px";
        floorElements[i].style.height = "70px";
        floorElements[i].style.margin = "27px 22px";
      }
    }
  }
   */

}

import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DETAIL, RATE, ADDTOCART, ADDTOLIST, ADDTOMYLIB, LOGOUT } from './../../urls.config';
import { ElectronService } from '../../providers/electron.service';
import { RequestService } from '../../providers/request.service';
import { CommonService } from '../../providers/common.service';
import { offline } from '../../providers/offline.service';
import { OfflineStoreService } from '../../providers/OfflineStore.service';
import { BookComponent } from '../book/book.component';
import { ActivatedRoute } from '@angular/router';
import { SessionTokenService } from '../../providers/session-token.service'
import { CartService } from './../../providers/cart.service';
import { Router } from '@angular/router';
import { setTimeout } from 'core-js/library/web/timers';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { reportData } from '../../interfaces/details.interface';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  id: number;
  data: any;
  token: any;

  constructor(public commonService: CommonService, public cartService: CartService, private electronService: ElectronService, private redirect: Router, private requestService: RequestService, private route: ActivatedRoute, public sessionAndToken: SessionTokenService, private offline: offline,
    private ngxService: NgxUiLoaderService, private domSanitizer: DomSanitizer, private offlineStoreService: OfflineStoreService) { }

  ngOnInit() {
    this.token = this.sessionAndToken.getTokenAndSession();
    this.route.params.subscribe(params => {
      this.ngxService.start();
      this.id = +params['id'];
      this.getDetail();
    });
  }

  getDetail() {
    let reports = this.requestService.get(DETAIL + '/' + this.id, {});
    let sub = reports.subscribe((data) => {
      //this.ngxService.stop();
      setTimeout(() => {
        this.ngxService.stop(); // stop foreground loading with 'default' id
      }, 100);
      this.data = data;
      if (this.data.article_summary != '' && this.data.article_summary != undefined && this.data.article_summary != null) {
        this.data.article_summary = this.domSanitizer.bypassSecurityTrustHtml(this.data.article_summary);
      }
    });
    setTimeout(() => { sub.unsubscribe(); this.ngxService.stop(); }, this.requestService.timeout);

  }
}

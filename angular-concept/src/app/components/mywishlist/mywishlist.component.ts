import { Component, OnInit } from '@angular/core';
import { GET_WISHLIST, SET_WISHLIST, REMOVE_WISHLIST } from './../../urls.config';
import { RequestService } from './../../providers/request.service';
import { ActivatedRoute } from '@angular/router';
import { SessionTokenService } from '../../providers/session-token.service';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-mywishlist',
  templateUrl: './mywishlist.component.html',
  styleUrls: ['./mywishlist.component.scss']
})
export class MywishlistComponent implements OnInit {

  
  wishlist: any;
  token: any;
  errorMsg: boolean = true;
  data: object;

  constructor(private redirect: Router,
    private requestService: RequestService,
    private route: ActivatedRoute, private ngxService: NgxUiLoaderService,
    public sessionAndToken: SessionTokenService) { }

  ngOnInit() {
    this.token = this.sessionAndToken.getTokenAndSession();
    this.getWishListItems();
  }

  getWishListItems() {
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
    var userData = JSON.parse(localStorage['user-details']);
    const wish = this.requestService.get(GET_WISHLIST + userData['uid'], options);
    let sub = wish.subscribe((result) => {
      this.wishlist = result;
      if(this.wishlist.length > 0 ){
        this.errorMsg = true;
      } else {
        this.errorMsg = true;
      }
      this.ngxService.stop();
    },
    (error)=>{
      console.log("error in data:,", error);
      this.ngxService.stop();
    });
    setTimeout(() =>{ this.ngxService.stop(); sub.unsubscribe(); }, this.requestService.timeout);
  }

  removeWishListItem(wpid) {
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
    const wish = this.requestService.delete(REMOVE_WISHLIST + wpid, options);
    let sub = wish.subscribe((result) => {
      this.getWishListItems();
    });
    setTimeout(() =>{ this.ngxService.stop(); sub.unsubscribe();}, this.requestService.timeout);
  }
  updateUrl(eventSno) {
    // for (var i = 0; i < this.wishlist.length; i++) {
    //   this.wishlist[eventSno].image = "./../assets/images/result.svg";
    // }
    let imageClass = 'update-failed-image' + eventSno;
    let errorElementsCss: any = document.getElementsByClassName(imageClass) as HTMLCollectionOf<HTMLElement>;
    errorElementsCss[0].style.width = "70px";
    errorElementsCss[0].style.height = "70px";
    errorElementsCss[0].style.margin = "27px 22px";
    errorElementsCss[0].src = "./../assets/images/result.svg"
  }




 
}

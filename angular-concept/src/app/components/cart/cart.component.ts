import { Component, OnInit } from '@angular/core';
import { RequestService } from './../../providers/request.service';
import { CartService } from './../../providers/cart.service';
import { CommonService } from '../../providers/common.service';
import { ActivatedRoute } from '@angular/router';
import { SessionTokenService } from '../../providers/session-token.service'
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MenuServiceService } from './../../providers/menu-service.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {

  items: any;
  token: any;

  constructor(private menuService: MenuServiceService, public commonService: CommonService, public cartService: CartService, private redirect: Router, private requestService: RequestService, private route: ActivatedRoute,
    public sessionAndToken: SessionTokenService, private ngxService: NgxUiLoaderService) {
    this.cartService.showCart = true;
    // this.cartService.appRef.detectChanges();
  }

  ngOnInit() {
    this.token = this.sessionAndToken.getTokenAndSession();
    this.cartService.showCart = true;
    this.cartService.getCartItems();
    this.cartService.appRef.detectChanges();
  }

  removeCartItem(e, id) {
    e.stopPropagation();
    this.cartService.removeCartItem(id);
  }

  toReport(nid) {
    this.redirect.navigate(['/detail/' + nid]);
  }

  checkout() {
  }

  sendMessage(): void {
    // send message to subscribers via observable subject
    this.menuService.sendMessage('Message from Home Component to App Component!');
  }

  clearMessage(): void {
    // clear message
    this.menuService.clearMessage();
  }
  updateUrl(eventSno) {
    for (var i = 0; i < this.cartService.items.cart_list.length; i++) {
      this.cartService.items.cart_list[eventSno].image = "./../assets/images/result.svg";
    }
    let imageClass = 'update-failed-image' + eventSno;
    console.log(imageClass);
    let errorElementsCss: any = document.getElementsByClassName(imageClass) as HTMLCollectionOf<HTMLElement>;
    console.log('errorElementsCss:', errorElementsCss);
    errorElementsCss[0].style.width = "70px";
    errorElementsCss[0].style.height = "70px";
    errorElementsCss[0].style.margin = "27px 22px";
    //errorElementsCss[0].src = "./../assets/images/result.svg"
  }
}

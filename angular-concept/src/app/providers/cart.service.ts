import { Injectable } from '@angular/core';
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
export class CartService {

  cartCount: number = -1;
  items: any;
  private subject = new Subject<any>();
  showCart: boolean = true;
  appRef: any;

  constructor(public modalService: PopupServiceService, private electronService: ElectronService, private requestService: RequestService,
    private redirect: Router, public sessionAndToken: SessionTokenService, private ngxService: NgxUiLoaderService) { }

  addToCart(id, addons = {}) {
    this.ngxService.start();
    let options = {
      headers: {
        'Content-type': 'application/json',
        'Cookie': this.sessionAndToken.token['sess_name'] + '=' + this.sessionAndToken.token['sessid'],
        'X-Csrf-Token': this.sessionAndToken.token['token'],
      },
    }
    let data = addons;
    let cart = this.requestService.put(ADDTOCART + '/' + id, data, options);
    cart.subscribe(
      (data) => {
        this.getCartItems(() => {
          if (data && data['msg']) {
            this.sendMessage(data['msg']);
          }
        });
        this.ngxService.stop();
      },
      (err) => {
        // this.sendMessage('Something went wrong, please try again');
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
  getCartItems(callBack?) {
    this.ngxService.start();
    let options = {
      'headers': {
        'Content-type': 'application/json',
        'Cookie': this.sessionAndToken.token['sess_name'] + '=' + this.sessionAndToken.token['sessid'],
        'X-Csrf-Token': this.sessionAndToken.token['token'],
      },
    }
    let items = this.requestService.get(ADDTOCART + '/' + this.sessionAndToken.token['uid'], options);
    items.subscribe((data) => {
      this.cartCount = data['cart_count'];
      this.subject.next({ count: data['cart_count'] });
      this.items = data;
      this.ngxService.stop();
      if (callBack) {
        callBack();
      }
    },
    (err) => {
      // this.sendMessage('Something went wrong, please try again');
      this.ngxService.stop();
    });
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
}

  removeCartItem(id) {
    this.ngxService.start();
    let options = {
      'headers': {
        'Content-type': 'application/json',
        'Cookie': this.sessionAndToken.token['sess_name'] + '=' + this.sessionAndToken.token['sessid'],
        'X-Csrf-Token': this.sessionAndToken.token['token'],
      },
    }
    let items = this.requestService.delete(ADDTOCART + '/' + id, options);
    items.subscribe((data) => {
      this.getCartItems();
      this.sendMessage('Report sucessfully deleted from the cart');
      this.ngxService.stop();
    },
    (err) => {
      // this.sendMessage('Something went wrong, please try again');
      this.ngxService.stop();
    });

  }
}
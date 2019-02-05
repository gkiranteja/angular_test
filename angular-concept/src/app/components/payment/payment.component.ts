import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RequestService } from './../../providers/request.service';
import { ActivatedRoute } from '@angular/router';
import { SessionTokenService } from '../../providers/session-token.service'
import { ElectronService } from '../../providers/electron.service'
import { Router } from '@angular/router';
import { webviewTag } from 'electron';
import { PAYMENT } from '../../../app/urls.config';
import { PopupServiceService } from './../../providers/popup-service.service';
import { CartService } from './../../providers/cart.service';
let $ = (window as any).$;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  token: any;
  options: any;
  paymentUrl: string = PAYMENT;

  constructor(public cartService: CartService, private elementRef: ElementRef, public modalService: PopupServiceService, private electronService: ElectronService, private redirect: Router, private requestService: RequestService, private route: ActivatedRoute, public sessionAndToken: SessionTokenService) {
    this.token = this.sessionAndToken.getTokenAndSession();
    this.cartService.showCart = false;
    this.options = {
      extraHeaders: 'Cookie:' + this.token['sess_name'] + '=' + this.token['sessid'] + '\n'
    }
  }

  sendMessage(txt): void {
    // send message to subscribers via observable subject 
    this.modalService.sendMessage(txt);
  }

  ngAfterViewInit() {
    let webView = this.elementRef.nativeElement.querySelector('webview')
    webView.addEventListener('did-navigate', this.captureUrl.bind(this))
  }

  captureUrl(e) {
    if (e['url'] == "https://stagingapi.trasers.com/thank-you") {
      this.cartService.showCart = true;
      this.sendMessage('Thank you for making the purchase with us.');
      this.redirect.navigate(['home']);
    } else if (e['url'] == "https://stagingapi.trasers.com/cart") {
      this.cartService.showCart = true;
      this.redirect.navigate(['cart']);
    } else if (e['url'] == "https://stagingapi.trasers.com/uc_paypal/wps/cancel") {
      this.cartService.showCart = true;
      this.redirect.navigate(['home']);
    }
  }

  ngOnInit() {
  }

}

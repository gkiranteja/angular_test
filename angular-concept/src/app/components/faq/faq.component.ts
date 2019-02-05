import { Component, OnInit } from '@angular/core';
import { FAQ } from './../../urls.config';
import { RequestService } from './../../providers/request.service';
import { CommonService } from '../../providers/common.service';
import { CartService } from '../../providers/cart.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Alert } from 'selenium-webdriver';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  public faq = [];

  constructor(private requestService: RequestService, 
    public cartService: CartService,
    private commonService: CommonService) { }

  ngOnInit() {
    this.cartService.showCart = true;
    this.getFaq();
  }
  getFaq() {
    let options = {
      'headers': {
        'Content-type': 'application/json'
      },
      'basi-headers': {
        'user': 'webadmin',
        'pwd': 'tr1@nzadm1npa55',
      }
    }
    let contacts = this.requestService.get(FAQ, options);

    contacts.subscribe((result: any) => {
      console.log("faq info : " + JSON.stringify(result));
      this.faq = result;
      // for (let i = 0; i < this.faq.length; i++) {
      //   this.faq[i].body = this.commonService.removeHtmlTags(this.faq[i].body);
      //   this.faq[i].body = this.faq[i].body.replace(/\r?\n|\r/g, ' ');
      // }
    });
  }

  getAccordianSno (eventsl) {
    (eventsl.target.parentElement.classList).toggle("active");
    let panel = (eventsl.target.parentElement).nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  }

}

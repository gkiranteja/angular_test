import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { INDUSTRY_REGION, BUILD_ENVIRONMENT_VERSION } from './../../urls.config';
import { RequestService } from './../../providers/request.service';
import { Router } from "@angular/router";
import { ReportService } from './../../providers/report.service';
import { ViewChild, ElementRef } from '@angular/core';
import { CartService } from '../../providers/cart.service';

let $ = (window as any).$;
@Component({
  selector: 'app-reports-details-popup',
  templateUrl: './report-details.component.html',
  styleUrls: ['./report-details.component.scss']
})
export class ReportDetailsComponent implements OnInit {
  business = Array['string'];
  industrys = Array['string'];
  roles = Array['string'];
  selectedBusiness: String;
  selectedIndustry: String;
  selectedRole: String;
  selectedIndustryId: number;
  selectedRoleId: number;
  storeUploaded: boolean = false;
  @ViewChild('closeModal') closeModal: ElementRef;
  constructor(public cartService: CartService, private ngxService: NgxUiLoaderService, private requestService: RequestService, private redirect: Router, private reportService: ReportService) {
    // this.redirect.routeReuseStrategy.shouldReuseRoute = function () {
    //   return false;
    // };
    this.cartService.showCart = true;
  }

  ngOnInit() {
    // this.getRolesIndustriesBusiness();
    this.storeUploaded = (BUILD_ENVIRONMENT_VERSION.IN_STOREUPLOAD == 'windows') ? true : false;
  }
}

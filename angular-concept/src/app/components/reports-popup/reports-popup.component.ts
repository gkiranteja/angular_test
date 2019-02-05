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
  selector: 'app-reports-popup',
  templateUrl: './reports-popup.component.html',
  styleUrls: ['./reports-popup.component.scss']
})
export class ReportsPopupComponent implements OnInit {
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
    this.getRolesIndustriesBusiness();
    this.storeUploaded = (BUILD_ENVIRONMENT_VERSION.IN_STOREUPLOAD == 'windows') ? true : false;
  }

  isNum(txt) {
    var numb = txt.match(/\d/g);
    if (numb) {
      numb = numb.join("");
      return numb;
    }
    else {
      return false;
    }
  }

  getRolesIndustriesBusiness() {
    let options = {
      'headers': {
        'Content-type': 'application/json'
      },
      responseType: "application/json"
    }
    //this.ngxService.start();
    let industries_regions = this.requestService.get(INDUSTRY_REGION, options);
    let sub = industries_regions.subscribe((result: any) => {
      let resp = JSON.parse(result);
      // resp.business
      this.business = [{ category_id: '450', category_name: "Board & CEO" }, { category_id: '345', category_name: "Research and Development" }, { category_id: '342', category_name: "Marketing" }, { category_id: '343', category_name: "Service Management" }, { category_id: '344', category_name: "Sales Management" }, { category_id: '346', category_name: "Supply Chain" }, { category_id: '347', category_name: "Procurement" }, { category_id: '348', category_name: "Manufacturing" }, { category_id: '349', category_name: "Finance and Accounting" }, { category_id: '350', category_name: "Human Capital" }, { category_id: '456', category_name: "Information Technology" }, { category_id: '351', category_name: "Legal" }, { category_id: '377', category_name: "CIO" }, { category_id: '283', category_name: "Cloud" }, { category_id: '285', category_name: "Analytics" }, { category_id: '284', category_name: "Digital" }, { category_id: '286', category_name: "Security" }];
      // resp.industries
      this.industrys = [{ category_id: '360', category_name: "Automotive" }, { category_id: '353', category_name: "Banking" }, { category_id: '424', category_name: "Construction and Infrastructure" }, { category_id: '425', category_name: "Consumer Products and Retail" }, { category_id: '354', category_name: "Financial Services" }, { category_id: '355', category_name: "Healthcare" }, { category_id: '352', category_name: "Hi Tech" }, { category_id: '449', category_name: "Insurance Health" }, { category_id: '363', category_name: "Insurance Life" }, { category_id: '426', category_name: "Insurance P and C" }, { category_id: '364', category_name: "Logistics" }, { category_id: '356', category_name: "Pharma" }];
      this.roles = resp.roles;
      // this.selectedIndustry = this.industrys[0]['category_id'];
      this.selectedIndustry = "360";
      this.selectedBusiness = "450";
      this.selectedRole = "";
      let userDT = JSON.parse(localStorage.getItem('user-profile'));
      userDT = userDT;
      if (!this.isNum(userDT['business_function'])) {
        for (let i = 0; i < this.business.length; i++) {
          if (userDT['business_function'] == this.business[i]['category_name']) {
            this.selectedBusiness = this.business[i]['category_id'];
            break;
          }
        }
      }
      else {
        this.selectedBusiness = userDT['business_function'].trim();
      }

      if (!this.isNum(userDT['industry'])) {
        for (let j = 0; j < this.industrys.length; j++) {
          if (userDT['industry'] == this.industrys[j]['category_name']) {
            this.selectedIndustry = this.industrys[j]['category_id'];
            break;
          }
        }
      }
      else {
        this.selectedIndustry = userDT['industry'].trim();
      }
      // this.selectedBusiness = this.business[0]['category_id'];
      // this.selectedBusiness = this.business[0]['category_id'];
      // this.reportService.setRole(this.selectedRole);
      this.reportService.setBusiness(this.selectedBusiness);
      this.reportService.setIndustry(this.selectedIndustry);
      /*for (let i = 0; i <= this.industrys.length; i++) {
        if (this.industrys[i].category_name.trim() == this.selectedIndustry.trim()) {
          this.selectedIndustry = this.industrys[i].category_name;
          break;
        
        }
      }
      for (let j = 0; j <= this.roles.length; j++) {
        if (this.roles[j].category_name.trim() == this.selectedRole.trim()) {
          this.selectedRole = this.roles[j].category_name;
          break;
        }
      }*/
      // this.selectedIndustryId = this.industrys[0]['category_id'];
      // this.selectedRoleId = this.roles[0]['category_id'];
    });
    setTimeout(() => { sub.unsubscribe(); }, this.requestService.timeout);
  }

  onClickSubmit(data) {
    this.ngxService.start();
    this.reportService.setBusiness(data.business);
    this.reportService.setIndustry(data.industry);
    this.redirect.navigate(['/home']);
    $('.modal').modal('hide').data('bs.modal', null);
    this.ngxService.stop();
  }
}

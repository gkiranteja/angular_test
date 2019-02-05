import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../providers/request.service';
import { CartService } from '../../providers/cart.service';
import { INSIGHT_NAVIGATOR_FILTER_LIST, SEARCH_INSIGHTS } from './../../urls.config';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';


interface ISearchData {
  fullTextVal: string;
  businessCatVal: string;
  fieldTechVal: string;
  fieldIndVal: string;
  reportTypeVal: string;
  pageNumber: number;
}

@Component({
  selector: 'app-insights-navigator',
  templateUrl: './insights-navigator.component.html',
  styleUrls: ['./insights-navigator.component.scss']
})
export class InsightsNavigatorComponent implements OnInit {
  filterSubscription: Subscription;
  reportSubscription: Subscription;
  public hasNoResults: boolean = false;
  pageProperties: any;
  allReports: any[] = [];
  pages: number[] = [];
  searchText: string = '';
  businessFilterList: any[];
  industriesFilterList: any[];
  reportTypeFilterList: any[];
  businessSelected: string = 'ALL';
  reportTypeSelected: string = 'ALL';
  industrySelected: string = 'ALL';
  currentPage: number = 0;
  totalPages: number = 0;
  currentQuery: ISearchData = {
    fullTextVal: '',
    businessCatVal: 'ALL',
    fieldTechVal: 'ALL',
    fieldIndVal: 'ALL',
    reportTypeVal: 'ALL',
    pageNumber: this.currentPage
  }
  public paginationStartIndex: number = 1;



  constructor(public serviceCall: RequestService,
    public router: Router,
    public ngxService: NgxUiLoaderService,
    public cartService: CartService
  ) {
    this.cartService.showCart = true;
  }

  ngOnInit() {
    this.ngxService.start();
    this.getFilterMenuOptions().then(() => {
      this.searchForData({}); //calling search with default params to get the entire list
      this.ngxService.stop();
    }).catch(() => {
      this.ngxService.stop();
    })
  }


  public getFilterMenuOptions() {
    return new Promise((resolve, reject) => {
      const options = {
        'Content-type': 'application/json',
        'Authorization': 'Basic d2ViYWRtaW46dHIxQG56YWRtMW5wYTU1',
      }
      this.filterSubscription = this.serviceCall.get(INSIGHT_NAVIGATOR_FILTER_LIST, options).subscribe((res: any) => {
        this.businessFilterList = res.business;
        this.industriesFilterList = res.industries;
        this.reportTypeFilterList = res.reporttype;
        resolve(res);
      });
    })
  }

  public searchForData(searchQuery: ISearchData | {}): void {
    this.ngxService.start();
    if (this.reportSubscription) {
      this.reportSubscription.unsubscribe();
    }
    const initialQuery: ISearchData = Object.assign({}, {
      fullTextVal: '',
      businessCatVal: 'ALL',
      fieldTechVal: 'ALL',
      fieldIndVal: 'ALL',
      reportTypeVal: 'ALL',
      pageNumber: this.currentPage
    }, searchQuery);

    let qCategoryKey = 'field_business_category';
    let qTechKey = 'field_technology';
    let qIndustryKey = 'field_industry';
    let qReportType = 'field_report_type';
    if(searchQuery['businessCatVal'] && searchQuery['businessCatVal'] != 'ALL') {
      qCategoryKey = 'field_business_category[]';
    } else {
      qCategoryKey = 'field_business_category';
    }
    if (searchQuery['fieldTechVal'] && searchQuery['fieldTechVal'] != 'ALL') {
      qTechKey = 'field_technology[]';
    } else {
      qTechKey = 'field_technology';
    }
    if (searchQuery['fieldIndVal'] && searchQuery['fieldIndVal'] != 'ALL') {
      qIndustryKey = 'field_industry[]';
    } else {
      qIndustryKey = 'field_industry';
    }
    if (searchQuery['reportTypeVal'] && searchQuery['reportTypeVal'] != 'ALL') {
      qReportType = 'field_report_type[]';
    } else {
      qReportType = 'field_report_type';
    }

    let q = '?search_api_views_fulltext={{fullTextVal}}&' + qCategoryKey + '={{businessCatVal}}&' + qTechKey +
      '={{fieldTechVal}}&' + qIndustryKey + '={{fieldIndVal}}&' + qReportType + '={{reportTypeVal}}&page={{pageNumber}}';

    // forming url to call based on search params
    let urlToCall: string = SEARCH_INSIGHTS + q;
    Object.keys(initialQuery).forEach((v) => {
      urlToCall = urlToCall.replace(`{{${v}}}`, initialQuery[v])
    });
    const options = {
      'Content-type': 'application/json',
      'Authorization': 'Basic d2ViYWRtaW46dHIxQG56YWRtMW5wYTU1',
    }
    this.hasNoResults = false;

    this.reportSubscription = this.serviceCall.get(urlToCall, options).subscribe((res: any) => {
      const { results, page_properties } = res;
      this.pageProperties = page_properties;
      this.allReports = results;
      if (!this.allReports.length) {
        this.hasNoResults = true;
      }
      this.setPages();
      this.ngxService.stop();
        document.getElementById("searchStr").focus();
    })
  }

  public changeFilter(event?: any): void {

    this.currentQuery = {
      fullTextVal: this.searchText,
      businessCatVal: this.businessSelected,
      fieldIndVal: this.industrySelected,
      reportTypeVal: this.reportTypeSelected,
      fieldTechVal: 'ALL',
      pageNumber: this.currentPage,
    }
    if (event) {
      const keyCode = (event.keyCode ? event.keyCode : event.which);
      if (keyCode == '13') {
        this.applyFilters();
      }
    }

  }

  public applyFilters(page = false): void {
    if (!page) {
      this.currentPage = 0;
      this.paginationStartIndex = 1;
      this.setPages();
    }
    this.searchForData(this.currentQuery);
  }


  public setPages(): void {
    const total_items = Number(this.pageProperties.total_items);
    const items_per_page = Number(this.pageProperties.items_per_page);
    this.totalPages = (total_items % items_per_page)
      ? Math.floor((total_items / items_per_page) + 1)
      : (total_items / items_per_page);

    const paginationEndIndex = (this.totalPages - this.paginationStartIndex >= 4) ? (this.paginationStartIndex + 4) : this.totalPages;
    this.pages = [];
    for (let c = this.paginationStartIndex; c <= paginationEndIndex; c++) {
      this.pages.push(c);
    }
  }

  public refreshFilters(): void {
    this.currentPage = 0;
    this.currentQuery = {
      fullTextVal: '',
      businessCatVal: 'ALL',
      fieldTechVal: 'ALL',
      fieldIndVal: 'ALL',
      reportTypeVal: 'ALL',
      pageNumber: this.currentPage
    };
    this.applyFilters();
  }
  public doPagination(pageNumber: number): void {
    this.currentPage = (pageNumber - 1);
    this.changeFilter();
    this.applyFilters(true);
  }

  ngOnDestroy() {
    this.reportSubscription.unsubscribe();
  }
  public changePaginationBtns(btnClicked: string) {
    if (btnClicked === 'Prev') {
      if (this.paginationStartIndex !== 1) {
        this.paginationStartIndex = this.paginationStartIndex - 1;
        this.setPages();
      }
      if (this.currentPage > 0) {
        this.currentPage = Number(this.currentPage) - 1;
        this.changeFilter();
        this.applyFilters(true);
      }
    } else {
      if (this.pages[this.pages.length - 1] !== this.totalPages) {
        this.paginationStartIndex = this.paginationStartIndex + 1;
        this.setPages();
      }
      if (this.currentPage < this.pages[this.pages.length - 1]) {
        this.currentPage = Number(this.currentPage) + 1;
        this.changeFilter();
        this.applyFilters(true);
      }
    }

  }
  public navigateToReportDetails({ nid }) {
    this.router.navigate([`/detail/${nid}`]);
  }

}

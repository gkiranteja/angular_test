import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, } from '@angular/core';
import { SidemenuComponent } from './../sidemenu/sidemenu.component';
import { CONTACT_US, SEND_FEEDBACK } from './../../urls.config';
import { RequestService } from './../../providers/request.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SessionTokenService } from '../../providers/session-token.service';
import { PopupServiceService } from './../../providers/popup-service.service';
import { NgForm } from '@angular/forms';
declare const google: any;
let $ = (window as any).$;

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactUsComponent implements OnInit {
  public contacts = [];
  showActiveData: string = "contact";
  showContacts: boolean = true;
  showSendMessage: boolean = false;
  fbFlag: boolean = false;
  fbMsg: string;
  locations = [];
  citysToFill = [];
  arrInd: number = 0;
  validationMsg: string;
  FormValidation: boolean = false;
  token: any;
  title: string;
  address1: string;
  address2: string;
  fullAddress: string;
  fax: string;
  postcode: string;
  phone: string;
  country: string;
  longitude: number;
  latitude: number;
  currentLat: number;
  currentLong: number;
  activeFlag: string;
  isMapSaved: boolean = false;

  purpose = ["Purpose", "Bulk Subscription", "Custom Research", "Analyst Workshop", "Other"];
  selectedPurpose: string;

  constructor(private requestService: RequestService, public sessionAndToken: SessionTokenService, private changeDetectorRef: ChangeDetectorRef, public modalService: PopupServiceService, private ngxService: NgxUiLoaderService) { }

  ngOnInit() {
    this.selectedPurpose = this.purpose[0];
    this.token = this.sessionAndToken.getTokenAndSession();
    this.getContacts();
    this.getUserPosition();

  }
  getUserPosition() {

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.showPosition(position);
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }
  showPosition(position) {
    this.currentLat = position.coords.latitude;
    this.currentLong = position.coords.longitude;
    console.log(this.currentLat + ";;;" + this.currentLong);
  }

  saveMapLocation(){
    this.isMapSaved = !this.isMapSaved;
  }

  getContacts() {
    let options = {
      'headers': {
        'Content-type': 'application/json'
      },
      'basi-headers': {
        'user': 'webadmin',
        'pwd': 'tr1@nzadm1npa55',
      }
    }
    let contacts = this.requestService.get(CONTACT_US, options);

    contacts.subscribe((result: any) => {
      console.log("contacts info : " + JSON.stringify(result));
      this.contacts = result;
      for (let i = 0; i < this.contacts.length; i++) {
        this.locations.push(this.contacts[i].title.toUpperCase());
      }

      this.getCurrentContact(0);
      this.fillScroll();
    });

  }

  calculateHeightOfCards() {

  }


  onSubmit(data) {
    if (this.validateSendMessageForm(data)) {
      // this.fbFlag = false;
      this.ngxService.start();
      let options = {
        'headers': {
          'Content-type': 'application/json',
          'Cookie': this.token['sess_name'] + '=' + this.token['sessid'],
          'X-Csrf-Token': this.token['token'],
        },
        'basi-headers': {
          'user': 'webadmin',
          'pwd': 'tr1@nzadm1npa55',
        }
      }
      let lib = this.requestService.put(SEND_FEEDBACK + '/' + 1, data, options);
      lib.subscribe((resData) => {
        if (resData) {
          this.fbFlag = true;
          this.ngxService.stop();
          (<HTMLFormElement>document.getElementById("contacsForm")).reset();
          this.sendMessage('Thank you for your feedback');
        }
      },
        error => {
          this.ngxService.stop();
          // this.modalService.sendMessage('Something went wrong, please try again');
        });
    }
  }

  sendMessage(txt): void {
    // send message to subscribers via observable subject 
    this.modalService.sendMessage(txt);
  }

  clearMessage(): void {
    // clear message
    this.modalService.clearMessage();
  }

  validateSendMessageForm(data) {
    this.FormValidation = false;
    this.validationMsg = "";
    if (data.full_name.trim().length == 0) {
      this.FormValidation = true;
      this.validationMsg = "Please Enter Full Name";
      return false;
    }
    if (data.email.trim().length == 0) {
      this.FormValidation = true;
      this.validationMsg = "Please Enter Email";
      return false;
    }
    if (data.email.trim().length !== 0) {
      let reg = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
      let isValid = reg.test(data.email.trim());
      if (!isValid) {
        this.FormValidation = true;
        this.validationMsg = "Email is not valid";
      }
    }
    if (data.phone.trim().length == 0) {
      this.FormValidation = true;
      this.validationMsg = "Please Enter Valid Email";
      return false;
    } 
    if (data.phone.trim().length == 0) {
        this.FormValidation = true;
        this.validationMsg = "Please Enter Phone Number";
        return false;
      }
    if (data.phone.trim().length !== 0) {
      var phoneno = /^\+?\(?([0-9]{3})?\)?[- ]?([0-9]{10,15})$/;
      let val = phoneno.test(data.phone);
      if (!(val)) {
        this.FormValidation = true;
        this.validationMsg = "Please Enter Valid Phone Number";
        return false;
      }
    }
    if (data.company.trim().length == 0) {
      this.FormValidation = true;
      this.validationMsg = "Please Enter Company Name";
      return false;
    }
    if (data.purpose.trim().length == 0 || data.purpose == "Purpose") {
      this.FormValidation = true;
      this.validationMsg = "Please Select Purpose";
      return false;
    }
    if (data.message.trim().length == 0) {
      this.FormValidation = true;
      this.validationMsg = "Please Enter Your Message";
      return false;
    }
    if (this.validationMsg === "") {
      this.FormValidation = true;
      return true;

    }
  }
  getCurrentTab(key) {
    this.FormValidation = false;
    this.validationMsg = "";
    this.showActiveData = key;
    this.showContacts = !this.showContacts;
    this.showSendMessage = !this.showSendMessage;
    if (this.showContacts)
      this.fillScroll();
    //alert(this.showContacts + ":::::::::::" + this.showSendMessage);
  }
  getCurrentContact(index) {
    this.title = this.contacts[index].title;
    this.address1 = this.contacts[index].address1;
    this.address2 = this.contacts[index].address2;
    this.fax = this.contacts[index].fax;
    this.postcode = this.contacts[index].postcode;
    this.phone = this.contacts[index].phone;
    this.country = this.contacts[index].country;
    this.longitude = parseFloat(this.contacts[index].longitude);
    this.latitude = parseFloat(this.contacts[index].latitude);
    this.fullAddress = this.address1 + " " + this.address2;
    this.changeDetectorRef.detectChanges();
  }

  getSelectedCityInfo(city, index) {
    this.activeFlag = city.toUpperCase();
    console.log(city + "index is " + index)
    for (let i = 0; i < this.contacts.length; i++) {
      if (city == this.contacts[i].title.toUpperCase()) {
        break;
      }
      console.log(i);
      console.log(JSON.stringify(this.contacts[i]));
      this.getCurrentContact(i + 1)
    }

  }

  showLargeMap() {
    var url = "https://www.google.co.in/maps/search/" + this.address1 + this.address2;
    window.open(url);
  }
  fillScroll() {
    try {
      var curArrInd = this.arrInd;
      this.getCurrentContact(this.arrInd);

      for (var i = 0; i < 9; i++) {
        curArrInd = curArrInd >= this.locations.length ? 0 : curArrInd;
        //console.log("i value" + i + "curArrind ? " + curArrInd + " value is " + this.locations)
        // document.getElementById("loc" + i).innerHTML = this.locations[curArrInd];
        this.citysToFill[i] = this.locations[curArrInd];
        curArrInd++;
      }
      this.activeFlag = this.citysToFill[0].toUpperCase();
      this.changeDetectorRef.detectChanges();
      console.log("City's to fill" + this.citysToFill);
    } catch (e) {
      console.log("Error in contactus fillScroll()" + e);
    }

  }

  scrollLeft() {
    this.arrInd--;
    if (this.arrInd <= 0) this.arrInd = this.locations.length;
    this.fillScroll();

  }
  scrollRight() {
    this.arrInd++;
    if (this.arrInd >= this.locations.length) this.arrInd = 0;
    this.fillScroll();

  }

}
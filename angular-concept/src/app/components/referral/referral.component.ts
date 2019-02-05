import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { REFERRAL } from './../../urls.config';
import { RequestService } from './../../providers/request.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SessionTokenService } from '../../providers/session-token.service';
import { PopupServiceService } from './../../providers/popup-service.service';
import { MenuServiceService } from './../../providers/menu-service.service';
import { CartService } from '../../providers/cart.service';
let $ = (window as any).$;


@Component({
  selector: 'app-referral',
  templateUrl: './referral.component.html',
  styleUrls: ['./referral.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReferralComponent implements OnInit {
  token: any;
  id: number = 0;
  ElemntsArray = [0];
  userEmail: string;
  maxRows: number = 3;
  firstRowDelete:boolean = false;
  dummyImageArray = ["./../assets/images/add.svg", "./../assets/images/add.svg", "./../assets/images/add.svg"];
  classes = ["add-icon", "add-icon", "add-icon"];
  allReferrelas = [];
  showError: boolean = false;
  exceedLimit: boolean = false;
  showResponseStatus: boolean = false;
  showResponse: any;
  selectedOption: string = 'SELECT';
  selectedOptionValue: any;
  allOptions: any = [{id: 377, name: "Boards and CEO"}, { id: 450, name:"CIO"}, {id:458, name:"Others" }];
  allOptionsIndex: any = [100,377,450,458];
  constructor(public cartService: CartService, private changeDetectorRef: ChangeDetectorRef, private requestService: RequestService, public sessionAndToken: SessionTokenService, private menuService: MenuServiceService, private ngxService: NgxUiLoaderService, public modalService: PopupServiceService) {
    this.token = this.sessionAndToken.getTokenAndSession();
    this.cartService.showCart = true;
  }

  ngOnInit() {
    let userObj = JSON.parse(localStorage.getItem('user-profile'));
    this.userEmail = userObj.email_address;
  }
  createFileds() {
    var input = document.createElement("input");
    input.setAttribute("type", 'text');
    input.classList.add("dropdown", "col-sm-3");
    input.placeholder = "Eneter Email";
  }

  addNewFiled(index?: number) {
    this.showResponseStatus = false;
    if(this.ElemntsArray.length >=3) {
      this.exceedLimit = true;
      return false;
    } else {
      this.exceedLimit = false;
      let status = this.makeValidation();
      if(!status) {
         return false;
      }
    }
    
    this.id++;
    let existsElm = true, pushedElem;
    var exist1 = this.ElemntsArray.indexOf(0);
    if(exist1 == -1 && existsElm){
      existsElm = false; pushedElem=0;
    }
    var exist2 = this.ElemntsArray.indexOf(1);
    if(exist2 == -1 && existsElm){
      existsElm = false; pushedElem=1;
    }
    var exist3 = this.ElemntsArray.indexOf(2);
    if(exist3 == -1 && existsElm){
      existsElm = false; pushedElem=2;
    }
    this.ElemntsArray.push(pushedElem);
    let arrayLength = this.ElemntsArray.length;
    if(arrayLength > 1){
      this.firstRowDelete  =true;
    } else {
      this.firstRowDelete  =false;
    }
    this.dummyImageArray[pushedElem] = "./../assets/images/multiply.svg";
    this.classes[pushedElem] = "cross-icon";
    this.changeDetectorRef.detectChanges();
  }

  makeValidation() {
    this.showError = false;
    // let isValidate = [];
    let errorFlag = [];
    for (let i = 0; i < this.ElemntsArray.length; i++) {
        var inputValue = (<HTMLInputElement>document.getElementById('email-' + this.ElemntsArray[i])).value;
        inputValue = inputValue.trim();
        //validEmailRegEx = /^[A-Z0-9_'%=+!`#~$*?^{}&|-]+([\.][A-Z0-9_'%=+!`#~$*?^{}&|-]+)*@[A-Z0-9-]+(\.[A-Z0-9-]+)+$/i;
        //isEmailValid = validEmailRegEx.test(validEmailRegEx);
        var reg = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
        var isValid = reg.test(inputValue);

        var DropdownList = (document.getElementById('role-' + this.ElemntsArray[i])) as HTMLSelectElement;
        var SelectedIndex = DropdownList.selectedIndex; // no error

        if (!isValid || SelectedIndex == 0 ){
          this.showError = true;
          errorFlag.push(false); 
        }
    }
    if(errorFlag.length >=1) {
      return false;
    }else {
      return true;
    }

  }

  RemoveFiled(index) {
    console.log("passing index" + index + "before splicing Elements Array" + this.ElemntsArray + "and index is " + this.id);
    index = parseInt(index)
    this.showResponseStatus = false;
    this.exceedLimit = false;
    if (this.ElemntsArray.length <= 1) return; 
    console.log();
    if (this.id >= 1) this.id--;
    if (this.id <= 0) this.id = 0;
    var exist = this.ElemntsArray.indexOf(index);
    if (exist > -1) {
      this.ElemntsArray.splice(exist, 1);
    }
    if(this.ElemntsArray.length > 1){
      this.firstRowDelete  =true;
    } else {
      this.firstRowDelete  =false;
    }
    console.log("firstRowDelete:", this.firstRowDelete, this.id);

    this.setDefaultClasses();
    this.changeDetectorRef.detectChanges();
  }

  setDefaultClasses() {
    if (this.ElemntsArray.length == 1) {
      this.dummyImageArray = ["./../assets/images/add.svg", "./../assets/images/add.svg", "./../assets/images/add.svg"];
      this.classes = ["add-icon", "add-icon", "add-icon"];
    }
  }
  saveReferral() {
    //check the email validations:
    console.log(this.ElemntsArray.length, this.selectedOption);
    let validEmailRegEx, isEmailValid;
    this.allReferrelas = [];
    this.showError = false; this.exceedLimit=false; this.showResponseStatus=false;
    let status = this.makeValidation();
    if(!status) {
      this.showError = true;
      return false;
   }
    try {
      console.log(this.ElemntsArray.length);
      this.allReferrelas = [];
      let referralObj = [];
      for (var i = 0; i < this.ElemntsArray.length; i++) {
        var inputValue = (<HTMLInputElement>document.getElementById('email-' + this.ElemntsArray[i])).value;
        var DropdownList = (document.getElementById('role-' + this.ElemntsArray[i])) as HTMLSelectElement;
        var SelectedIndex = this.allOptionsIndex[DropdownList.selectedIndex]; // no error
        var obj = {};
        obj['referred_by'] = this.userEmail;
        obj['referral_email'] = inputValue;
        obj['role_id'] = SelectedIndex;
        referralObj.push(obj)
      }
      let obj1 = {
        'referral': referralObj 
      }
      this.postReferrals(obj1);

    } catch (e) {
      console.log("Error in getReferral()" + e);
    }
  }

  postReferrals(data) {
    this.ngxService.start();
    try {
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
      let response = this.requestService.put(REFERRAL + '/' + this.token['uid'], data, options);
      response.subscribe((resp) => {
        this.showResponseStatus = true;
        if (resp && resp['msg']) {
          this.ElemntsArray = [0]; this.firstRowDelete = false;
          $('#email-0').val("");
          $('#role-0 option').prop('selected', function() {
            return this.defaultSelected;
          });
    
          this.showResponse = resp['msg'];
          $('#submitmodal').modal('show');
        }
        this.ngxService.stop();
        this.changeDetectorRef.detectChanges();
      }, 
      error =>{
        // this.modalService.sendMessage('Something went wrong, please try again');
        this.ngxService.stop();
        this.changeDetectorRef.detectChanges();
      });

    } catch (e) { console.log("Error in postReferral" + e) }
  }



}

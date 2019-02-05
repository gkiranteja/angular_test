import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GET_USER_DETAILS, JOB_ROLES, INDUSTRY_REGION, COUNTRIES, STATES, UPDATE_PROFILE_DETAILS, UPDATE_PROFILE_IMAGE, CHANGE_PASSWORD } from './../../urls.config';
import { RequestService } from './../../providers/request.service';
import { SessionTokenService } from '../../providers/session-token.service';
import { LoginService } from '../../providers/login.service';
let $ = (window as any).$;
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonService } from './../../providers/common.service';
import { Router } from '@angular/router';
import { ProfileNameService } from './../../providers/profileName.service';
import { PopupServiceService } from './../../providers/popup-service.service';
import { OfflineStoreService } from '../../providers/OfflineStore.service';
import { CartService } from '../../providers/cart.service';
import { ReportService } from './../../providers/report.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {
  token: any;
  showDetails: boolean = false;
  EditDetails: boolean = false;
  functions = Array['string'];
  countries = Array['string'];
  states = Array['string'];
  industrys = Array['string'];
  base64imageString = [];
  selectedCountry: String;
  prevSelectedCountry: String;
  selectedState: String;
  selectedBusiness: String;
  selectedIndustry: String;
  selectedIndustryName: any;
  user: any;
  options: any;
  errorMsg: String;
  dataValidation: boolean = false;
  successFlag: boolean = false;
  successMsg: String;
  passwordMsg: String;
  isCountryChanged: boolean = false;
  pswdFlag: boolean = false;
  constructor(public cartService: CartService, private changeDetectorRef: ChangeDetectorRef, private requestService: RequestService, public sessionAndToken: SessionTokenService, private ngxService: NgxUiLoaderService, private commonService: CommonService, private LG: LoginService, private redirect: Router,  public profileNameService: ProfileNameService, public modalService: PopupServiceService, private offlineStoreService: OfflineStoreService, private reportService: ReportService) {
    this.token = this.sessionAndToken.getTokenAndSession();
    this.cartService.showCart = true;
    if (navigator.onLine) {
      this.getUserDetails(true, false);
    } else {
      this.getUserDetails(false, false);
    }
  }

  ngOnInit() {
    let isUpdate = this.offlineStoreService.fetch('updatedUserName');
    if(isUpdate){
      this.offlineStoreService.store('updatedUserName', false);
      this.successFlag = true;
      this.successMsg = "Profile updated successfully";
      setTimeout(function(){
        this.successFlag = false;
      }, 2000);
    }
   }
  buttonsubmit() { console.log("buttonsubmit"); $("#submitbutton").trigger('click'); }
  EditProfile(type) {

    this.dataValidation = false;
    this.isCountryChanged = false
    this.prevSelectedCountry = this.selectedCountry;

    if (this.showDetails) {
      this.showDetails = false;
      this.EditDetails = true;
    } else {
      this.showDetails = true;
      this.EditDetails = false;
    }
    let that = this;
    setTimeout(() => {
      that.successFlag = false;
      if (type) {
        that.redirect.navigate(['/login']);
      }
      that.changeDetectorRef.detectChanges();
    }, 3000)

  }//EditProfile
  getUserDetails(type, editType) {
    if (localStorage.getItem('user-profile') && type == false) {
      this.renderUserDetails(JSON.parse(localStorage.getItem('user-profile')), editType);
    }
    else {
      this.LG.getUserDetails((data) => {
        this.renderUserDetails(data, editType);
      });
    }
  }
  renderUserDetails(result, editType) {
    console.log("profile obj" + JSON.stringify(result)); console.log(1)
    // let length = parseInt(result.length);
    // length = length - 1;
    // this.user = result[length];
    // this.base64imageString.push(result[length].user_picture);
    // this.commonService.userName = result[length].first_name;
    // this.getRolesIndustriesBusiness()
    // this.getAllCountries();
    // let length = parseInt(result.length);

    // if (length == 0) return;

    this.user = result;
    console.log("user obj" + JSON.stringify(this.user));
    this.base64imageString.push(result.user_picture);
    this.commonService.userName = result.first_name;
    this.getRolesIndustriesBusiness();
    this.getAllCountries();
    this.EditProfile(editType);
    this.ngxService.stop();
  }

  getRolesIndustriesBusiness() {
    let options = {
      'headers': {
        'Content-type': 'application/json'
      },
      responseType: "application/json"
    }
    this.ngxService.start();
    let industries_regions = this.requestService.get(INDUSTRY_REGION, options);
    let sub = industries_regions.subscribe((result: any) => {

      let business_functions = JSON.parse(result);
      this.functions = business_functions.business;
      this.industrys = business_functions.industries;
      for (let i = 0; i != this.functions.length; i++) {
        if (this.functions[i].category_name.trim() == this.user.business_function.trim()) {
          this.selectedBusiness = this.functions[i].category_id;
          this.ngxService.stop();
        }//if
      }//for
      for (let j = 0; j <= this.industrys.length; j++) {
        if (this.industrys[j].category_id.trim() == this.user.industry.trim()) {
          this.selectedIndustry = this.industrys[j].category_name;
          this.selectedIndustryName = this.industrys[j].category_id;

          this.changeDetectorRef.detectChanges();
          break;
        }
      }
    });

    setTimeout(() => { sub.unsubscribe(); this.ngxService.stop(); }, this.requestService.timeout);
  }


  getAllCountries() {
    console.log("in GEt Countries");
    let options = {
      'headers': {
        'Content-type': 'application/json'
      },
      responseType: "application/json"
    }
    this.ngxService.start();

    let countriess = this.requestService.get(COUNTRIES, options);
    let sub = countriess.subscribe((result: any) => {
      this.countries = JSON.parse(result);

      for (let i = 0; i != this.countries.length; i++) {
        if (this.countries[i].country_name == this.user.country) {

          this.selectedCountry = this.countries[i].country_code + "@@" + this.countries[i].country_id;
          this.getStates(this.selectedCountry);
        }//if
      }//for

      this.ngxService.stop();
    });

    setTimeout(() => { sub.unsubscribe(); this.ngxService.stop(); }, this.requestService.timeout);
  }//getAllCountries

  isSatateChanged() {
    this.isCountryChanged = false;
  }

  getStates(selectedCountry) {
    this.isCountryChanged = true;
    let options = {
      'headers': {
        'Content-type': 'application/json'
      },
      responseType: "application/json"
    }
    this.ngxService.start();
    var selectedCountry = selectedCountry;
    if (selectedCountry.includes("@@")) {
      var res = selectedCountry.split("@@");
      selectedCountry = res[1].trim();
    }
    let countriess = this.requestService.get(STATES + selectedCountry, options);
    let sub = countriess.subscribe((result: any) => {

      this.states = JSON.parse(result);
      this.ngxService.stop();
      for (let i = 0; i != this.states.length; i++) {
        if (this.states[i].zone_name.trim() == this.user.state.trim()) {
          this.selectedState = this.states[i].zone_code;
        }//if
      }//for
      //this.ngxService.stop();
    });

    setTimeout(() => { sub.unsubscribe(); this.ngxService.stop(); }, this.requestService.timeout);

    console.log("details--" + this.selectedCountry + this.selectedState + this.selectedBusiness);
  }//getStates



  onSubmit(userForm) {
    try {
      console.log("in onSubmit(userForm)" + JSON.stringify(userForm));

      //alert(userForm.first_name)

      this.successFlag = false;
      this.pswdFlag = false;

      let options = {
        'headers': {
          'Content-type': 'application/json',
          'Cookie': this.token['sess_name'] + '=' + this.token['sessid'],
          'X-Csrf-Token': this.token['token'],
        },
        'withCredentials': true,
        'basi-headers': {
          'user': 'webadmin',
          'pwd': 'tr1@nzadm1npa55',
        }
      }//options


      var selectedCountry = userForm.country;
      if (selectedCountry.includes("@@")) {
        var res = selectedCountry.split("@@");
        selectedCountry = res[0].trim();
      }

      /**Validation */

      this.dataValidation = false;

      /*first Name*/
      if (userForm.first_name.trim().length === 0) {
        this.dataValidation = true;
        this.errorMsg = "Please Enter First Name";
        return false;
      }

      if (userForm.first_name.trim().length !== 0) {
        if (userForm.first_name.trim().length > 60 && userForm.first_name.trim().length < 2) {
          this.dataValidation = true;
          this.errorMsg = "First Name Should be Below 60 chars";
          return false;
        } else {
          let val = /^[a-zA-Z ]+$/.test(userForm.first_name);
          if (!(val)) {
            this.dataValidation = true;
            this.errorMsg = "Please Enter Valid First Name";
            return false;
          }//if
        }
      }

      /*last Name*/
      if (userForm.last_name.trim().length === 0) {
        this.dataValidation = true;
        this.errorMsg = "Please Enter Last Name";
        return false;
      }
      if (userForm.last_name.trim().length !== 0) {
        if (userForm.last_name.trim().length > 60 && userForm.last_name.trim().length < 2) {
          this.dataValidation = true;
          this.errorMsg = "Last Name Should be Below 60 chars";
          return false;
        } else {
          let val = /^[a-zA-Z ]+$/.test(userForm.last_name);
          if (!(val)) {
            this.dataValidation = true;
            this.errorMsg = "Please Enter Valid Last Name";
            return false;
          }
        }
      }

      /*Phone No*/
      if (userForm.phone.trim().length === 0) {
        this.dataValidation = true;
        this.errorMsg = "Please Enter Valid Phone Number";
        return false;
      }
      if (userForm.phone.trim().length !== 0) {
        var phoneno = /^\+?\(?([0-9]{3})?\)?[- ]?([0-9]{10,15})$/;
        // var phoneno =/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;   
        let val = phoneno.test(userForm.phone);
        if (!(val)) {
          this.dataValidation = true;
          this.errorMsg = "Please Enter Valid Phone Number";
          return false;
        }
      }
      /**address 1 */
      if (userForm.address1.trim().length === 0) {
        this.dataValidation = true;
        this.errorMsg = "Please Enter Address Line 1";
        return false;
      } if (userForm.address1.trim().length !== 0) {
        if (parseFloat(userForm.address1.trim()).toString() == userForm.address1.trim().toString()) {
          this.dataValidation = true;
          this.errorMsg = "Please Enter Valid Address Line 1";
          return false;
        } else {
          let val = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/? ]+$/.test(userForm.address1);
          if (val) {
            this.dataValidation = true;
            this.errorMsg = "Please Enter Valid Address Line 1";
            return false;
          }
        }

      }
      // else{     
      //   let val=/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/? ]+$/.test(userForm.address1);
      //   this.dataValidation = true;
      //   this.errorMsg="Please Enter Valid Address Line 1";
      //   return false;  
      // }

      /*city*/
      if (userForm.city.trim().length === 0) {
        this.dataValidation = true;
        this.errorMsg = "Please Enter City";
        return false;
      }
      if (userForm.city.trim().length !== 0) {
        let val = /^[a-zA-Z ]+$/.test(userForm.city);
        if (!(val)) {
          this.dataValidation = true;
          this.errorMsg = "Please Enter City";
          return false;
        }
      }
      /**postal code */
      if (userForm.postcode.trim().length !== 0) {
        let val = /^[a-zA-Z0-9-]+$/.test(userForm.postcode);
        let val1 = /^[a-zA-Z-]+$/.test(userForm.postcode);
        if (!(val)) {
          this.dataValidation = true;
          this.errorMsg = "Please Enter valid Postal Code";
          return false;
        }
        if (val1) {
          this.dataValidation = true;
          this.errorMsg = "Please Enter valid Postal Code";
          return false;
        }
      }
      /*org*/
      if (userForm.organization_name.trim().length !== 0) {
        if (parseFloat(userForm.organization_name.trim()).toString() == userForm.organization_name.trim().toString()) {
          this.dataValidation = true;
          this.errorMsg = "Please Enter Valid Organization Name";
          return false;
        } else {
          let val = /^[a-zA-Z0-9 ]+$/.test(userForm.organization_name);
          if (!(val)) {
            this.dataValidation = true;
            this.errorMsg = "Please Enter Valid Organization Name";
            return false;
          }
        }
      }
      /*
      //these are the optional params
      if (userForm.organization_name.trim().length == 0) {
        this.dataValidation = true;
        this.errorMsg = "Please Enter Organization Name";

      }
      //job role
      if (userForm.job_role.trim().length == 0) {
        this.dataValidation = true;
        this.errorMsg = "Please Enter Job Role";

      }
      */
      if (userForm.job_role.trim().length !== 0) {
        let val = /^[a-zA-Z]+$/.test(userForm.job_role);
        if (!(val)) {
          this.dataValidation = true;
          this.errorMsg = "Please Enter Only Characters for Job Title";
          return false;
        }
      }

      /*job role*/

      /*password      */
      // if (userForm.old_password.trim().length!== 0) {
      //   if (userForm.new_password.trim().length===0 ||userForm.confirm_password.trim().length===0 ) {
      //     this.dataValidation = true;
      //     this.errorMsg="Please Enter Valid New Password and Confirm Password ";
      //     return false;
      //   }else if (!(userForm.new_password.trim() == userForm.confirm_password.trim())) {         
      //     this.dataValidation = true; 
      //     this.errorMsg="New and Confirm Passwords don't match";
      //     return false;
      //   }
      // }
      //password  

      /* password */
      let oldPwd = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/.test(userForm.old_password.trim());
      let newPwd = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/.test(userForm.new_password.trim());
      let cnfPwd = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/.test(userForm.confirm_password.trim());
      console.log("oldPwd ? " + oldPwd + "newpwd ? " + newPwd + "cnf pwd" + cnfPwd);
      if (userForm.old_password.trim().length == 0 && (userForm.new_password.trim().length !== 0 || userForm.confirm_password.trim().length !== 0)) {

        if (!newPwd && userForm.new_password.trim().length !== 0)
          this.errorMsg = "New Password should contain atleast one Number,character and special character ";
        else if (!cnfPwd && userForm.confirm_password.trim().length !== 0)
          this.errorMsg = "Confirm Password should contain atleast one Number,character and special character ";
        else
          this.errorMsg = "Please Enter Old Password";

        this.dataValidation = true;
        return false;
      }
      if (userForm.new_password.trim().length == 0 && (userForm.confirm_password.trim().length !== 0 || userForm.old_password.trim().length !== 0)) {

        if (!oldPwd && userForm.old_password.trim().length !== 0)
          this.errorMsg = "Old Password should contain atleast one Number,character and special character ";
        else if (!cnfPwd && userForm.confirm_password.trim().length !== 0)
          this.errorMsg = "Confirm Password should contain atleast one Number,character and special character ";
        else
          this.errorMsg = "Please Enter New Password";
        this.dataValidation = true;
        return false;
      }
      if (userForm.confirm_password.trim().length == 0 && (userForm.old_password.trim().length !== 0 || userForm.new_password.trim().length !== 0)) {

        if (!newPwd && userForm.new_password.trim().length !== 0)
          this.errorMsg = "New Password should contain atleast one Number,character and special character ";
        else if (!oldPwd && userForm.old_password.trim().length !== 0)
          this.errorMsg = "Old Password should contain atleast one Number,character and special character ";
        else
          this.errorMsg = "Please Enter Confirm Password";
        this.dataValidation = true;
        return false;
      }




      if (userForm.old_password.trim().length !== 0) {
        // if(userForm.new_password.trim().length < 8 || userForm.new_password.trim().length < 8 || userForm.confirm_password.trim().length < 8){
        //   this.dataValidation = true; 
        //   this.errorMsg="Password should be minimum of 8 characters";
        // }
        let oldPwd = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/.test(userForm.old_password.trim());
        let newPwd = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/.test(userForm.new_password.trim());
        let cnfPwd = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/.test(userForm.confirm_password.trim());
        console.log(oldPwd + "::nw::" + newPwd + "::cnpwd::" + cnfPwd);
        if (!oldPwd || !newPwd || !cnfPwd) {
          this.dataValidation = true;
          if (!oldPwd) {
            this.errorMsg = "Old Password should contain atleast one Number,character and special character";
            return false;
          }
          else if (!newPwd) {
            this.errorMsg = "New Password should contain atleast one Number,character and special character";
            return false;

          }

        }
        else if (userForm.new_password.trim().length === 0 || userForm.confirm_password.trim().length === 0) {
          this.dataValidation = true;
          this.errorMsg = "Please Enter Valid New Password and Confirm Password ";
          return false;
        } else if (!(userForm.new_password.trim() == userForm.confirm_password.trim())) {
          this.dataValidation = true;
          this.errorMsg = "New and Confirm Passwords should be same";
          return false;
        } else if (userForm.old_password == userForm.new_password) {
          this.dataValidation = true;
          this.errorMsg = "Old and New Passwords should not be same";
          return false;
        }

      }
      /*password*/
      if (userForm.old_password == userForm.new_password && (userForm.old_password != '' && userForm.new_password != '')) {
        this.dataValidation = true;
        this.errorMsg = 'Old Password and New Password should not be same';
        return false;
      }
      if (userForm.new_password !== userForm.confirm_password && (userForm.new_password != '' && userForm.confirm_password != '')) {
        this.dataValidation = true;
        this.errorMsg = 'New Password and Confirm Password shoud be same';
        return false;
      }


      /* conditions to select a state , if new country changed*/
      console.log("prev" + this.prevSelectedCountry + ":: current :: " + userForm.country + ":::: " + userForm.state + "is country chnaged" + this.isCountryChanged);
      if (this.prevSelectedCountry != undefined) {
        if (this.prevSelectedCountry != userForm.country && this.isCountryChanged == true) {
          this.dataValidation = true;
          this.errorMsg = "Please Select state";
          return false;
        };
      }
      if (userForm.country.trim().length == 0) {
        this.dataValidation = true;
        this.errorMsg = "Please Select Country";
        return false;
      }
      if (userForm.state.trim().length == 0) {
        this.dataValidation = true;
        this.errorMsg = "Please Select State";
        return false;
      }
      /* conditions to select a state , if new country changed*/
      /* industry */
      if (userForm.industry.trim().length == 0) {
        this.dataValidation = true;
        this.errorMsg = "Please Select Industry";
        return false;
      } console.log(16)

      /* industry */


      /**User Data Object */
      let editData = {};
      editData["honorofic"] = this.user.honorofic;
      editData["first_name"] = userForm.first_name.trim();
      editData["last_name"] = userForm.last_name.trim();
      editData["phone"] = userForm.phone.trim();
      editData["address1"] = userForm.address1.trim();
      editData["address2"] = userForm.address2;
      editData["country"] = selectedCountry;
      editData["state"] = userForm.state;
      editData["city"] = userForm.city;
      editData["postcode"] = userForm.postcode.trim();
      editData["job_role"] = userForm.job_role;
      editData["organization_name"] = userForm.organization_name;
      editData["industry"] = userForm.industry;
      editData["businessfunction"] = userForm.business_function;
      editData["twitter"] = userForm.twitter;
      editData["facebook"] = userForm.facebook;
      editData["linkedIn"] = userForm.linkedIn;
      editData["addressid"] = userForm.address1, userForm.address2; console.log(17)

      /*Profile Details API*/

      console.log("payload" + JSON.stringify(editData)); console.log("payload");
      let updateMessage = this.requestService.put(UPDATE_PROFILE_DETAILS + this.token['uid'], editData, options);
      updateMessage.subscribe((result: any) => {
        console.log("update profile" + JSON.stringify(result));
        if (result.msg == "Failure") {
          this.dataValidation = true;
          this.errorMsg = "Profile Not Updated!";
        }//if
        else {
          if (userForm.old_password != '' && userForm.new_password != '' && userForm.confirm_password != '') {
            this.passwordApi(userForm.old_password, userForm.new_password, userForm.confirm_password, userForm.first_name);
          } else {
            this.successFlag = true;
            this.successMsg = "Profile Updated Successfully";
            this.reportService.setBusiness(editData['businessfunction']);
            this.reportService.setIndustry(editData['industry']);        
            this.getUserDetails(true, false);
            this.profileNameService.renderUserDetais(userForm.first_name);
            this.offlineStoreService.store('updatedUserName', true);
            // this.EditProfile(false);
            this.isCountryChanged = false;
          }
        }
      },
      (err) => {
        // this.sendMessage('Something went wrong, please try again');
        this.ngxService.stop();
      });
    } catch (e) { console.log(e) }

  }//onSubmit

  sendMessage(txt): void {
    // send message to subscribers via observable subject 
    this.modalService.sendMessage(txt);
  }

  clearMessage(): void {
    // clear message
    this.modalService.clearMessage();
  }


  /*Password API*/


  passwordApi(old_password, new_password, confirm_password, userName) {

    this.dataValidation = false;

    if (!(old_password == "")) {
      if (old_password.trim().length === 0) {
        this.dataValidation = true;
        this.errorMsg = "Please Enter Valid Old Password";
        return false;
      }
      if (new_password == "" || confirm_password == "" || new_password.trim().length === 0 || confirm_password.trim().length === 0) {
        this.dataValidation = true;
        this.errorMsg = "Please Enter Valid New Password and Confirm Password ";
        return false;
      }
      else if (!(new_password == confirm_password)) {
        this.dataValidation = true;

        this.errorMsg = "New and Confirm Passwords don't match";
        return false;
      }
      else {
        let options = {
          'headers': {
            'Content-type': 'application/json',
            'Cookie': this.token['sess_name'] + '=' + this.token['sessid'],
            'X-Csrf-Token': this.token['token'],
          },
          'withCredentials': true,
          'basi-headers': {
            'user': 'webadmin',
            'pwd': 'tr1@nzadm1npa55',
          }
        }//options
        let passwordData = {};
        passwordData["currentPassword"] = old_password;
        passwordData["newPassword"] = confirm_password;
        let updatePassword = this.requestService.put(CHANGE_PASSWORD + this.token['uid'], passwordData, options);
        updatePassword.subscribe((result: any) => {
          //let msg=JSON.parse(result);
          if (result.status == "Failure") {
            this.dataValidation = true;
            this.errorMsg = result.msg;
            // this.successFlag = true;
            // this.successMsg = "Profile Updated Successfully";  
            this.changeDetectorRef.detectChanges();
          }//if
          else {
            this.pswdFlag = true;
            // this.passwordMsg = "Password Changed Successfully";
            this.passwordMsg = "Profile Updated Successfully";
            this.getUserDetails(true, true);
            this.profileNameService.renderUserDetais(userName);
            this.offlineStoreService.store('updatedUserName', true);
            // this.EditProfile(true);
            this.isCountryChanged = false;
            this.changeDetectorRef.detectChanges();
          }
        });
      }//else
    }//if
  }//passwordApi

}

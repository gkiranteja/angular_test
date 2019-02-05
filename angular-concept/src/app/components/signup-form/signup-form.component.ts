import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../providers/request.service'
import { RegMenuDetailsService } from '../../providers/reg-menu-details.service'
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { INDUSTRY_REGION, COUNTRIES, STATES, REGISTER } from './../../urls.config';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss']
})
export class SignupFormComponent implements OnInit {
  user: any;
  signupPayload: any;
  industrys = Array['string'];
  functions = Array['string'];
  regions = Array['string'];
  selectedRegion: number = 0;
  selectedIndustry: number = 0;
  selectedFunction: number = 0;
  selectedCountry: number = 0;
  selectedState: number = 0;
  isValidFormSubmitted: any;
  termsAnsPolacy: any;
  dataValidation: any;
  errorMsg: any;
  selectedStateName : string ="ap";

  public RolesIndustriesBusinessResp: any;
  public listOfCountrys: any;
  public listOfStates: any;
  public signUpSuccess = true;


  constructor(private request: RequestService, private RegMenuData: RegMenuDetailsService, private redirect: Router) { }

  ngOnInit() {
    // this.industrys = ['health', 'power','IT']; 
    // this.functions= ['Toyota', 'Honda','Chevrolet']; 
    // this.regions = ['Toyota', 'Honda','Chevrolet']; 
    this.user = {
      //initialized with some data
      fname: "",
      lname: "",
      oname: "",
      email: "",
      password: { pwd: "", confirm_pwd: "" },
      isTCAccepted: false,
      industry: '',
      functions: '',
      regions: '',
      phnum: "",
      city: "",
      zone: "",
      pinCode: "",
      address: ""
    };
    this.getRolesIndustriesBusiness();
    this.getAllCountries();
  }

  getRolesIndustriesBusiness() {
    let options = {
      'headers': {
        'Content-type': 'application/json'
      },
      responseType: "application/json"
    }
    this.request.get(INDUSTRY_REGION, options).subscribe(
      (result: any) => {
        // console.log("RegMenuDetailsService  getRolesIndustriesBusiness success" + JSON.stringify(result))
        this.RolesIndustriesBusinessResp = JSON.parse(result);
        this.RegMenuData.setRolesIndustriesBusinessData(this.RolesIndustriesBusinessResp);
        this.user.industry = this.RolesIndustriesBusinessResp.industries;
        console.log("this.user.industry::::", this.user.industry);
        this.user.functions = this.RolesIndustriesBusinessResp.business;
        this.user.regions = this.RolesIndustriesBusinessResp.roles;
        this.selectedRegion = this.user.regions[0]['category_id'];
        this.selectedIndustry = this.user.industry[0]['category_id']; 
        this.selectedFunction = this.user.functions[0]['category_id'];
      },
      (error: any) => {
        console.log("RegMenuDetailsService  getRolesIndustriesBusiness Error" + JSON.stringify(error))
        this.RolesIndustriesBusinessResp = error;
        // this.RegMenuData.setRolesIndustriesBusinessData(this.RolesIndustriesBusinessResp);
      });
  }


  getAllCountries() {
    let options = {
      'headers': {
        'Content-type': 'application/json'
      },
      responseType: "application/json"
    }
    this.request.get(COUNTRIES, options).subscribe(
      (result: any) => {
        this.listOfCountrys = JSON.parse(result);
        this.selectedCountry = this.listOfCountrys[0].country_id;
        // this.RegMenuData.setAllcountrysList(this.RolesIndustriesBusinessResp);        
        console.log("selectedCountry::::" + this.selectedCountry);
        this.getStates(this.listOfCountrys[0].country_id);
        //console.log("RegMenuDetailsService  getAllCountries success" + JSON.stringify(result)) 
      },
      (error: any) => {
        console.log("RegMenuDetailsService  getAllCountries Error" + JSON.stringify(error))
        this.listOfCountrys = error;
        // this.RegMenuData.setAllcountrysList(this.RolesIndustriesBusinessResp);
      })
  }
  getStates(selectedCountry) {
    var selectedCountry = selectedCountry;
    if (selectedCountry.includes(":")) {
      var res = selectedCountry.split(":");
      selectedCountry = res[1].trim();
    }
    let options = {
      'headers': {
        'Content-type': 'application/json'
      },
      responseType: "application/json"
    }
    this.request.get( STATES + selectedCountry, options).subscribe(
      (result: any) => {
        this.listOfStates = JSON.parse(result);
        // this.RegMenuData.setAllcountrysList(this.RolesIndustriesBusinessResp);
        this.selectedState = this.listOfStates[0].zone_id;
        console.log("selectedState is ? " + this.selectedState)
        // console.log("  getStates success" + JSON.stringify(result))
      },
      (error: any) => {
        console.log("getStates   Error" + JSON.stringify(error))
        this.listOfStates = error;
      })
  }

  validateFormData(userForm) {

    /**Validation */
    this.dataValidation = false;

    /*first Name*/
    if (userForm.fname.trim().length === 0) {
      this.dataValidation = true;
      this.errorMsg = "Please enter first name";
      return false;
    } else {
        if (userForm.fname.trim().length > 60 || userForm.fname.trim().length < 2) {
          this.dataValidation = true;
          this.errorMsg = "First name should be in between 2 to 60 chars";
          return false;
        } else {
          let val = /^[a-zA-Z ]+$/.test(userForm.fname);
          if (!(val)) {
            this.dataValidation = true;
            this.errorMsg = "Please enter only characters for first name";
            return false;
          }
        }
    }
    /*last Name*/
    if (userForm.lname.trim().length === 0) {
      this.dataValidation = true;
      this.errorMsg = "Please enter last name";
      return false;
    } else {
      if (userForm.lname.trim().length > 60 || userForm.lname.trim().length < 2) {
        this.dataValidation = true;
        this.errorMsg = "Last name should be in between 2 to 60 chars";
        return false;
      } else {
        let val = /^[a-zA-Z ]+$/.test(userForm.lname);
        if (!(val)) {
          this.dataValidation = true;
          this.errorMsg = "Please enter only characters for last name";
          return false;
        }
      }
    }
    /* email */
    if (userForm.email.trim().length == 0) {
      this.dataValidation = true;
      this.errorMsg = "Please enter email";
      return false;
    }
    if (userForm.email.trim().length !== 0) {
      let reg = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
      let isValid = reg.test(userForm.email.trim());
      if (!isValid) {
        this.dataValidation = true;
        this.errorMsg = "Email is not valid";
        return false;
      }
    }
    /* password */
    if (userForm.password.pwd.trim().length === 0) {
      this.dataValidation = true;
      this.errorMsg = "Please enter password";
      return false;
    } else {
      let pwd = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/.test(userForm.password.pwd.trim());
      if(!pwd){
        this.dataValidation = true;
        this.errorMsg = "Password should contains 8-16 character length and atleast one number,character and special character";
        return false;
      }
    }
    if (userForm.password.confirmPwd.trim().length === 0) {
      this.dataValidation = true;
      this.errorMsg = "Please enter confirm password";
      return false;
    } else {
      let cnfPwd = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/.test(userForm.password.confirmPwd.trim());
      if(!cnfPwd){
        this.dataValidation = true;
        this.errorMsg = "Confirm Password should contains 8-16 character length and atleast one number,character and special character";
        return false;
      }
    }
    if(userForm.password.pwd !== userForm.password.confirmPwd) {
      this.dataValidation = true;
      this.errorMsg = "Password and confirm passwords should be same";
      return false;
    }
    /*org*/
    if (userForm.orgname.trim().length == 0) {
      this.dataValidation = true;
      this.errorMsg = "Please enter organization name";
      return false;
    }else {
      let val = /^[a-zA-Z0-9 ]+$/.test(userForm.orgname);
      if (!(val)) {
        this.dataValidation = true;
        this.errorMsg = "Please enter valid organization name";
        return false;
      }
    }
    /*industry*/
     if (userForm.industry.trim().length == 0) {
      this.dataValidation = true;
      this.errorMsg = "Please enter industry name";
      return false;
    }else {
      let val = /^[a-zA-Z0-9 ]+$/.test(userForm.industry);
      if (!(val)) {
        this.dataValidation = true;
        this.errorMsg = "Please enter valid industry name";
        return false;
      }
    }
    /* Function*/
    if (userForm.Function.trim().length == 0) {
      this.dataValidation = true;
      this.errorMsg = "Please enter function name";
      return false;
    }else {
      let val = /^[a-zA-Z0-9 ]+$/.test(userForm.function);
      if (!(val)) {
        this.dataValidation = true;
        this.errorMsg = "Please enter valid function name";
        return false;
      }
    }
    /* region */
    if (userForm.region.trim().length == 0) {
      this.dataValidation = true;
      this.errorMsg = "Please enter region name";
      return false;
    }else {
      let val = /^[a-zA-Z0-9 ]+$/.test(userForm.region);
      if (!(val)) {
        this.dataValidation = true;
        this.errorMsg = "Please enter valid region name";
        return false;
      }
    }
    /* tc */
    if (userForm.tc !== true) {
      this.dataValidation = true;
      this.errorMsg = "Please accept terms and conditions";
      return false;
    }
     /* countrys*/
    if (userForm.countrys.trim().length == 0) {
      this.dataValidation = true;
      this.errorMsg = "Please enter country name";
      return false;
    }else {
      let val = /^[a-zA-Z0-9 ]+$/.test(userForm.countrys);
      if (!(val)) {
        this.dataValidation = true;
        this.errorMsg = "Please enter valid country name";
        return false;
      }
    }
    /* states */
    if (userForm.states.trim().length == 0) {
      this.dataValidation = true;
      this.errorMsg = "Please enter state name";
      return false;
    }else {
      let val = /^[a-zA-Z0-9 ]+$/.test(userForm.states);
      if (!(val)) {
        this.dataValidation = true;
        this.errorMsg = "Please enter valid state name";
        return false;
      }
    }
    /* city */
    if (userForm.city.trim().length == 0) {
      this.dataValidation = true;
      this.errorMsg = "Please enter city name";
      return false;
    }else {
      let val = /^[a-zA-Z0-9 ]+$/.test(userForm.city);
      if (!(val)) {
        this.dataValidation = true;
        this.errorMsg = "Please enter valid city name";
        return false;
      }
    }
    /* address */
    if (userForm.address.trim().length == 0) {
      this.dataValidation = true;
      this.errorMsg = "Please enter office address";
      return false;
    }

    /* pinCode */
    if (userForm.pinCode.trim().length == 0) {
      this.dataValidation = true;
      this.errorMsg = "Please enter pinCode name";
      return false;
    }else {
      let val = /^[0-9 ]+$/.test(userForm.pinCode);
      if (!(val)) {
        this.dataValidation = true;
        this.errorMsg = "Please enter valid pinCode";
        return false;
      }
    }
    /*Phone No*/
    if (userForm.phnum.trim().length === 0) {
      this.dataValidation = true;
      this.errorMsg = "Please enter valid phone number";
      return false;
    }
    if (userForm.phnum.trim().length !== 0) {
      var phoneno = /^\+?\(?([0-9]{3})?\)?[- ]?([0-9]{10,15})$/;
      // var phoneno =/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;   
      let val = phoneno.test(userForm.phnum);
      if (!(val)) {
        this.dataValidation = true;
        this.errorMsg = "Please enter valid phone number";
        return false;
      }
    }
    
   return true;
  }

  onSubmit(data) {
    console.log("Entered Email id : " + JSON.stringify(data));
    if(! this.validateFormData(data)) {
      return false; 
    }
    this.signupPayload = {};

    this.signupPayload['mail'] = data.email;
    this.signupPayload['pass'] = data.password.pwd;
    this.signupPayload['pass1'] = data.password.confirmPwd;
    this.signupPayload['status'] = 1;
    var address = {};
    address['phone'] = data.phnum;
    address['first_name'] = data.firstname;
    address['last_name'] = data.lastname;
    address['city'] = data.city;
    address['zone'] = data.states;
    address['postal_code'] = data.pinCode;
    address['ucxf_industry'] = data.industry;
    address['ucxf_job_title'] = data.region;
    address['ucxf_business_function'] = data.Function;
    address['street1'] = data.address;
    this.signupPayload['address'] = address;
    // console.log(JSON.stringify(this.signupPayload))
    //alert(JSON.stringify(this.signupPayload))
    this.signup();
  }

  signup() {
    let options = {
      'headers': {
        'Content-type': 'application/json'
      },
      responseType: "application/json"
    }
    this.request.post(REGISTER, this.signupPayload, options).subscribe(
      (result: any) => {
        // console.log("  signup success" + JSON.stringify(result))
        this.signUpSuccess = true;
        //console.log("success msg" +  signup success"\n{\"uid\":\"5280\",\"uri\":\"https://stagingapi.trasers.com/api_trasers/user/5280\"}" );
        //this.redirect.navigateByUrl('login');
        // this.redirect.navigate(['login']);
        (<HTMLFormElement>document.getElementById("signupForm")).reset();
      },
      (error: any) => {
        console.log("  signup Error" + JSON.stringify(error));
        this.signUpSuccess = false;
      })
  }


}

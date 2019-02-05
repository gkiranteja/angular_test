import { Injectable } from '@angular/core'; 
import {RequestService} from './request.service'

@Injectable()
export class RegMenuDetailsService {
  public  RolesIndustriesBusinessResp : any;
  public  allCountrysInfo :any;
  constructor(private request : RequestService) { }
  
 getRolesIndustriesBusinessData(){

  return this.RolesIndustriesBusinessResp;
 }
 setRolesIndustriesBusinessData(respData){
   this.RolesIndustriesBusinessResp = respData;

 }

 getAllcountrysList(){

  return this.allCountrysInfo;
 }
 setAllcountrysList(respData){
   this.allCountrysInfo = respData;

 }


 
 

}

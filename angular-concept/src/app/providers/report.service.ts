/*import { Injectable } from '@angular/core'; 

@Injectable()
export class ReportService {
  roleId: number;
  industryId: number;

  constructor() { }

  setRole(id) {
    alert("from service role" + id)
    this.roleId = id;
  }
  setIndustry(id) {
    alert("from service industry" + id)
    this.industryId = id;
  }

  getRole() {
    return this.roleId;
  }
  getIndustry() {
    return this.industryId;
  }
}*/

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ReportService {
  private bussiness = new Subject<any>();
  private industry = new Subject<any>();
  private roleData: any = {};

  sendData() {
    return this.roleData;
  }
  // setRole(message: any) {
  //   this.roleData.roleId = message;
  //   this.role.next({ text: message });
  // }
  setBusiness(message: any) {
    this.roleData.bussinessId = message;
    this.bussiness.next({ text: message });
  }
  setIndustry(message: any) {
    this.roleData.industryId = message;
    this.industry.next({ text: message });
  }
  getIndustry(): Observable<any> {
    return this.industry.asObservable();
  }
  getBussines(): Observable<any> {
    return this.bussiness.asObservable();
  }
  clearIndustry() {
    this.industry.next();
  }
  clearRole() {
    this.bussiness.next();
  }

}


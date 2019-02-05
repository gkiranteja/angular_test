import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-resetpswd',
  templateUrl: './resetpswd.component.html',
  styleUrls: ['./resetpswd.component.scss']
})
export class ResetpswdComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  onClickSubmit(data) {
    console.log("username is: " + JSON.stringify(data)); 
  }

}

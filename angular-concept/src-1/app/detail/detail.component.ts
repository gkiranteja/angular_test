import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-detail',
  //templateUrl: './detail.component.html',
  template: `
     <app-register [parentCount]="count"></app-register>
  `,
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  count: number = 10;

  constructor() { }

  ngOnInit() {
  }

}

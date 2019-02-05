import { Component, OnInit, Input, Output, EventEmitter, } from '@angular/core';
import { Router } from '@angular/router';
// import { PopupServiceService } from './../../providers/popup-service.service';
// import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.scss']
})
export class PopUpComponent implements OnInit {
  @Input() message: any;
  @Output() close = new EventEmitter();
  routeTo: string = '';
  text: any;

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.text = this.message;
    if (this.message.indexOf('{') >= 0) {
      let msg = JSON.parse(this.message);
      this.text = msg['text'];
      this.routeTo = msg['redirect'];
    }
  }

  closeAlertModal() {
    this.close.emit();
    //document.getElementById('alert_modal').style.display = "none";
    if (this.message.indexOf('{') >= 0) {
      localStorage.removeItem('user-details');
      if (this.routeTo == 'login') {
        this.router.navigate(['']);
        this.routeTo = '';
      }
    }
  }

}

import { Component, OnInit, HostListener } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { setTimeout } from 'core-js/library/web/timers';
import { OfflineStoreService } from '../../providers/OfflineStore.service';
import { VERSION_CHECK, LOGIN } from './../../urls.config';
import { RequestService } from '../../providers/request.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SessionTokenService } from '../../providers/session-token.service';
import { ElectronService } from './../../providers/electron.service';
import { PopupServiceService } from './../../providers/popup-service.service';
let $ = (window as any).$;

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss']
})
export class SplashComponent implements OnInit {

  img: string = ''
  imageUrlArray = []
  loaded: boolean;
  online: boolean;
  constructor(public modalService: PopupServiceService, private router: Router, private electronService: ElectronService, private offlineStoreService: OfflineStoreService, private requestService: RequestService, public sessionAndToken: SessionTokenService, private ngxService: NgxUiLoaderService) {

  }
  ngOnInit() {
    if (!navigator.onLine) {
      alert('Please connect to internet');
      const remote = window.require('electron').remote;
      let win = remote.getCurrentWindow();
      win.close();
    }
    else {
      localStorage.setItem('splashScreen', 'true');
    }
    console.log('splash screen');
    this.img = "./../assets/images/splash.jpg",
      this.loaded = true
    this.functionNr1();
  }
  @HostListener('mouseover') onMouseOver() {
    $('.carousel').carousel({
      pause: "false"
    });
  }

  functionNr1() {
    setTimeout(() => {
      this.loaded = false
      let $ = (window as any).$;
      setTimeout(function () {
        $('#myCarouseltutorial').carousel({ interval: 3000, cycle: true });
      }, 100);
    }, 3000);
  }

  goLogin() {
    this.router.navigate(['login'])
  }

  clearMessage(): void {
    // clear message
    this.modalService.clearMessage();
  }
}


import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler  } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgxUiLoaderModule } from 'ngx-ui-loader';

import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ElectronService } from './providers/electron.service';
import { CommonService } from './providers/common.service';
import { CartService } from './providers/cart.service';
import { offline } from './providers/offline.service';
import { RequestService } from './providers/request.service';
import { RegMenuDetailsService } from './providers/reg-menu-details.service';
import { SessionTokenService } from './providers/session-token.service';
import { OfflineStoreService } from './providers/OfflineStore.service';
import { Base64 } from './providers/base64.service';
import { LoginService } from './providers/login.service';
import { RouteCondition } from './providers/routecondition.service';
import { offlineMode } from './providers/offlineMode.service';
import { BootController } from './providers/bootControler.service';
import { DbService } from './providers/db.service';
import { ProfileNameService } from './providers/profileName.service';

import { WebviewDirective } from './directives/webview.directive';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LibraryDetailsComponent } from './components/libraryDetails/libraryDetails.component';
import { LibraryComponent } from './components/library/library.component';
import { BookComponent } from './components/book/book.component';
import { DetailComponent } from './components/detail/detail.component';
import { ForgotpswdComponent } from './components/forgotpswd/forgotpswd.component';
import { LoginComponent } from './components/login/login.component';
import { LoginSuccessComponent } from './components/login-success/login-success.component';
import { ResetpswdComponent } from './components/resetpswd/resetpswd.component';
import { SignupFormComponent } from './components/signup-form/signup-form.component';
import { TermsAndPolacyComponent } from './components/terms-and-polacy/terms-and-polacy.component';
import { MylibraryComponent } from './components/mylibrary/mylibrary.component';
import { CartComponent } from './components/cart/cart.component';
import { PaymentComponent } from './components/payment/payment.component';
import { SidemenuComponent } from './components/sidemenu/sidemenu.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MywishlistComponent } from './components/mywishlist/mywishlist.component';
import { SplashComponent } from './components/splash/splash.component';
import { PurchasesComponent } from './components/purchases/purchases.component';
import { ThankyouComponent } from './components/thankyou/thankyou.component';
import { NewsComponent } from './components/news/news.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { PopUpComponent } from './components/pop-up/pop-up.component';
import { MenuServiceService } from './providers/menu-service.service';
import { PopupServiceService } from './providers/popup-service.service';
import { ReferralComponent } from './components/referral/referral.component';
import { InsightsNavigatorComponent } from './components/insights-navigator/insights-navigator.component';
import { Refresh } from './components/refresh/refresh.component';
import { FaqComponent } from './components/faq/faq.component';
import { AgmCoreModule } from '@agm/core';
import { ReportService } from './providers/report.service';
import { ReportsPopupComponent } from './components/reports-popup/reports-popup.component';
import { GlobalErrorHandler } from '../app/errorhandling';
import { MydownloadsComponent } from './components/mydownloads/mydownloads.component';
import {ReportDetailsComponent} from './components/report-details/report-details.component'




// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    WebviewDirective,
    HomeComponent,
    LibraryDetailsComponent,
    LibraryComponent,
    BookComponent,
    DetailComponent,
    ForgotpswdComponent,
    LoginComponent,
    LoginSuccessComponent,
    ResetpswdComponent,
    SignupFormComponent,
    TermsAndPolacyComponent,
    MylibraryComponent,
    CartComponent,
    PaymentComponent,
    ProfileComponent,
    MywishlistComponent,
    SidemenuComponent,
    ProfileComponent,
    SplashComponent,
    PurchasesComponent,
    ThankyouComponent,
    NewsComponent,
    ContactUsComponent,
    PopUpComponent,
    ReferralComponent,
    InsightsNavigatorComponent,
    Refresh,
    FaqComponent,
    ReportsPopupComponent,
    MydownloadsComponent,
    ReportDetailsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule,
    NgxUiLoaderModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    }),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAJ1nT9W3-vnGOpQ-l6wZcnD02TSbmE_F8'
    })
  ],
  providers: [ReportService, PopupServiceService, MenuServiceService, DbService, CartService, ProfileNameService, ElectronService, RequestService, RegMenuDetailsService, SessionTokenService, offline, CommonService, OfflineStoreService, Base64, RouteCondition, LoginService, offlineMode, BootController,  {
    provide: ErrorHandler, 
    useClass: GlobalErrorHandler
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }


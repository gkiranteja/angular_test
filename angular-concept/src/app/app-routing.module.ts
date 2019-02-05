import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { LibraryComponent } from './components/library/library.component';
import { CartComponent } from './components/cart/cart.component';
import { MylibraryComponent } from './components/mylibrary/mylibrary.component';
import { BookComponent } from './components/book/book.component';
import { DetailComponent } from './components/detail/detail.component';
import { PaymentComponent } from './components/payment/payment.component';
import { PurchasesComponent } from './components/purchases/purchases.component';
// import { HomeComponent } from './components/home/home.component';
// import { LibraryComponent } from './components/library/library.component';
import { LibraryDetailsComponent} from './components/libraryDetails/libraryDetails.component';
import { LoginComponent } from './components/login/login.component';
import { ResetpswdComponent } from './components/resetpswd/resetpswd.component';
import { ForgotpswdComponent } from './components/forgotpswd/forgotpswd.component';
import { SignupFormComponent } from './components/signup-form/signup-form.component';
import { LoginSuccessComponent } from './components/login-success/login-success.component';
import { TermsAndPolacyComponent } from './components/terms-and-polacy/terms-and-polacy.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MywishlistComponent } from './components/mywishlist/mywishlist.component';
import { SplashComponent } from './components/splash/splash.component';
import { ThankyouComponent } from './components/thankyou/thankyou.component';
import { NewsComponent } from './components/news/news.component';
import { InsightsNavigatorComponent } from './components/insights-navigator/insights-navigator.component';
import { ReferralComponent } from './components/referral/referral.component';
import { Refresh } from './components/refresh/refresh.component';

import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { FaqComponent } from './components/faq/faq.component';
import { RouteCondition } from '../app/providers/routecondition.service';
import { MydownloadsComponent } from './components/mydownloads/mydownloads.component';
import { ReportDetailsComponent } from "./components/report-details/report-details.component";

// const routes: Routes = [
//     {
//         path: '',
//         component: HomeComponent
//     },
//     {
//         path: 'library',
//         component: LibraryComponent
//     }
// ];

const routes: Routes = [
    {
        path: '',
        canActivate: [RouteCondition],
        component: SplashComponent
    },
    {
        path: 'refresh',
        component: Refresh
    },
    {
        path: 'contact',
        component: ContactUsComponent

    },
    {
        path: 'payment',
        component: PaymentComponent

    },
    {
        path: 'news/:id',
        component: NewsComponent

    },
    {
        path: 'thankyou',
        component: ThankyouComponent

    },
    {
        path: 'reportdetails',
        component: ReportDetailsComponent

    },
    {
        path: 'mypurchases',
        component: PurchasesComponent

    },
    {
        path: 'login',
        component: LoginComponent

    },
    {
        path: 'home',
        component: HomeComponent

    },
    {
        path: 'login-success',
        component: LoginSuccessComponent

    },
    {
        path: 'resetpswd',
        component: ResetpswdComponent
    },
    {
        path: 'forgotpswd',
        component: ForgotpswdComponent
    },
    {
        path: 'library',
        component: LibraryComponent
    },
    {
        path: 'cart',
        component: CartComponent
    },
    {
        path: 'mylibrary',
        component: MylibraryComponent
    },
    {
        path: 'book',
        component: BookComponent
    },
    {
        path: 'detail/:id',
        component: DetailComponent
    },
    {
        path: 'libraryDetails/:id',
        component: LibraryDetailsComponent
    },
    {
        path: 'signup-form',
        component: SignupFormComponent
    },
    {
        path: 'termsAndPolacy',
        component: TermsAndPolacyComponent
    },
    {
        path: 'profile',
        component: ProfileComponent 
    },
    {
        path: 'wishlist',
        component: MywishlistComponent
    },
    {
        path: 'mydownloads',
        component: MydownloadsComponent
    },
    {
        path: 'insights',
        component: InsightsNavigatorComponent
    },
    {
        path: 'referral',
        component: ReferralComponent
    },
    {
        path: 'faq',
        component: FaqComponent
    },

];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: false })],
    exports: [RouterModule]
})
export class AppRoutingModule {
}

import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { LoginService } from '../providers/login.service';

@Injectable()
export class RouteCondition implements CanActivate {

    constructor(
        private router: Router,
        private LG: LoginService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const isLoggedIn = JSON.parse(localStorage.getItem('user-details'));
        if (isLoggedIn) {
            if (isLoggedIn.username && isLoggedIn.password) {
                this.LG.login(isLoggedIn.username, isLoggedIn.password, (status) => {
                    if (status == 'Loged-in') {
                        if (navigator.onLine) {
                            this.router.navigate(['/home']);
                        }
                        else {
                            this.router.navigate(['/mydownloads']);
                        }
                        return false;
                    }
                    else if (localStorage.getItem('splashScreen')) {
                        this.router.navigate(['/login']);
                        return false;
                    }
                    else {
                        return true;
                    }
                });
            }
        }
        else if (localStorage.getItem('splashScreen')) {
            this.router.navigate(['/login']);
            return false;
        }
        else {
            return true;
        }
    }
}
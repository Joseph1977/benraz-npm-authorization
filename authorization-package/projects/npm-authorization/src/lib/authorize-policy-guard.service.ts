import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NotificationService } from '@josephbenraz/npm-common';
import { AuthorizationConfig } from './authorization.model';
import { UserService } from './user.service';
import { AuthService } from './auth.service';

@Injectable()
export class AuthorizePolicyGuardService {
  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private config: AuthorizationConfig,
    private userService: UserService,
    private authService: AuthService) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.config.disableAuthorization) {
      return true;
    }

    let queryParams = null;
    if (state?.url) {
      queryParams = {
        queryParams: { returnUrl: state.url }, queryParamsHandling: "merge",
        preserveFragment: true
      }
    }

    if (!this.userService.getUser().isAuthenticated) {
      this.router.navigate([this.config.loginUrl], queryParams as any);
      return false;
    }

    if (!this.userService.isPolicySatisfied(next.data['policy'])) {
      this.notificationService.error('Access denied');
      this.router.navigate([this.config.loginUrl], queryParams as any);
      return false;
    }

    if (this.authService.isTokenExpiredOrEmpty()) {
      this.router.navigate([this.config.loginUrl], queryParams as any);
      return false;
    }

    return true;
  }
}

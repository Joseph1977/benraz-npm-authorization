import { OnInit, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '@josephbenraz/npm-common';
import { AuthorizationConfig } from './authorization.model';
import { AuthService } from "./auth.service";

@Component({
  selector: 'lib-authentication',
  templateUrl: './authentication.component.html'
})
export class AuthenticationComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private config: AuthorizationConfig,
    private authService: AuthService) {
  }

  ngOnInit(): void {
    const paramMap = this.route.snapshot.queryParamMap;
    const fragment = this.route.snapshot.fragment || '';
    const returnUrlQueryString = fragment ? new URLSearchParams(fragment).get('returnUrl') : null;
    const accessToken = fragment ? new URLSearchParams(fragment).get('access_token') : null;
    const returnUrl = decodeURIComponent((paramMap.get('returnUrl') || returnUrlQueryString || this.config.returnUrl) as string);
    if (accessToken) {
      this.authService.setToken(accessToken);
      this.router.navigate([returnUrl]);
      return;
    }

    const error = new URLSearchParams(fragment).get('error');
    if (error) {
      this.notificationService.error(error);
    }

    this.router.navigate([returnUrl]);
  }
}

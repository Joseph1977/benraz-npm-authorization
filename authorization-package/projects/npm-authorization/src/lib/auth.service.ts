import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InternalUrlsService } from '@josephbenraz/npm-common';
import { AuthorizationConfig, LoginMode } from './authorization.model';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';

@Injectable()
export class AuthService {
  constructor(private internalUrlsService: InternalUrlsService,
    private config: AuthorizationConfig,
    private cookieService: CookieService) {
  }

  redirectToLogin(mode?: LoginMode, returnUrl?: string) {
    window.location.href = this.getLoginUrl(mode, returnUrl);
  }

  getLoginUrl(mode?: LoginMode, returnUrl?: string) {
    let url = this.internalUrlsService.getAuthorizationUrl();

    const queryString = this.getQueryString(mode, returnUrl);
    if (queryString) {
      url += `?${queryString}`;
    }

    return url;
  }

  getToken() {
    return this.config.isCookies ?
      this.cookieService.get('accessToken') :
      localStorage.getItem('accessToken');
  }

  setToken(accessToken: string) {
    this.config.isCookies ?
      this.cookieService.set('accessToken', accessToken, 1) :
      localStorage.setItem('accessToken', accessToken);
  }

  removeToken() {
    this.config.isCookies ?
      this.cookieService.delete('accessToken') :
      localStorage.removeItem('accessToken');

  }

  isTokenExpiredOrEmpty() : boolean {
    let token = this.getToken();
    if (token) { 
      let decodedToken = this.getDecodedAccessToken(token);
      //Check expiry
      const expirationTime = decodedToken.exp;
      const currentTime = Math.floor(Date.now() / 1000);
      if (expirationTime < currentTime) {
        return true;
      } 
    } else {
      return true;
    }
    return false;
  }

  private getQueryString(mode?: LoginMode, returnUrl?: string): string {
    let params = new HttpParams();
    if (this.config.applicationId !== undefined) {
      params = params.set('applicationId', this.config.applicationId.toString());
    }
    if (this.config.ssoProviderCode) {
      params = params.set('ssoProviderCode', this.config.ssoProviderCode);
    }
    if (this.config.isLocal) {
      params = params.set('isLocal', this.config.isLocal);
    }

    if (mode) {
      params = params.set('mode', mode.toString());
    }

    if (returnUrl) {
      params = params.set('returnUrl', encodeURIComponent(returnUrl));
    }

    return params.toString();
  }

  private getDecodedAccessToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (Error) {
      return null;
    }
  }
}

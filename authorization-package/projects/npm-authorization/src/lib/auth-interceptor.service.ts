import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from '@josephbenraz/npm-common';
import { AuthorizationConfig } from './authorization.model';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private config: AuthorizationConfig,
    private authService: AuthService) {
  }

  private handleAuthError(err: HttpErrorResponse): Observable<any> {
    if (err.status === 401) {
      this.router.navigate([this.config.loginUrl]);
      return of(err.message);
    }

    if (err.status === 403) {
      this.notificationService.error('Access denied');
    }

    throw err;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${this.authService.getToken()}`
      }
    });

    return next.handle(authReq).pipe(
      catchError(x => this.handleAuthError(x))
    );
  }
}
import { NgModule, ModuleWithProviders } from '@angular/core';
import { AuthorizationConfig } from './authorization.model';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { AuthInterceptorService } from './auth-interceptor.service';
import { AuthorizePolicyGuardService } from './authorize-policy-guard.service';
import { AuthenticationComponent } from './authenticaton.component';
import { DisplayAuthorizePolicyDirective } from './display-authorize-policy.directive';
import { EditAuthorizePolicyDirective } from './edit-authorize-policy.directive';
import { IfAuthorizePolicyDirective } from './if-authorize-policy.directive';
import { CookieService } from 'ngx-cookie-service';


@NgModule({
  imports: [
  ],
  declarations: [
    DisplayAuthorizePolicyDirective,
    EditAuthorizePolicyDirective,
    IfAuthorizePolicyDirective,
    AuthenticationComponent
  ],
  providers: [
    UserService,
    AuthInterceptorService,
    AuthService,
    AuthorizePolicyGuardService,
    CookieService
  ],
  exports: [
    DisplayAuthorizePolicyDirective,
    EditAuthorizePolicyDirective,
    IfAuthorizePolicyDirective,
    AuthenticationComponent
  ]
})
export class BenrazNgxAuthorizationModule {
  static forRoot(config: AuthorizationConfig): ModuleWithProviders<BenrazNgxAuthorizationModule> {
    return {
      ngModule: BenrazNgxAuthorizationModule,
      providers: [
        { provide: AuthorizationConfig, useValue: config }
      ]
    };
  }
}

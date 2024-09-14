import { Directive, Input, OnInit, ViewContainerRef, TemplateRef } from '@angular/core';
import { AuthorizationConfig } from './authorization.model';
import { UserService } from './user.service';

@Directive({
  selector: '[libIfAuthorizePolicy]'
})
export class IfAuthorizePolicyDirective implements OnInit {

  @Input('libIfAuthorizePolicy')
  authorizePolicy!: string;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private config: AuthorizationConfig,
    private userService: UserService) {
  }

  ngOnInit(): void {
    if (this.userService.isPolicySatisfied(this.authorizePolicy) || this.config.disableAuthorization) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}

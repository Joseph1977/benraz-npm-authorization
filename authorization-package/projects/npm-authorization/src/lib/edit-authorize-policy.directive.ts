import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { AuthorizationConfig } from './authorization.model';
import { UserService } from './user.service';

@Directive({
  selector: '[libEditAuthorizePolicy]'
})
export class EditAuthorizePolicyDirective implements OnInit {

  @Input('libEditAuthorizePolicy')
  authorizePolicy!: string;

  constructor(
    private elementRef: ElementRef,
    private config: AuthorizationConfig,
    private userService: UserService) {
  }

  ngOnInit(): void {
    if (!this.userService.isPolicySatisfied(this.authorizePolicy) && !this.config.disableAuthorization) {
      this.elementRef.nativeElement.classList.add('disabled');
    }
  }
}

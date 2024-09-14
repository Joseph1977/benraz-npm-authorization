import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { AuthorizationConfig } from './authorization.model';
import { UserService } from './user.service';

@Directive({
  selector: '[libDisplayAuthorizePolicy]'
})
export class DisplayAuthorizePolicyDirective implements OnInit {

  @Input('libDisplayAuthorizePolicy')
  authorizePolicy!: string;

  constructor(
    private elementRef: ElementRef,
    private config: AuthorizationConfig,
    private userService: UserService) {
  }

  ngOnInit(): void {
    if (!this.userService.isPolicySatisfied(this.authorizePolicy) && !this.config.disableAuthorization) {
      this.elementRef.nativeElement.style.display = 'none';
    }
  }
}

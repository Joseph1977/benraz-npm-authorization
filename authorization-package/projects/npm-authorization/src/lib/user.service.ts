import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { AuthorizationConfig, User, PolicyRegistration } from './authorization.model';
import { AuthService } from "./auth.service";

@Injectable()
export class UserService {

  private policies: PolicyRegistration[];

  constructor(private config: AuthorizationConfig,
              private authService: AuthService) {
    this.policies = config.policies || [];
  }

  public createUserFromToken(accessToken: string) {
    return this.createUser(accessToken);
  }

  public getUser(): User {
    const user = this.createCurrentTokenUser();
    return user;
  }

  public isAuthorized(authorizeRoles: string[]) {
    if (!authorizeRoles || !(authorizeRoles instanceof Array)) {
      return false;
    }

    const user = this.createCurrentTokenUser();
    if (user && user.roles.some(x => authorizeRoles.some(y => x === y))) {
      return true;
    }

    return false;
  }

  public isPolicySatisfied(policy: string | undefined): boolean {
    if (this.config.disableAuthorization) {
      return true;
    }

    if (!policy) {
      return false;
    }

    const policyRule = this.policies.find(x => x.policy === policy);
    if (!policyRule) {
      return false;
    }

    const user = this.createCurrentTokenUser();
    if (!user) {
      return false;
    }

    const areAllClaimsSatisfied = this.areAllClaimsSatisfied(policyRule, user);
    const areAllRolesSatisfied = this.areAllRolesSatisfied(policyRule, user);
    const areAtLeastOneClaimSatisfied = this.areAtLeastOneClaimSatisfied(policyRule, user);
    const areAtLeastOneRoleSatisfied = this.areAtLeastOneRoleSatisfied(policyRule, user);

    return areAllClaimsSatisfied && areAllRolesSatisfied && areAtLeastOneClaimSatisfied && areAtLeastOneRoleSatisfied;
  }

  private createCurrentTokenUser() {
    const accessToken = this.authService.getToken();
    return this.createUser(accessToken || '');
  }

  private createUser(accessToken: string): User {
    const jwt = this.getDecodedAccessToken(accessToken);
    if (!jwt) {
      return User.createDefault();
    }

    return {
      isAuthenticated: true,
      userId: jwt.userid,
      name: jwt.unique_name,
      email: jwt.email,
      isPasswordExpired: jwt.is_password_expired,
      roles: jwt.role instanceof Array ? jwt.role : [jwt.role],
      claims: jwt.claim instanceof Array ? jwt.claim : [jwt.claim],
      tokenParams: {
        issuer: jwt.iss,
        audience: jwt.aud,
        issuedAt: this.fromUnixTime(jwt.iat),
        notValidBefore: this.fromUnixTime(jwt.nbf),
        expirationTime: this.fromUnixTime(jwt.exp)
      }
    };
  }

  private areAllClaimsSatisfied(policyRule: PolicyRegistration, user: User) {
    if (!policyRule.allClaims) {
      return true;
    }

    return policyRule.allClaims.every(x => user.claims.some(y => y === x));
  }

  private areAllRolesSatisfied(policyRule: PolicyRegistration, user: User) {
    if (!policyRule.allRoles) {
      return true;
    }

    return policyRule.allRoles.every(x => user.roles.some(y => y === x));
  }

  private areAtLeastOneClaimSatisfied(policyRule: PolicyRegistration, user: User) {
    if (!policyRule.atLeastOneClaim || policyRule.atLeastOneClaim.length === 0) {
      return true;
    }

    return policyRule.atLeastOneClaim.some(x => user.claims.some(y => y === x));
  }

  private areAtLeastOneRoleSatisfied(policyRule: PolicyRegistration, user: User) {
    if (!policyRule.atLeastOneRole || policyRule.atLeastOneRole.length === 0) {
      return true;
    }

    return policyRule.atLeastOneRole.some(x => user.roles.some(y => y === x));
  }

  private getDecodedAccessToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (Error) {
      return null;
    }
  }

  private fromUnixTime(unixTime?: number): Date {
    if (!unixTime) {
      return new Date();
    }

    return new Date(unixTime * 1000);
  }
}

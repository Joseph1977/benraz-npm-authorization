export class PolicyRegistration {
  policy: string = '';
  allRoles?: string[];
  allClaims?: string[];
  atLeastOneRole?: string[];
  atLeastOneClaim?: string[];

  static claimsPolicy(policy: string, allClaims: string[]): PolicyRegistration {
    return {
      policy,
      allRoles: [],
      allClaims
    };
  }

  static atLeastClaimsPolicy(policy: string, atLeastOneClaim: string[]): PolicyRegistration {
    return {
      policy,
      atLeastOneRole: [],
      atLeastOneClaim
    };
  }
}

export class User {
  isAuthenticated: boolean = false;
  userId: string = '';
  email: string = '';
  name: string = '';
  isPasswordExpired?: boolean;
  roles: string[] = [];
  claims: string[] = [];
  tokenParams?: TokenParams;

  static createDefault(): User {
    return {
      isAuthenticated: false,
      userId: '',
      email: '',
      name: '',
      roles: [],
      claims: []
    };
  }
}

export class TokenParams {
  issuer?: string;
  audience?: string;
  notValidBefore?: Date;
  expirationTime?: Date;
  issuedAt?: Date;
}

export class AuthorizationConfig {
  loginUrl?: string;
  returnUrl?: string;
  applicationId?: string;
  ssoProviderCode?: string;
  policies?: PolicyRegistration[];
  isCookies?: boolean;
  isLocal?: boolean;
  disableAuthorization?: boolean;
  redirectWhen401?: boolean = true;
}

export enum LoginMode {
  signUp = 1
}

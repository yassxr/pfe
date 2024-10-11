export interface RoleDto {
    id: number;
    name: string; // AGENT, EEP, etc.
  }
  
  export interface UserDto {
    id: number;
    name: string;
    email: string;
    password?: string; // It's optional since you may not want to expose this
    createdAt: string;
    updatedAt: string;
    roles: RoleDto[]; // An array of roles
    enabled: boolean;
    username: string;
    authorities: { authority: string }[]; // Array of authorities
    accountNonExpired: boolean;
    accountNonLocked: boolean;
    credentialsNonExpired: boolean;
  }
  
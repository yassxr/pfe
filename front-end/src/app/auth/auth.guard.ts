import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser = this.authService.currentUserValue;

    // Check if the user is authenticated
    if (currentUser && currentUser.token) {
      // Get the roles from the token
      const userRoles = currentUser.roles || []; // Ensure it's an array
      console.log('User Roles:', userRoles);
      const expectedRoles = route.data['roles'] || []; // Expected roles for the route
      console.log('Expected Roles:', expectedRoles);

      // Check if the user has any of the expected roles
      const hasRequiredRole = expectedRoles.some((role: string) => userRoles.includes(role));

      if (hasRequiredRole) {
        return true; // User has access
      } else {
        this.router.navigate(['/unauthorized']);
        return false;
      }
    }

    // Redirect to the login page if not authenticated
    this.router.navigate(['/guest/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}

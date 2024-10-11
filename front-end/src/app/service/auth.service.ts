import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8005/auth'; 
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser') || '{}'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  public get userId(): number | undefined {
    const currentUser = this.currentUserValue;
    return currentUser?.userId; // Return userId if available
  }

  public getCurrentUser(): Observable<any> {
    return this.currentUser; // Returns the current user observable
  }
  

  decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Failed to decode token', error);
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token'); // Ensure this matches your storage logic
  }
  
  
  login(email: string, password: string) {
    return this.http.post<any>(`${this.baseUrl}/login`, { email, password })
      .pipe(map(user => {
        if (user && user.token) {
          const decodedToken = this.decodeToken(user.token);
          if (decodedToken) {
            const userId = decodedToken.id || decodedToken.userId || decodedToken.sub;
            const userName = decodedToken.name || decodedToken.username; // Ensure this matches your token
            localStorage.setItem('token', user.token);
            const currentUser = { ...user, userId, userName, roles: decodedToken.roles };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            this.currentUserSubject.next(currentUser);
          }
        }
        return user;
      }));
  }
  
  
  register(name: string, email: string, password: string, roleName: string) {
    return this.http.post<any>(`${this.baseUrl}/signup`, { name, email, password, roleName });
  }

  logout() {
    localStorage.removeItem('currentUser'); // Remove user info
    localStorage.removeItem('token'); // Remove token
    this.currentUserSubject.next(null); // Reset current subject
    this.router.navigate(['/guest/login']); // Redirect to login page
  }
}

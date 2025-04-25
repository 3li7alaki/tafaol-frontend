import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiUrls } from 'src/app/modules/auth/services/api_urls';
import { User } from 'src/app/model/User';

@Injectable({
  providedIn: 'root'
})
export class TokenValidationService {
  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  /**
   * Validates the user's token by making a request to the API
   * @returns Observable<boolean> - True if token is valid, false otherwise
   */
  validateToken(): Observable<boolean> {
    // Check if user data exists in localStorage
    const userData = localStorage.getItem('user');
    if (!userData) {
      this.handleInvalidToken();
      return of(false);
    }

    try {
      // Get the token from localStorage
      const user = new User().deserialize(JSON.parse(userData));
      const token = user.auth.accessToken;
      
      if (!token) {
        this.handleInvalidToken();
        return of(false);
      }

      // Create headers with the token
      const headers = new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      });

      // Make a request to validate the token
      // Using a simple endpoint that requires authentication
      return this.http.get<any>(new ApiUrls().me, { headers }).pipe(
        map(response => {
          // If we get a successful response, the token is valid
          return true;
        }),
        catchError(error => {
          // If we get a 401 error, the token is invalid
          if (error.status === 401) {
            this.handleInvalidToken();
          }
          return of(false);
        })
      );
    } catch (error) {
      this.handleInvalidToken();
      return of(false);
    }
  }

  /**
   * Handles an invalid token by clearing localStorage and redirecting to login
   * while preserving language settings
   */
  private handleInvalidToken(): void {
    // Save language preference before clearing storage
    const language = localStorage.getItem('language');
    
    // Clear all localStorage
    localStorage.clear();
    
    // Restore language preference
    if (language) {
      localStorage.setItem('language', language);
    }
    
    // Redirect to login page
    this.router.navigate(['/auth/login']);
  }
}

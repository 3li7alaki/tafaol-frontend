import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Save language preference before clearing storage
          const language = localStorage.getItem('language');
          
          // Clear all local storage
          localStorage.clear();
          
          // Restore language preference
          if (language) {
            localStorage.setItem('language', language);
          }
          
          // Navigate to login page
          this.router.navigate(['/auth/login']);
        }
        return throwError(error);
      })
    );
  }
}

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../backend/services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const API_URL = environment.API_URL;

  const skipUrls = [
    `${API_URL}/login/`,
    `${API_URL}/users/`,
  ]
  
  const authService = inject(AuthService);
  const accessToken = authService.getAccessToken();
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  for (const url of skipUrls) {
    if (req.url.includes(url)) {
      console.log("SKIPED URL")
      return next(req);
    }
  }

  return next(authReq).pipe(
    catchError((err) => {
      return authService.refreshToken().pipe(
        switchMap((res) => {
          // Save the new access token
          authService.setAccessToken(res.access);
          console.log("REFRESHED TOKEN")
          const newReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${res.access}`
            }
          });
          return next(newReq);
        }),
        catchError((err) => {
          // Redirect to login page
          localStorage.clear();
          return throwError(() => ({ error: 'Session Expired'}))
        })
      );
    })
  );
};

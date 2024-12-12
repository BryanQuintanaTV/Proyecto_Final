import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../interfaces/user';
import { JwtHelperService, JWT_OPTIONS} from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_URL: string = environment.API_URL;

  constructor(private http: HttpClient) { }

  // Function to login a user
  login(username: string, password: string): Observable<any> {
    const body = new HttpParams()
    .set('username', username)
    .set('password', password);

  const headers = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
  });
    return this.http.post<any>(`${this.API_URL}/login/`, body.toString(), { headers });
  }

  // Function to refresh the token of a user
  refreshToken(): Observable<any> {
    const refresh = this.getRefreshToken() || '';
    const body = new HttpParams()
    .set('refresh', refresh);

  const headers = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
  });
    return this.http.post<any>(`${this.API_URL}/refresh/`, body.toString() ,{ headers });
  }

  // Function to register a user
  register(username: string, password: string, email: string, auth: string): Observable<any> {

    const body = {
      username: username,
      password: password,
      email: email
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${auth}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(`${this.API_URL}/users/`, body ,{ headers});
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('access');
    if (token) {
      const refresh = localStorage.getItem('refresh');
      if (refresh) {
        this.refreshToken().subscribe({
          next: (result) => {
            localStorage.setItem('access', result.access);
            console.log('Token refreshed');
          },
          error: (error) => {
            console.log(error);
          }
        });
      }
    }
    const helper = new JwtHelperService();
    const isExpired = helper.isTokenExpired(token);
    return !isExpired;
  }

  public isStaff(): boolean {
    const is_staff = localStorage.getItem('is_staff');
    return is_staff === 'true';
  }

  getAccessToken() {
    return localStorage.getItem('access');
  }

  setAccessToken(token: string) {
    localStorage.setItem('access', token);
  }

  getRefreshToken() {
    return localStorage.getItem('refresh');
  }

  setRefreshToken(token: string) {
    localStorage.setItem('refresh', token);
  }

  getUser(){
    return localStorage.getItem('id_user');
  }
}

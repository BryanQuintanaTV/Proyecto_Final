import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private API_URL: string = environment.API_URL;

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any> {

    const auth = localStorage.getItem('access');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${auth}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(`${this.API_URL}/users/`, { headers })
  }

  addUser(user: any): Observable<any> {

    let auth = localStorage.getItem('access');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${auth}`,
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(`${this.API_URL}/users/`, user, { headers });
  }

  updateUser(user: any): Observable<any> {

    let auth = localStorage.getItem('access');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${auth}`,
      'Content-Type': 'application/json'
    });

    return this.http.patch<any>(`${this.API_URL}/users/${user.id}/`, user, { headers })
  }

  deleteUser(id: number): Observable<any> {
    let auth = localStorage.getItem('access');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${auth}`,
      'Content-Type': 'application/json'
    });

    return this.http.delete<any>(`${this.API_URL}/users/${id}/`, { headers });
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../interfaces/order';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class OrderService {

  private API_URL: string = environment.API_URL;

  constructor(private http: HttpClient) { }

  // Function to get orders from the API
  getOrders(): Observable<Order> {
    const headers = new HttpHeaders({
      'authorization': 'Bearer ' + localStorage.getItem('access'),
      'Content-Type': 'application/json'
    });
    return this.http.get<Order>(`${this.API_URL}/rest/ordenes/`, {headers}).pipe(res => res);
  }

  // Function to get an order by id from the API
  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.API_URL}/ordenes/${id}`);
  }

  // Function to add an order to the API
  addOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(`${this.API_URL}/rest/ordenes/`, order);
  }

  // Function to update an order in the API
  updateOrder(order: Order): Observable<Order> {
    return this.http.patch<Order>(`${this.API_URL}/ordenes/${order.num_order}`, order);
  }

  // Function to delete an order from the API
  deleteOrder(id: number): Observable<Order> {
    return this.http.delete<Order>(`${this.API_URL}/ordenes/${id}`);
  }
}

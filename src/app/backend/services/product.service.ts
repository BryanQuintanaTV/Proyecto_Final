import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/product';
import { environment } from '../../../environments/environment';
import { Mensaje } from '../interfaces/mensaje';

@Injectable({
  providedIn: 'root'
})

export class ProductService {

  private API_URL: string = environment.API_URL;

  constructor(private http: HttpClient) { }


  // Function to get products from the API
  getProducts(): Observable<Product> {
    const headers = new HttpHeaders({
      'authorization': 'Bearer ' + localStorage.getItem('access'),
      'Content-Type': 'application/json'
    });
    return this.http.get<Product>(`${this.API_URL}/rest/productos/`, {headers}).pipe(res => res);
  }

  // Function to get a product by id from the API
  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}/rest/productos/${id}`);
  }

  // Function to add a product to the API
  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.API_URL}/rest/productos/`, product);
  }

  // Function to update a product in the API
  updateProduct(product: Product): Observable<Product> {
    return this.http.patch<Product>(`${this.API_URL}/rest/productos/${product.id_product}/`, product);
  }

  // Function to delete a product from the API
  deleteProduct(id: number): Observable<Mensaje> {
    return this.http.delete<Mensaje>(`${this.API_URL}/rest/productos/${id}/`);
  }
  
}

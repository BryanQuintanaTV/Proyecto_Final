import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';

import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductsComponent } from './components/products/products.component';
import { OrdersComponent } from './components/orders/orders.component';
import { UsersComponent } from './components/users/users.component';
import { Order } from '../../backend/interfaces/order';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [SidebarComponent, DashboardComponent, ProductsComponent, OrdersComponent, UsersComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

  @ViewChild(OrdersComponent) ordersComponent?: OrdersComponent;

  constructor(private cdr: ChangeDetectorRef) { }

  valorRecibido: number = 4;
  ordenes: Order[] = [];
  result: any;

  recibirValor(valor: number) {
    this.valorRecibido = valor;
    console.log('Valor seleccionado: ', valor);
    this.cdr.detectChanges();
  }

  changeValue(value: string) {
    this.ordersComponent?.changeValue(value); 
    this.result = this.ordersComponent?.loadOrders();
    console.log("RESULT IS",this.result);
  }

}

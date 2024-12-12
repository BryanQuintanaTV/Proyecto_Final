import { Component, inject, OnInit } from '@angular/core';
import { OrderService } from '../../../../backend/services/order.service';
import { Order } from '../../../../backend/interfaces/order';
import { Product } from '../../../../backend/interfaces/product';
import { ProductService } from '../../../../backend/services/product.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

// Imports from PrimeNG
import { TableModule } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TagModule } from 'primeng/tag';


@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [TableModule, CommonModule, ToastModule, ButtonModule, RippleModule, TagModule],
  providers: [MessageService],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})

export class OrdersComponent implements OnInit {

  productsLoaded: boolean = false;
  ordersLoaded: boolean = false;
  private intervalId: any;
  private attemptCount: boolean = false; 

  valor: string = "LOL";
  ordenes: any = [];
  productos: Product[] = [];
  styledOrder: any = [];


  constructor(private orderService: OrderService, private messageService: MessageService, private productService: ProductService) { }


  ngOnInit(): void {
    this.loadOrders();
    // this.stylyngOrder();
    // this.loadProducts();

    this.tryUntilLoaded();
  }

  loadOrders() {
    this.orderService.getOrders().subscribe({
      next: (result) => {
        let tempArray: Order[] = [];
        tempArray = this.ordenes.concat(result);
        this.ordenes = tempArray;
        console.log(this.ordenes);
        this.ordersLoaded = true;
      },
      error: (err) => {
        if(err.status === 400) {
          this.messageService.add({ severity: 'warn', summary: 'Warn', detail: err.error.mensaje });
        } else {
          this.messageService.add({key:'connectionError', severity: 'error', summary: 'Error', detail: 'Error al cargar las ordenes', sticky: true });
          console.log(err);
        }
      }
    })
  }

  // loadProducts() {
  //   this.productService.getProducts().subscribe({
  //     next: ( result ) => {
  //         let tempArray: Product[] = [];
  //         tempArray = this.productos.concat(result);
  //         this.productos = tempArray;
  //         console.log(this.productos);
  //         this.productsLoaded = true;
  //     },
  //     error: ( err ) => {
  //         console.log(err);
  //     }
  // })
  // }

  tryUntilLoaded(){
     // Inicia el setInterval para intentar la condición cada 100ms
    this.intervalId = setInterval(() => {
      console.log('Intentando...');

      // Verifica si la condición se cumple
      if (this.ordersLoaded) {
        console.log('Condición cumplida, deteniendo intentos.');
        this.attemptCount = true;  // Cambia attemptCount a true
        this.stylyngOrder();
      }

      // Si attemptCount es true, detiene el intervalo
      if (this.attemptCount) {
        clearInterval(this.intervalId);  // Detener intentos
      }
    }, 100); // 100ms

  }

  stylyngOrder() {

    this.ordenes.forEach( (order: any) => {
      let styledOrder: { num_orden: number, order_date: string, total: number, products: any[] } = {
        num_orden: order.num_order,
        order_date: order.date_order,
        total: order.total_order,
        products: []
      }

      order.order_products.forEach( (product: any) => {
        console.log("ORDER PRODUCT", product)
      
        // let tempProduct = this.productos.find( (p) => p.id_product === product.product_id);
        let tempStyledProduct: any = {
              product_id: product.id_product,
              name: product.name_product,
              quantity: product.quantity,
              price: product.price_product,
              amount: product.quantity * product.price_product
            }
            styledOrder.products.push(tempStyledProduct);
        
        // if (tempProduct) {
        //   let tempStyledProduct: any = {
        //     product_id: tempProduct.id_product,
        //     name: tempProduct.name_product,
        //     quantity: product.quantity,
        //     price: tempProduct.price_product,
        //   }
        //   styledOrder.products.push(tempStyledProduct);
        // } else {
        //   console.log("Product not found");
        // }
      })

      this.styledOrder.push(styledOrder);
    })
    console.log("----- Styled Order ----",this.styledOrder);
  }



  calculateCustomerTotal(co: any){}
  getSeverity(co: any){}


  onConfirm() {
    this.messageService.clear('connectionError');
    this.loadOrders();
    this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Reintentando...' });

}

onReject() {
    this.messageService.clear('connectionError');
}

  changeValue(value: string) {
    if (value === this.valor) {
      this.valor = "XD";
    } else {
      this.valor = value;
    }
  }

}

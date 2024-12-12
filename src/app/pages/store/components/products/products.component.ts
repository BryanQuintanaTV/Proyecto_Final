import { Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { TableModule } from 'primeng/table';
import { RippleModule } from 'primeng/ripple';
import { ShoppingCartComponent } from '../shopping-cart/shopping-cart.component';
import { Order } from '../../../../backend/interfaces/order';
import { OrderService } from '../../../../backend/services/order.service';
import { Product } from '../../../../backend/interfaces/product';
import { ProductService } from '../../../../backend/services/product.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../../../backend/services/auth.service';


@Component({
    selector: 'app-products',
    standalone: true,
    imports: [SidebarModule, ButtonModule, DataViewModule, CommonModule, TagModule, RatingModule, TableModule, RippleModule, ConfirmDialogModule, ToastModule],
    templateUrl: './products.component.html',
    styleUrl: './products.component.css',
    providers: [ConfirmationService, MessageService]
})

export class ProductsComponent  implements OnInit {

    @ViewChild(ShoppingCartComponent) shoppingCart?: ShoppingCartComponent;

    isMobile = false;
    sidebarVisible = false;

    constructor(private BreakpointObserver: BreakpointObserver, 
                private productService: ProductService, 
                private confirmationService: ConfirmationService, 
                private messageService: MessageService, 
                private orderService: OrderService,
                private authService: AuthService
              ) { }

    layout: string = 'grid';
    OrderNumber: number = 0;

    products: Product[] = [];

    products_selected: any = [];

    order: Order[] = [];
    newOrder: any = {
        num_order: 0,
        order_products: [],
        total_order: 0,
        date_order: ''
    };


    ngOnInit() {
    
        this.BreakpointObserver.observe(['(max-width: 860px)']).subscribe(result => {
        this.isMobile = result.matches;
    });
    
        this.loadProducts();
        this.loadLastOrderDetail();
    }

//     // Function to load products
    loadProducts() {
        this.productService.getProducts().subscribe({
            next:(result) => {
                let tempArray: Product[] = [];
                tempArray = this.products.concat(result);
                this.products = tempArray;
            },
            error:(err) => {
                this.messageService.add({ severity: 'error', detail: 'Error Al Cargar los productos', life: 2050 });
            }
        });
    }

//     // Function to load last order to know what was the last order number
    loadLastOrderDetail() {
        this.orderService.getOrders().subscribe({
            next:(result) => {
                let tempArray: Order[] = [];
                tempArray = tempArray.concat(result);
                this.OrderNumber = tempArray.length + 1;
            },
            error:(err) => {
                this.messageService.add({ severity: 'error', detail: 'Error Al Establecer La Orden', life: 2050 });
            }
        })
    }

//     // BUILDING THE ORDER
    onClickBuy(product: any) {

    let productExist: boolean = this.orderHasProduct(product);

    if (productExist) {
        let index = this.orderFindIndexProduct(product);

      if (index != -1) {
        this.newOrder.order_products[index].quantity += 1;
        this.newOrder.order_products[index].amount = this.newOrder.order_products[index].quantity * product.price_product;
        this.products_selected[index].quantity += 1;
        this.products_selected[index].price = this.newOrder.order_products[index].amount;
        this.messageService.clear();
        this.messageService.add({ severity: 'success', detail: '+1 ' +product.name_product+' añadido al carrito', life: 1250 });
      } else {
        console.log('Error', 'Product not found');
      }

    } else {
      let productSelect = {
        id_product: product.id_product,
        quantity: 1,
        price: product.price_product,
        image: product.image_product,
        name: product.name_product
      }

      let orderProduct = {
        id_product: product.id_product,
        quantity: 1,
        amount: product.price_product
      };

      this.products_selected.push(productSelect);
      this.newOrder.order_products.push(orderProduct);
      this.messageService.clear();
      this.messageService.add({ severity: 'success', detail: product.name_product+' añadido al carrito', life: 1250 });
    }
    this.updateTotal();
  }

  private orderHasProduct(product: any): boolean {
    let productExist: boolean = false;

    try {
      this.newOrder.order_products.forEach((element: any) => {
        if (element.id_product== product.id_product) {
          productExist = true;
        }
      });
      return productExist;

    } catch (error) {
      console.log('Error', error);
      return false;
    }

  }


  private orderFindIndexProduct(product: any): number {
    let index: number = -1;

    try {
      return this.newOrder.order_products.findIndex((element: any) => element.id_product === product.id_product);
    } catch (error) {
      console.log('Error', error);
      return index;
    }

  }

  private updateTotal() {
    let total: number = 0;
    this.newOrder.order_products.forEach((element: any) => {
      total += element.amount;
    });
    this.newOrder.total_order = total;
  } // FINISH BUILDING THE ORDER


  deleteFromCart(product: any) {
    console.log("PRODUCT_DELETE", product)
    // Asegurarse de que products_selected está definido y es un arreglo
    if (!Array.isArray(this.products_selected)) {
        return;
    }

    // Buscar el índice en newOrder.products usando product_id
    let productOrderIndex = this.newOrder.order_products.findIndex((p: { product_id: number }) => p.product_id === product.product_id);
    console.log("INDEX", productOrderIndex)
    if (productOrderIndex !== -1) {
        this.newOrder.order_products.splice(productOrderIndex, 1);
        this.messageService.add({ severity: 'info', detail: product.name+' eliminado del carrito', life: 1250 });
    }

    // Buscar el índice en products_selected usando product_id
    let selectedProductIndex = this.products_selected.findIndex(p => p.product_id === product.product_id);
    if (selectedProductIndex !== -1) {
        this.products_selected.splice(selectedProductIndex, 1);
    }

    this.updateTotal();

  }
  

  cancelOrder(event: Event) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Estás seguro que quieres cancelar la orden',
        header: 'Eliminar Orden',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon:"none",
        rejectIcon:"none",
        rejectButtonStyleClass:"p-button-text",
        accept: () => {
            this.deleteOrder();
            this.messageService.add({ severity: 'warn', detail: 'Orden Cancelada', life: 1250 });
        },
        reject: () => {  }
    });
}

  private deleteOrder() {
    this.products_selected = [];
    this.newOrder = {
      num_order: 0,
      order_products: [],
      total_order: 0,
      date_order: ''
    }
  }

  submitOrder() {
    this.newOrder.num_order = this.OrderNumber;
    this.newOrder.date_order = this.todayDate();
    this.newOrder.id_user = this.authService.getUser();
    console.log('submitOrder', this.newOrder);
    this.saveOrder(this.newOrder);
  }

  private saveOrder(order: any) {
    this.orderService.addOrder(order).subscribe({
      next: (result) => {
        this.messageService.add({ severity: 'success', detail:'Orden Creada con exito', life: 2000 });
        location.reload();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', detail: err.error.mensaje, life: 2000 });
      }
    })
  }

  todayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Mes (0-11) + 1
    const day = String(today.getDate()).padStart(2, '0'); // Día del mes (1-31)
    return `${year}-${month}-${day}`;
  }

}


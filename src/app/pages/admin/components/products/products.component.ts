import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { Product } from '../../../../backend/interfaces/product';
import { ProductService } from '../../../../backend/services/product.service';
import { Mensaje } from '../../../../backend/interfaces/mensaje';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [TableModule, DialogModule, RippleModule, ButtonModule, ToastModule, ToolbarModule, ConfirmDialogModule, InputTextModule, InputTextareaModule, CommonModule, FileUploadModule, DropdownModule, TagModule, RadioButtonModule, RatingModule, InputTextModule, FormsModule, InputNumberModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
  providers: [MessageService, ConfirmationService]
})


export class ProductsComponent implements OnInit{

productDialog: boolean = false;
submitted: boolean = false;
products: Product[] = [];
product!: Product;
selectedProducts!: Product[] | null;
statuses!: any[];

constructor(private productService: ProductService, private messageService: MessageService, private confirmationService: ConfirmationService) {}

ngOnInit() {
    this.loadProducts();

    this.statuses = [
        { label: 'INSTOCK', value: 'instock' },
        { label: 'LOWSTOCK', value: 'lowstock' },
        { label: 'OUTOFSTOCK', value: 'outofstock' }
    ];
}

loadProducts() {
    this.productService.getProducts().subscribe({
        next: ( result ) => {
            let tempArray: Product[] = [];
            tempArray = this.products.concat(result);
            this.products = tempArray;
            console.log(this.products);
        },
        error: ( err ) => {
            console.log(err);
        }
    })
}

openNew() {
    this.product = {
        id_product: 0,
        name_product: '',
        price_product: 0,
        image_product: ''
    };
    this.submitted = false;
    this.productDialog = true;
}

deleteSelectedProducts() {
    this.confirmationService.confirm({
        message: 'Are you sure you want to delete the selected products?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.products = this.products.filter((val) => !this.selectedProducts?.includes(val));
            this.selectedProducts = null;
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Producto Eliminado', life: 3000 });
        }
    });
}

editProduct(product: Product) {
    this.product = { ...product };
    this.productDialog = true;
}

deleteProduct(product: Product) {

    let idProduct: number = product.id_product;

    this.confirmationService.confirm({
        message: 'Estás seguro que quieres elimiar  ' + product.name_product + '?',
        header: 'Borrar Producto',
        icon: 'pi pi-exclamation-triangle',
        acceptButtonStyleClass:"p-button-danger p-button-text",
        rejectButtonStyleClass:"p-button-text p-button-text",
        accept: () => {

            this.productService.deleteProduct(idProduct).subscribe({
                next: (result: Mensaje) => {
                    this.products = this.products.filter((val) => val.id_product !== idProduct);
                    this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Producto eliminado', life: 1500 });
                },
                error: (err: any) => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.mensaje, life: 2500 });
                }
            });
        }
    });
}

hideDialog() {
    this.productDialog = false;
    this.submitted = false;
}

saveProduct() {
    this.submitted = true;

    if (this.product.name_product?.trim()) {
        
        // Code when a product is going to be updated 
        if (this.product.id_product) {
            this.products[this.findIndexById(this.product.id_product)] = this.product;
            this.updateProduct(this.product);

        // Code when a product is going to be created   
        } else {

            this.addProduct(this.product);
        }

        this.products = [...this.products];
        this.productDialog = false;
        this.product = {id_product: 0, name_product: '', price_product: 0, image_product: ''};
    }
}

private updateProduct(product: Product) {

    this.productService.updateProduct(product).subscribe({
        next: (result: Product) => {
            this.products[this.findIndexById(result.id_product)] = result;
            this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Producto actualizado', life: 1500 });
        },
        error: (err: any) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.mensaje, life: 2500 });
        }
    });
}

private addProduct(product: Product) {

    let newProduct: Product = {
        id_product: 0,
        name_product: product.name_product,
        price_product: product.price_product,
        image_product: "menu/noImage.png"
    };

    this.productService.addProduct(newProduct).subscribe({
        next: (result: Product) => {
            location.reload();
            this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Producto creado', life: 1500 });
        },
        error: (err: any) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.mensaje, life: 2500 });
        }
    });
}

findIndexById(id: number) { //: number
    let index = -1;
    for (let i = 0; i < this.products.length; i++) {
        if (this.products[i].id_product === id) {
            index = i;
            break;
        }
    }
    return index;
}


}

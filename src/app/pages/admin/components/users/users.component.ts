import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../../backend/services/users.service';
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

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [TableModule, DialogModule, RippleModule, ButtonModule, ToastModule, ToolbarModule, ConfirmDialogModule, InputTextModule, InputTextareaModule, CommonModule, FileUploadModule, DropdownModule, TagModule, RadioButtonModule, RatingModule, InputTextModule, FormsModule, InputNumberModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
  providers: [MessageService, ConfirmationService]
})
export class UsersComponent implements OnInit {

  userDialog: boolean = false;
  submitted: boolean = false;
  newUser: boolean = false;
  users: any[] = [];
  user!: any;
  selectedUser!: any[] | null;
  statuses!: any[];

  constructor(private messageService: MessageService, 
              private confirmationService: ConfirmationService,
              private usersService: UsersService) { }

  ngOnInit(): void {
    this.loadUsers();

    this.statuses = [
      { label: 'ADMIN', value: 'Admin' },
      { label: 'USUARIO', value: 'Usuario' },
  ];
  }

  loadUsers() {
    this.usersService.getUsers().subscribe({
      next: ( result ) => {
        let tempArray: any[] = [];
        tempArray = this.users.concat(result);
        this.users = tempArray;
        console.log(this.users);
      }
    })

  }

  openNew() {
    this.user = {};
    this.submitted = false;
    this.userDialog = true;
    this.newUser = true;
  }

  editUser(user: any){
    this.user = { ...user };
    this.userDialog = true;
    this.newUser = false;
  }

  deleteUser(user: any) {
    let idUsuario: number = user.id;

    this.confirmationService.confirm({
        message: 'Estás seguro que quieres elimiar a ' + user.username + '?',
        header: 'Borrar Usuario',
        icon: 'pi pi-exclamation-triangle',
        acceptButtonStyleClass:"p-button-danger p-button-text",
        rejectButtonStyleClass:"p-button-text p-button-text",
        accept: () => {

            this.usersService.deleteUser(idUsuario).subscribe({
                next: (result: any) => {
                    this.users = this.users.filter((val) => val.id!== idUsuario);
                    this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Producto eliminado', life: 1500 });
                },
                error: (err: any) => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: "Error", life: 2500 });
                }
            });
        }
    });
  }

  hideDialog() {

  }

  saveUser() {

    this.submitted = true;

    if (this.user.username?.trim()) {
        
        // Code when a product is going to be updated 
        if (this.user.id) {
            this.users[this.findIndexById(this.user.id)] = this.user;
            this.updateUser(this.user);

        // Code when a product is going to be created   
        } else {
            this.addUser(this.user);
        }

        this.users = [...this.users];
        this.userDialog = false;
        this.user = {};
    }
  }

  private updateUser(user: any) {
    
    let newUser: any = {
      id : user.id,
      username: user.username,
      email: user.email,
      is_staff : user.is_staff = user.is_staff === 'Admin' ? true : false
    }
    
    this.usersService.updateUser(newUser).subscribe({
      next: (result: any) => {
        console.log(result);
        location.reload();
        this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Producto actualizado', life: 1500 });
    },
    error: (err: any) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "error", life: 2500 });
    }
    });
    
  }

  private addUser(user: any) {
    let newUser: any = {
      username: user.username,
      email: user.email,
      password: user.password,
    }

    this.usersService.addUser(newUser).subscribe({
      next: (result: any) => {
        location.reload();
        this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Usuario Creado', life: 1500 });
    },
    error: (err: any) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.mensaje, life: 2500 });
    }
    })

  }

  findIndexById(id: number) { //: number
    let index = -1;
    for (let i = 0; i < this.users.length; i++) {
        if (this.users[i].id_product === id) {
            index = i;
            break;
        }
    }
    return index;
}

  getSeverity(status: string) {
    switch (status) {
        case 'TRUE':
            return 'success';
        case 'FALSE':
            return 'warning';
        default:
          return 'info'
    }
}
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { TabMenuModule } from 'primeng/tabmenu';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { ButtonModule } from 'primeng/button';
import { WebSocketService } from '../../backend/services/web-socket.service';
import { switchMap } from 'rxjs/operators';
import { timer } from 'rxjs';
import { AuthGuard } from '../../security/authGuard';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MenubarModule, BadgeModule, AvatarModule, InputTextModule, RippleModule, CommonModule, TabMenuModule, ReactiveFormsModule, SelectButtonModule, MessagesModule, ButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  providers: [MessageService]
})


export class NavbarComponent implements OnInit{

  items: MenuItem[] | undefined;
  notiIcon: string = 'icon_bell.svg';
  showNoti: boolean = true;
  mensaje: string = '';
  isAuth: boolean = false;

  constructor(private router: Router, private messageService: MessageService, private webSocketService: WebSocketService, private authGuard: AuthGuard) { }

  silenceNotifications() {
    if (this.showNoti) {
      this.notiIcon = 'icon_bell_off.svg';
      this.showNoti = false;
    } else {
      this.notiIcon = 'icon_bell.svg';
      this.showNoti = true;
      this.mensaje = '';
    }
  }
clear() {
  this.messageService.clear();
}

  ngOnInit() {

    this.isAuth = this.authGuard.isAuth();

    this.webSocketService.messages$.pipe(
      switchMap((message: string) => {
        // Cada vez que llega un mensaje, lo asignamos y reiniciamos el temporizador
        this.mensaje = message;
        return timer(5000); // 5 segundos de espera
      })
    ).subscribe({
      next: () => {
        // Si no hay nuevos mensajes durante 5 segundos, cambiamos a "esperando"
        this.mensaje = '';
      }
    });

    
    if (this.isAuth && this.authGuard.isStaff()) {
      this.items = [
        { 
          label: '<span class="inline-flex items-baseline"><img class="self-center mr-1" src="/assets/icons/icon_home.svg"> <span>Inicio</span> </span>', 
          command: () => {
            this.router.navigate(['/home']);
          } 
        },
        {
          label: '<span class="inline-flex items-baseline"><img class="self-center mr-1" src="/assets/icons/icon_store.svg"> <span>Tienda</span> </span>', 
          command: () => {
            this.router.navigate(['/store']);
          }
        },
        { 
          label: '<span class="inline-flex items-baseline"><img class="self-center mr-1" src="/assets/icons/icon_user.svg"> <span>Admin</span> </span>',  
          command: () => {
            this.router.navigate(['/admin']);
          }
        },
        { 
          label: '<span class="inline-flex items-baseline"><img class="self-center mr-1" src="/assets/icons/icon_chat.svg"> <span>Chat</span> </span>',  
          command: () => {
            this.router.navigate(['/chat']);
          }
        },
        { 
          label: '<span class="inline-flex items-baseline font-bold"><img class="self-center mr-1" src="/assets/icons/icon_logout.svg"> <span>Logout</span> </span>',  
          command: () => {
            localStorage.clear();
            location.reload();
          }
        }
    ];
    }else if(this.isAuth && !this.authGuard.isStaff()){
      this.items = [
        { 
          label: '<span class="inline-flex items-baseline"><img class="self-center mr-1" src="/assets/icons/icon_home.svg"> <span>Inicio</span> </span>', 
          command: () => {
            this.router.navigate(['/home']);
          } 
        },
        {
          label: '<span class="inline-flex items-baseline"><img class="self-center mr-1" src="/assets/icons/icon_store.svg"> <span>Tienda</span> </span>', 
          command: () => {
            this.router.navigate(['/store']);
          }
        },
        { 
          label: '<span class="inline-flex items-baseline"><img class="self-center mr-1" src="/assets/icons/icon_chat.svg"> <span>Chat</span> </span>',  
          command: () => {
            this.router.navigate(['/chat']);
          }
        },
        { 
          label: '<span class="inline-flex items-baseline font-bold"><img class="self-center mr-1" src="/assets/icons/icon_logout.svg"> <span>Logout</span> </span>',  
          command: () => {
            localStorage.clear();
            location.reload();
          }
        }
      ];
    }else {
      this.items = [
        { 
          label: '<span class="inline-flex items-baseline"><img class="self-center mr-1" src="/assets/icons/icon_home.svg"> <span>Inicio</span> </span>', 
          command: () => {
            this.router.navigate(['/home']);
          } 
        },
        { 
          label: '<span class="inline-flex items-baseline"><img class="self-center mr-1" src="/assets/icons/icon_chat.svg"> <span>Chat</span> </span>',  
          command: () => {
            this.router.navigate(['/chat']);
          }
        },
        { 
          label: '<span class="inline-flex items-baseline font-bold"><img class="self-center mr-1" src="/assets/icons/icon_login.svg"> <span>Login</span> </span>',  
          command: () => {
            this.router.navigate(['/login']);
          }
        },
        

    ];
    }

  }

}

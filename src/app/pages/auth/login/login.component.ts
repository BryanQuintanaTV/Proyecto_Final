import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../backend/services/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthGuard } from '../../../security/authGuard';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,ToastModule,RippleModule],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  userForm: FormGroup;
  isAuth: boolean = false;

  constructor(private fb: FormBuilder, 
              private authService: AuthService, 
              private authGuard: AuthGuard,
              private router: Router,
              private messageService: MessageService) { 
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {

    this.isAuth = this.authGuard.isAuth();

    if(this.isAuth) {
      console.log('Ya estas autenticado');
      this.router.navigate(['/home']);
    }
  }

  login() {
    
    this.authService.login(this.userForm.value.username, this.userForm.value.password).subscribe({
      next: (result) => {
        console.log(result);
        localStorage.setItem('access', result.access);
        localStorage.setItem('refresh', result.refresh);
        localStorage.setItem('is_staff', result.user.is_staff);
        localStorage.setItem('id_user', result.user.id);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.messageService.add({severity: 'error', summary: 'Error Al Iniciar Sesión', detail: error.error.detail, sticky: false });
        this.userForm.reset();
        this.userForm.setErrors({})

      }
    })

  }

}

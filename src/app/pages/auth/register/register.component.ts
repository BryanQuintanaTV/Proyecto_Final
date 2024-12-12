import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../backend/services/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from '../../../security/authGuard';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{

  userForm: FormGroup;
  isAuth: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private authGuard: AuthGuard,private router: Router) { 
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
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

  register() {
    this.authService.login("demo_user", "demo_password").subscribe({
      next: (result) => {
        console.log(result.access);

        this.authService.register(this.userForm.value.username, this.userForm.value.password, this.userForm.value.email, result.access).subscribe({
          next: (result) => {
            console.log(result);
            this.router.navigate(['/login']);
          },
          error: (error) => {
            console.log(error);
          }
        });

      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}

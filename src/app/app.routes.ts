import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthGuard } from './security/authGuard';
import { ReactiveFormsModule } from '@angular/forms';

import { HomeComponent } from './pages/home/home.component';
import { StoreComponent } from './pages/store/store.component';
import { AdminComponent } from './pages/admin/admin.component';
import { ChatComponent } from './pages/chat/chat.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'home', component: HomeComponent},
    {path: 'store', component: StoreComponent, canActivate: [AuthGuard]},
    {path: 'admin', component: AdminComponent, canActivate: [AuthGuard], data: {requiresStaff: true}},
    {path: 'chat', component: ChatComponent, canActivate: [AuthGuard]},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent}
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {useHash: true}),
        BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
    ],
    exports: [RouterModule,BrowserModule,BrowserAnimationsModule]
})

export class AppRoutingModule {}

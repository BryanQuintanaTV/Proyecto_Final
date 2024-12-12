import { Injectable } from "@angular/core";
import { CanActivate,ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { AuthService } from "../backend/services/auth.service";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class AuthGuard implements CanActivate{
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        // Verifica si el usuario esta autenticado
        const user = this.authService.isAuthenticated();

        // Verifica si la ruta requere que el usuario sea staff
        const requiresStaff = route.data['requiresStaff'];

        if(user){
            
            if(requiresStaff && this.authService.isStaff()){
                return true;
            }
            if (!requiresStaff) {
                return true;
            }

        }
        this.router.navigate(['/login']);
        return false;
    }

    // canActivate(): boolean {
    //     if (this.authService.isAuthenticated()) {
    //         return true;
    //     } else {
    //         this.router.navigate(['/login']);
    //         return false;
    //     }
    // }

    isAuth(): boolean {
        return this.authService.isAuthenticated();
    }

    isStaff(): boolean {
        return this.authService.isStaff();
    }
}
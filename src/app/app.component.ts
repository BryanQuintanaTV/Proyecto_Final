import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';


// Import Navbar
import { NavbarComponent } from './shared/navbar/navbar.component';
// Import Footer
import { FooterComponent } from './shared/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})


export class AppComponent implements OnInit{

  constructor(private primengConfig: PrimeNGConfig, private router: Router) { }


  ngOnInit() {
    this.primengConfig.ripple = true;

    this.primengConfig.zIndex = {
      modal: 1100,    // dialog, sidebar
      overlay: 1000,  // dropdown, overlaypanel
      menu: 1000,     // overlay menus
      tooltip: 1100   // tooltip
  };

  }

  hasRoute(route: string) {
    return this.router.url.includes(route);
  }

}

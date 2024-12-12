import { Component, OnInit } from '@angular/core';
import { AuthGuard } from '../../security/authGuard';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  constructor(private authGuard: AuthGuard) { }
  isAuth: boolean = false;
  
  members: any = [
    {
      name: 'Quintana Juarez Bryan Alexis',
      numControl: 21550295
    }, {
      name: 'Marquez Torres Gabriel Josue',
      numControl: 21550316
    }, {

      name: 'Martinez Chavez Edgar Alejandro',
      numControl: 21550364
    }, {
      name: 'Murillo Andrade Sebastian Emilio',
      numControl: 21550384
  },
  ];

  ngOnInit() {

    this.isAuth = this.authGuard.isAuth();
      
  }
}

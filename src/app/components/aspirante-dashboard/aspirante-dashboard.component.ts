import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-aspirante-dashboard',
  imports: [RouterModule],
  templateUrl: './aspirante-dashboard.component.html',
  styleUrl: './aspirante-dashboard.component.css'
})
export class AspiranteDashboardComponent {
  nombre: string = 'Usuario';

  constructor(private router: Router){}
  /*
nombre: string = 'Cargando...';

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUser().subscribe(
      (data) => {
        this.nombre = data.nombre; // Ajusta esto según la estructura de la respuesta de tu API
      },
      (error) => {
        console.error('Error al obtener el usuario', error);
        this.nombre = 'Usuario no encontrado';
      }
    );
  }

  */
}

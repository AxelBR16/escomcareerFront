import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
@Component({
  selector: 'app-aspirante-dashboard',
  imports: [],
  templateUrl: './aspirante-dashboard.component.html',
  styleUrl: './aspirante-dashboard.component.css'
})
export class AspiranteDashboardComponent {
  nombre: string = 'Usuario';

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

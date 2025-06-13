import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PreguntasService } from '../../services/preguntas.service';
@Component({
  selector: 'app-aspirante-dashboard',
  imports: [RouterModule],
  templateUrl: './aspirante-dashboard.component.html',
  styleUrl: './aspirante-dashboard.component.css'
})
export class AspiranteDashboardComponent {
  nombre: string = 'Usuario';

  constructor(private router: Router,
    private preguntasService: PreguntasService
  ){}


  async obtenerRespuestasMasAltas(email: string): Promise<void> {
  try {
    // Realizamos las llamadas a la API para obtener las respuestas de los tres inventarios
    const inv1 = this.preguntasService.obtenerRespuestasMasAlta(email, 'inv1').toPromise();
    const inv2 = this.preguntasService.obtenerRespuestasMasAlta(email, 'inv2').toPromise();
    const inv3 = this.preguntasService.obtenerRespuestasMasAlta(email, 'inv3').toPromise();

    // Esperar a que se resuelvan todas las promesas
    const respuestas = await Promise.all([inv1, inv2, inv3]);

    // Guardar las respuestas en localStorage bajo claves específicas para cada inventario
    localStorage.setItem('preguntainicial_inv1', respuestas[0].toString());
    localStorage.setItem('preguntainicial_inv2', respuestas[1].toString());
    localStorage.setItem('preguntainicial_inv3', respuestas[2].toString());

    console.log('Respuestas guardadas en localStorage:');
    console.log(`inv1: ${respuestas[0]}, inv2: ${respuestas[1]}, inv3: ${respuestas[2]}`);

  } catch (error) {
    console.error('Error al obtener las respuestas más altas de los inventarios:', error);
  }
}

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

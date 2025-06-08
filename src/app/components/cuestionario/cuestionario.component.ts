import { Component, inject, OnInit} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PreguntasService } from '../../services/preguntas.service';
import { RespuestaService } from '../../services/respuesta.service';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cuestionario',
  imports: [CommonModule, RouterModule],
  templateUrl: './cuestionario.component.html',
  styleUrl: './cuestionario.component.css'
})

export class CuestionarioComponent implements OnInit{
  private snackBar = inject(MatSnackBar);
  pruebasPreferenciasCompletadas: boolean = false;
  progreso: number = 0;
  totalPreguntas: number = 60;
  preguntainicial: string = '001';

  constructor(private preguntasService: PreguntasService, private router: Router, private respuestaService: RespuestaService, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getCurrentUserEmail().then(email => {
        this.verificarCuestionario(email!);
      });
    }

    verificarCuestionario(email: string) {
       this.preguntasService.obtenerRespuestasMasAlta(email!, 'inv3').subscribe(
        (respuestaMasAlta) => {
          if (respuestaMasAlta) {
            this.pruebasPreferenciasCompletadas = true;
            this.calcularProgreso(respuestaMasAlta);
          }
        },
        (error) => console.error(`Error al obtener la respuesta más alta para inv3:`, error)
      );
  }

  calcularProgreso(id: any) {
    this.progreso = (id / this.totalPreguntas) * 100;
    this.preguntainicial = id.toString().padStart(3, '0');
  }


  redirigir() {
     if (this.progreso === 100) {
    this.router.navigate(['/result-uni']);
    return;
    }
    const ruta = this.pruebasPreferenciasCompletadas ? `/universitario/preguntas/inv3-${this.preguntainicial}` : '/instrucciones/universitario';
    this.router.navigate([ruta]);
  }

  mostrarAlertaAntesDeSeguir() {
  const puntajeCompleto = this.progreso === 100;

  if (!puntajeCompleto) {
  this.snackBar.open('⚠️ No has terminado tu inventario. 📋 Debes completarlo al 100% para poder continuar. 🔒', 'OK', {
    duration: 9000,
    panelClass: ['custom-snackbar-error']
  });
    return;
  }
  this.snackBar.open('🎉 ¡Primer inventario completado con éxito!. Puedes continuar con los demás inventarios. 🚀', 'OK', {
    duration: 9000,
    panelClass: ['custom-snackbar']
  });
  this.router.navigate(['/pruebasA']);
}


}

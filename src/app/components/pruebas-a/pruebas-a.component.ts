import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PreguntasService } from '../../services/preguntas.service';

@Component({
  selector: 'app-pruebas-a',
  imports: [CommonModule, RouterModule],
  templateUrl: './pruebas-a.component.html',
  styleUrl: './pruebas-a.component.css'
})
export class PruebasAComponent implements OnInit {
  pruebasAptitudesCompletadas: boolean = false;
  progreso: number = 0;
  totalPreguntas: number = 120;
  preguntainicial: string = '001';

  constructor(private preguntasService: PreguntasService,  private router: Router) {}

  ngOnInit(): void {
    this.verificarCuestionario();
  }

  verificarCuestionario() {
    const respuestasGuardadas = sessionStorage.getItem('respuestasUsuario');

    if (respuestasGuardadas) {
      const respuestas = JSON.parse(respuestasGuardadas);
      this.pruebasAptitudesCompletadas = true;
      this.calcularProgreso(respuestas);
    } else {
      this.preguntasService.obtenerRespuestasUsuario(sessionStorage.getItem('email')!).subscribe(
        (respuestas) => {
          if (respuestas && respuestas.length > 0) {
            this.pruebasAptitudesCompletadas = true;
            sessionStorage.setItem('respuestasUsuario', JSON.stringify(respuestas));
            this.calcularProgreso(respuestas);
          }
        },
        (error) => {
          console.error('Error al obtener respuestas del usuario', error);
        }
      );
    }
  }

  calcularProgreso(respuestas: any[]) {
    let idsPreguntas = respuestas.map(r => parseInt(r.id_pregunta.replace('inv1-', '')));
    let maxPregunta = Math.max(...idsPreguntas);
    this.preguntainicial = maxPregunta.toString().padStart(3, '0');
    this.progreso = (maxPregunta / this.totalPreguntas) * 100;
  }

  redirigir() {
    const ruta = this.pruebasAptitudesCompletadas ? `/aptitudes/preguntas/inv1-${this.preguntainicial}` : '/instrucciones/aptitudes';
    this.router.navigate([ruta]);
  }

}

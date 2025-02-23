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
  pruebasInteresesCompletadas: boolean = false;
  progresoIntereses: number = 0;
  
  // Variables separadas para cada inventario
  preguntaInicialAptitudes: string = '001';
  preguntaInicialIntereses: string = '001';

  constructor(private preguntasService: PreguntasService,  private router: Router) {}

  ngOnInit(): void {
    this.verificarCuestionario();
  }

  verificarCuestionario() {
    // Obtener progreso desde localStorage primero
    const progresoAptitudes = localStorage.getItem('progreso_inv1');
    const progresoIntereses = localStorage.getItem('progreso_inv2');
  
    if (progresoAptitudes) this.progreso = parseFloat(progresoAptitudes);
    if (progresoIntereses) this.progresoIntereses = parseFloat(progresoIntereses);
  
    // Cargar respuestas desde localStorage
    const respuestasAptitudes = localStorage.getItem('respuestasUsuario_inv1');
    const respuestasIntereses = localStorage.getItem('respuestasUsuario_inv2');
  
    if (respuestasAptitudes) {
      const respuestas: { id_pregunta: string }[] = JSON.parse(respuestasAptitudes);
      this.pruebasAptitudesCompletadas = respuestas.length > 0;
      this.calcularProgreso(respuestas, 'inv1');
    } else {
      this.cargarRespuestasDesdeAPI('inv1');
    }
  
    if (respuestasIntereses) {
      const respuestas: { id_pregunta: string }[] = JSON.parse(respuestasIntereses);
      this.pruebasInteresesCompletadas = respuestas.length > 0;
      this.calcularProgreso(respuestas, 'inv2');
    } else {
      this.cargarRespuestasDesdeAPI('inv2');
    }
  }
  

  cargarRespuestasDesdeAPI(tipoInventario: string) {
    this.preguntasService.obtenerRespuestasUsuario(sessionStorage.getItem('email')!).subscribe(
      (respuestas: { id_pregunta: string }[]) => {
        const respuestasFiltradas = respuestas.filter(r => r.id_pregunta.startsWith(tipoInventario));

        if (respuestasFiltradas.length > 0) {
          localStorage.setItem(`respuestasUsuario_${tipoInventario}`, JSON.stringify(respuestasFiltradas));
          this.calcularProgreso(respuestasFiltradas, tipoInventario);

          if (tipoInventario === 'inv1') {
            this.pruebasAptitudesCompletadas = true;
          } else {
            this.pruebasInteresesCompletadas = true;
          }
        }
      },
      (error) => {
        console.error(`Error al obtener respuestas del usuario (${tipoInventario})`, error);
      }
    );
  }

  calcularProgreso(respuestas: { id_pregunta: string }[], tipoInventario: string) {
    let totalPreguntas = tipoInventario === 'inv1' ? 120 : 130;
    let idsPreguntas = respuestas
      .filter(r => r.id_pregunta.startsWith(tipoInventario))
      .map(r => parseInt(r.id_pregunta.replace(`${tipoInventario}-`, '')))
      .filter(num => !isNaN(num));

    if (idsPreguntas.length === 0) {
      if (tipoInventario === 'inv1') {
        this.progreso = 0;
      } else {
        this.progresoIntereses = 0;
      }
      return;
    }

    let maxPregunta = Math.max(...idsPreguntas);
    let progresoCalculado = (maxPregunta / totalPreguntas) * 100;

    if (tipoInventario === 'inv1') {
      this.preguntaInicialAptitudes = maxPregunta.toString().padStart(3, '0');
      this.progreso = progresoCalculado;
    } else {
      this.preguntaInicialIntereses = maxPregunta.toString().padStart(3, '0');
      this.progresoIntereses = progresoCalculado;
    }
  }

  redirigir() {
    const ruta = this.pruebasAptitudesCompletadas 
      ? `/aptitudes/preguntas/inv1-${this.preguntaInicialAptitudes}` 
      : '/instrucciones/aptitudes';
    this.router.navigate([ruta]);
  }

  redirigirIntereses() {
    const ruta = this.pruebasInteresesCompletadas 
      ? `/intereses/preguntas/inv2-${this.preguntaInicialIntereses}` 
      : '/instrucciones/intereses';
    this.router.navigate([ruta]);
  }
}

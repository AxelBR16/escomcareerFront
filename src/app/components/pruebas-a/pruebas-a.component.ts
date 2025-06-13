import { Component, OnInit,  ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PreguntasService } from '../../services/preguntas.service';
import { RespuestaService } from '../../services/respuesta.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-pruebas-a',
  imports: [CommonModule, RouterModule],
  templateUrl: './pruebas-a.component.html',
  styleUrl: './pruebas-a.component.css'
})
export class PruebasAComponent implements OnInit {
  pruebasCompletadas: { aptitudes: boolean, intereses: boolean } = { aptitudes: false, intereses: false };
  progreso: { aptitudes: number, intereses: number } = { aptitudes: 0, intereses: 0 };
  totalPreguntas: { aptitudes: number, intereses: number } = { aptitudes: 120, intereses: 130 };
  preguntainicial: { aptitudes: string, intereses: string } = { aptitudes: '001', intereses: '001' };

@ViewChild('videoElement') videoElement: any;

  constructor(private preguntasService: PreguntasService, private router: Router, private respuestaService: RespuestaService, private authService: AuthService) {}

   ngOnInit(): void {
    this.authService.getCurrentUserEmail().then(email => {
        this.verificarCuestionarios(email!);
      });
    }

verificarCuestionarios(email: string) {
  ['inv1', 'inv2'].forEach((inv, index) => {
    const lastQuestionId = localStorage.getItem(`${inv}_preguntainicial`);
    if (lastQuestionId) {
      const questionNumber = parseInt(lastQuestionId);
      if (!isNaN(questionNumber)) {
        const tipo = index === 0 ? 'aptitudes' : 'intereses';
        this.pruebasCompletadas[tipo] = true;
        this.calcularProgreso(questionNumber, tipo);
      } else {
        console.error(`Error al extraer el número de la pregunta desde el ID para ${inv}`);
      }
    } else {
      this.preguntasService.obtenerRespuestasMasAlta(email!, inv).subscribe(
        (respuestaMasAlta) => {
          if (respuestaMasAlta) {
            const tipo = index === 0 ? 'aptitudes' : 'intereses';
            this.pruebasCompletadas[tipo] = true;
            this.calcularProgreso(respuestaMasAlta, tipo);
          }
        },
        (error) => console.error(`Error al obtener la respuesta más alta para ${inv}:`, error)
      );
    }
  });
}


  calcularProgreso(id: any, tipo: 'aptitudes' | 'intereses') {
    const total = tipo === 'aptitudes' ? this.totalPreguntas.aptitudes : this.totalPreguntas.intereses;
    const progreso = (id / total) * 100;
    this.progreso[tipo] = progreso;
    this.preguntainicial[tipo] = id.toString().padStart(3, '0');

  }

  redirigir(tipo: 'aptitudes' | 'intereses') {
  if (tipo === 'aptitudes' && this.progreso.aptitudes === 100) {
    this.router.navigate(['/result-aptitudes']);
    return;
  }

   if (tipo === 'intereses' && this.progreso.intereses === 100) {
    this.router.navigate(['/result-intereses']);
    return;
  }

  const ruta = this.pruebasCompletadas[tipo]
    ? `/${tipo}/preguntas/${tipo === 'aptitudes' ? 'inv1' : 'inv2'}-${this.preguntainicial[tipo]}`
    : `/instrucciones/${tipo}`;

  this.router.navigate([ruta]);
}


ngAfterViewInit(): void {
    const video = this.videoElement.nativeElement;
    
    // Aseguramos que el video esté listo para reproducirse
    video.load();  // Forza la recarga del video
    video.play();  // Reproduce el video
  }


}

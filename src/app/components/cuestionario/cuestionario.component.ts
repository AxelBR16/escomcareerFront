import { Component, OnInit} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PreguntasService } from '../../services/preguntas.service';
import { RespuestaService } from '../../services/respuesta.service';

@Component({
  selector: 'app-cuestionario',
  imports: [CommonModule, RouterModule],
  templateUrl: './cuestionario.component.html',
  styleUrl: './cuestionario.component.css'
})

export class CuestionarioComponent {
  pruebasAptitudesCompletadas: boolean = false;
  progreso: number = 0;
  totalPreguntas: number = 120;
  preguntainicial: string = '001';

  constructor(private preguntasService: PreguntasService, private router: Router, private respuestaService: RespuestaService) {}


  redirigir() {
    const ruta = this.pruebasAptitudesCompletadas ? `/universitario/preguntas/inv3-${this.preguntainicial}` : '/instrucciones/universitario';
    this.router.navigate([ruta]);
  }

}

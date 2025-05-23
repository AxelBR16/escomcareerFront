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

export class CuestionarioComponent implements OnInit{
  pruebasPreferenciasCompletadas: boolean = false;
  progreso: number = 0;
  totalPreguntas: number = 60;
  preguntainicial: string = '001';

  constructor(private preguntasService: PreguntasService, private router: Router, private respuestaService: RespuestaService) {}

  ngOnInit(): void {
    this.verificarCuestionario();
    console.log('hola')
  }

    verificarCuestionario() {
       this.preguntasService.obtenerRespuestasMasAlta(sessionStorage.getItem('email')!, 'inv3').subscribe(
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
    const ruta = this.pruebasPreferenciasCompletadas ? `/universitario/preguntas/inv3-${this.preguntainicial}` : '/instrucciones/universitario';
    this.router.navigate([ruta]);
  }

}

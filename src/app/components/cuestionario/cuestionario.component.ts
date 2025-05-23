import { Component, OnInit} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PreguntasService } from '../../services/preguntas.service';
import { RespuestaService } from '../../services/respuesta.service';
import Swal from 'sweetalert2';

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

  mostrarAlertaAntesDeSeguir() {
  const puntajeFisicoMatematicas = this.progreso;

  Swal.fire({
    title: 'Antes de seguir',
    html: `
    Aseguarte de completar el inventario.<br><br>
      ${puntajeFisicoMatematicas > 10
        ? '<b>Felicidades, tu puntaje en del cuestionario esta completo al 100%</b>. Puedes contestar los demás cuestionarios.'
        : '<b>No haz termiando tu invenatario</b>, aún así, puedes contestar los demás cuestionarios, pero nuestro modelo de recomendación no sera tan preciso con tu perfil. '}
    `,
    icon: 'info',
    showCancelButton: true,
    confirmButtonText: 'Continuar',
    cancelButtonText: 'Cancelar',
    focusConfirm: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    customClass: {
      popup: 'swal2-popup-custom'
    }
  }).then((result) => {
    if (result.isConfirmed) {
      this.router.navigate(['/pruebasA']); 
    }
  });
}


}

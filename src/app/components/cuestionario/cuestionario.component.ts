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
     if (this.progreso === 100) {
    this.router.navigate(['/result-uni']);
    return;
    }
    const ruta = this.pruebasPreferenciasCompletadas ? `/universitario/preguntas/inv3-${this.preguntainicial}` : '/instrucciones/universitario';
    this.router.navigate([ruta]);
  }

  mostrarAlertaAntesDeSeguir() {
  const puntajeCompleto = this.progreso === 100;

  if (puntajeCompleto) {
    Swal.fire({
      title: 'Inventario incompleto',
      html: 'No has terminado tu inventario. Debes completarlo al 100% para poder continuar.',
      icon: 'warning',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: {
        popup: 'swal2-popup-custom'
      }
    });
    return; // No permite continuar ni redirigir
  }

  // Si está completo, permite continuar con la alerta y opción a confirmar
  Swal.fire({
    title: 'Inventario completo',
    html: '<b>Felicidades, tu puntaje en el cuestionario está completo al 100%.</b> Puedes contestar los demás cuestionarios.',
    icon: 'success',
    confirmButtonText: 'Continuar',
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

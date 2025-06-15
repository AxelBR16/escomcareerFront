import { Component, inject, OnInit} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
  totalPreguntas: number = 59;
  preguntainicial: string = '001';
  id: string;

  constructor(private aRouter: ActivatedRoute,private preguntasService: PreguntasService, private router: Router, private respuestaService: RespuestaService, private authService: AuthService) {
     this.id = this.aRouter.snapshot.paramMap.get('id') || '1';
  }

  ngOnInit(): void {
    this.authService.getCurrentUserEmail().then(email => {
        this.verificarCuestionario(email!);
        console.log(email);
      });
    }

verificarCuestionario(email: string) {
  const lastQuestionId = localStorage.getItem(`preguntainicial_inv3`);
  if (lastQuestionId) {
    const questionNumber = parseInt(lastQuestionId);
    if (!isNaN(questionNumber)) {
      this.pruebasPreferenciasCompletadas = true;
      this.calcularProgreso(questionNumber);
    } else {
      console.error('Error al extraer el número de la pregunta desde el ID');
    }
  } else {
    this.preguntasService.obtenerRespuestasMasAlta(email!, 'inv3').subscribe(
      (respuestaMasAlta) => {
        if (respuestaMasAlta) {
          this.pruebasPreferenciasCompletadas = true;
          this.calcularProgreso(respuestaMasAlta);
        }
      },
      (error) => console.error(`Error al obtener la respuesta más alta para inv3:`, error.error?.message || error.message)
    );
  }
}

  calcularProgreso(id: any) {
    this.progreso = (id / this.totalPreguntas) * 100;
    this.preguntainicial = id.toString().padStart(3, '0');
  }


 redirigir() {
  if (this.progreso >= 100) {
    this.router.navigate(['/result-uni']).then(() => {
      window.scrollTo(0, 0); // Esto hace scroll hacia arriba
    });
    return;
  }
  
  const ruta = this.pruebasPreferenciasCompletadas 
    ? `/universitario/preguntas/inv3-${this.preguntainicial}` 
    : '/instrucciones/universitario';
  
  this.router.navigate([ruta]).then(() => {
    window.scrollTo(0, 0); // Esto hace scroll hacia arriba
  });
}


  mostrarAlertaAntesDeSeguir() {
  const puntajeCompleto = this.progreso >= 100;

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

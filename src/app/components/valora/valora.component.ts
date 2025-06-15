import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RetroalimentacionService } from '../../services/retroalimentacion.service';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar'; // Importar MatSnackBar

@Component({
  selector: 'app-valora',
  imports: [FormsModule, CommonModule],
  templateUrl: './valora.component.html',
  styleUrl: './valora.component.css'
})
export class ValoraComponent {

  constructor(
    private retroalimentacionService: RetroalimentacionService,
    private snackBar: MatSnackBar, // Inyectar MatSnackBar
    private authService: AuthService
  ) {}

  emailUsuario: string = '';
  enviado = false;
  preguntas = [
    { texto: '¿Cómo calificarías tu experiencia general con el sistema?', valor: 0 },
    { texto: '¿Qué tan útil fue la recomendación de carrera que te proporcionó el sistema para tu decisión final?', valor: 0 },
    { texto: '¿Qué te parecieron las experiencias y proyectos mostrados en la página?', valor: 0 },
    { texto: '¿Recomendarías este sistema a otros aspirantes?', valor: 0 }
  ];

  async ngOnInit() {
    const email = await this.authService.getCurrentUserEmail();
    this.emailUsuario = email!;
  }

  setValor(index: number, value: number): void {
    this.preguntas[index].valor = value;
  }

  // Validación antes de enviar el formulario
  validateForm(): boolean {
    return this.preguntas.every(pregunta => pregunta.valor !== 0);
  }

  onSubmit(): void {
  if (!this.validateForm()) {
  this.snackBar.open('Por favor, responde todas las preguntas antes de enviar, Gracias.', 'Cerrar', {
     duration: 4000,
        panelClass: ['warning-snackbar']
  });
  return;
}


    const respuestas = {
      general: this.preguntas[0].valor,
      experiencias: this.preguntas[1].valor,
      recomendacion: this.preguntas[2].valor,
      sistema: this.preguntas[3].valor
    };

    this.retroalimentacionService.saveRetroalimentacion(this.emailUsuario, respuestas).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: '¡Gracias por tu retroalimentación!',
          text: 'Tu respuesta ha sido enviada exitosamente.',
          confirmButtonText: 'Aceptar'
        });
        this.enviado = true;
      },
      error: (error) => {
        if (error.status === 409) {
          Swal.fire({
            icon: 'error',
            title: '¡Oops!',
            text: 'Parece que ya has enviado tu retroalimentación. ¡Gracias por tu participación!',
            confirmButtonText: 'Aceptar'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Ocurrió un error',
            text: 'Hubo un problema al guardar tu retroalimentación.',
            confirmButtonText: 'Aceptar'
          });
        }
      }
    });
  }
}
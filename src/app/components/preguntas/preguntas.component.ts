import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PreguntasService } from '../../services/preguntas.service';
import { LoaderService } from '../../services/loader.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Pregunta } from '../../models/pregunta';

@Component({
  selector: 'app-preguntas',
  templateUrl: './preguntas.component.html',
  imports: [CommonModule, RouterModule, FormsModule],
  styleUrls: ['./preguntas.component.css'],
})
export class PreguntasComponent implements OnInit {
  id: string;
  pregunta: Pregunta = { id: '', texto: '', imagen_url: '' };
  selectedAnswer: string | null = null;
  currentQuestion: number = 0;
  isAnswered: boolean = false;
  progress: number = 0;
  tipo: string | null = null;
  userAnswers: (string | null)[] = [];
  totalQuestions = 100;
  currentQuestionId: string = '';
  loading: boolean = false;
  private storageKey: string = '';

  constructor(
    private preguntasService: PreguntasService,
    private loader: LoaderService,
    private sanitizer: DomSanitizer,
    private aRouter: ActivatedRoute,
    private router: Router
  ) {
    this.id = this.aRouter.snapshot.paramMap.get('id') || '1';
  }

  ngOnInit() {
    this.tipo = this.aRouter.snapshot.paramMap.get('tipo');
    // Crear una clave única para el almacenamiento basada en el tipo de prueba y el email del usuario
    const email = sessionStorage.getItem('email') || 'usuario';
    this.storageKey = `respuestas_${this.tipo}_${email}`;

    this.aRouter.paramMap.subscribe(params => {
      this.id = params.get('id')!;
      if (this.id) {
        // Configurar el total de preguntas según el tipo
        if (this.id.startsWith('inv1')) {
          this.totalQuestions = 120;
        } else if (this.id.startsWith('inv2')) {
          this.totalQuestions = 130;
        } else if (this.id.startsWith('inv3')) {
          this.totalQuestions = 60;
        }

        // Calcular el progreso actual
        const currentIdNumber = parseInt(this.id.split('-')[1]);
        if (!isNaN(currentIdNumber)) {
          this.progress = (currentIdNumber / this.totalQuestions) * 100;
        }

        this.getPregunta(this.id);
        // Cargar la respuesta guardada para esta pregunta
        this.cargarRespuestaGuardada();
      } else {
        console.error('El parámetro id no está presente en la URL.');
      }
    });
  }

  getPregunta(id: string) {
    this.loading = true;
    this.loader.mostrarCargando('Cargando pregunta...');
    this.preguntasService.getPregunta(id).subscribe(
      (response: any) => {
        this.loader.ocultarCargando();
        this.loading = false;
        this.pregunta = {
          id: response.id,
          texto: response.texto,
          imagen_url: this.sanitizer.bypassSecurityTrustUrl(response.imagen_url)
        };
        // Cargar respuesta guardada después de obtener la pregunta
        this.cargarRespuestaGuardada();
      },
      (error) => {
        this.loader.ocultarCargando();
        this.loading = false;
        const errorMessage = error.error && error.error.message
          ? error.error.message
          : 'Ocurrió un error desconocido.';
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar la pregunta',
          text: errorMessage,
          confirmButtonText: 'Aceptar'
        });
      }
    );
  }

  // Método para cargar la respuesta guardada
  cargarRespuestaGuardada() {
    // Obtener las respuestas guardadas
    const respuestasGuardadas = this.obtenerRespuestasGuardadas();

    // Verificar si hay una respuesta guardada para la pregunta actual
    if (respuestasGuardadas[this.id]) {
      this.selectedAnswer = respuestasGuardadas[this.id];
      this.isAnswered = true;
    } else {
      this.selectedAnswer = null;
      this.isAnswered = false;
    }
  }

  // Método para obtener todas las respuestas guardadas
  obtenerRespuestasGuardadas(): { [key: string]: string } {
    const respuestasJSON = localStorage.getItem(this.storageKey);
    return respuestasJSON ? JSON.parse(respuestasJSON) : {};
  }

  // Método para guardar la respuesta actual
  guardarRespuesta() {
    if (this.selectedAnswer) {
      const respuestasGuardadas = this.obtenerRespuestasGuardadas();
      respuestasGuardadas[this.id] = this.selectedAnswer;
      localStorage.setItem(this.storageKey, JSON.stringify(respuestasGuardadas));
      this.isAnswered = true;
    }
  }

  onOptionChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.selectedAnswer = inputElement.value;
    this.guardarRespuesta();
  }

  next() {
    if (this.selectedAnswer) {
      const email = sessionStorage.getItem('email');
      console.log('Respuesta seleccionada:', this.selectedAnswer);
      console.log('ID de la pregunta:', this.id);

      const currentIdNumber = parseInt(this.id.split('-')[1]);

      if (!isNaN(currentIdNumber)) {
        const nextIdNumber = currentIdNumber + 1;
        const currentIdinventario = this.id.split('-')[0];
        this.progress = (nextIdNumber / this.totalQuestions) * 100;

        if (nextIdNumber <= this.totalQuestions) {
          const nextId = `${currentIdinventario}-${nextIdNumber.toString().padStart(3, '0')}`;
          this.router.navigate([`${this.tipo}/preguntas/${nextId}`]);
        } else {
          this.mostrarDialogoFinal();
        }
      } else {
        console.error('Formato de ID no válido');
      }
    } else {
      Swal.fire({
        title: 'Atención',
        text: 'Por favor, selecciona una respuesta antes de continuar.',
        icon: 'warning',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#007bff',
      });
    }
  }

  prev() {
    const currentIdNumber = parseInt(this.id.split('-')[1]);
    const currentIdinventario = this.id.split('-')[0];

    if (!isNaN(currentIdNumber)) {
      const prevIdNumber = currentIdNumber - 1;
      if (prevIdNumber >= 1) {
        const prevId = `${currentIdinventario}-${prevIdNumber.toString().padStart(3, '0')}`;
        this.router.navigate([`${this.tipo}/preguntas/${prevId}`]);
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Primera pregunta',
          text: 'No puedes retroceder más allá de la primera pregunta',
          confirmButtonText: 'Aceptar'
        });
      }
    } else {
      console.error('Formato de ID no válido');
    }
  }

  // Método para enviar todas las respuestas al finalizar el cuestionario


  // Mostrar diálogo de finalización
  mostrarDialogoFinal() {
    Swal.fire({
      title: '¡Cuestionario completado!',
      text: '¿Deseas enviar todas tus respuestas?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, enviar ahora',
      cancelButtonText: 'Revisar respuestas',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#007bff',
    }).then((result) => {
      if (result.isConfirmed) {

      } else {
        // Opción para revisar respuestas: navegar a la primera pregunta o mostrar resumen
        Swal.fire({
          title: 'Revisión',
          text: 'Puedes navegar entre las preguntas para revisar tus respuestas antes de enviar',
          icon: 'info',
          confirmButtonText: 'Entendido'
        });
      }
    });
  }

  // Método para revisar si todas las preguntas están respondidas
  verificarTodasRespondidas(): {completo: boolean, faltantes: string[]} {
    const respuestasGuardadas = this.obtenerRespuestasGuardadas();
    const faltantes: string[] = [];

    const currentIdinventario = this.id.split('-')[0];

    for (let i = 1; i <= this.totalQuestions; i++) {
      const idPregunta = `${currentIdinventario}-${i.toString().padStart(3, '0')}`;
      if (!respuestasGuardadas[idPregunta]) {
        faltantes.push(idPregunta);
      }
    }

    return {
      completo: faltantes.length === 0,
      faltantes: faltantes
    };
  }

  // Método para ir a una pregunta específica (útil para revisar)
  irAPregunta(idPregunta: string) {
    this.router.navigate([`${this.tipo}/preguntas/${idPregunta}`]);
  }
}

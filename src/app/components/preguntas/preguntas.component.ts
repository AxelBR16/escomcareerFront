import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PreguntasService } from '../../services/preguntas.service';
import { LoaderService } from '../../services/loader.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Pregunta } from '../../models/pregunta';
import { Respuesta } from '../../models/respuesta';
import { RespuestaService } from '../../services/respuesta.service';


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
  inventario: number = 1;
  userAnswers: (string | null)[] = [];
  totalQuestions = 100;
  currentQuestionId: string = '';
  loading: boolean = false;
  private storageKey: string = '';
  respuestasUsuario: { [key: string]: string } = {};

  constructor(
    private preguntasService: PreguntasService,
    private loader: LoaderService,
    private sanitizer: DomSanitizer,
    private aRouter: ActivatedRoute,
    private router: Router,
    private respuestaService: RespuestaService

  ) {
    this.id = this.aRouter.snapshot.paramMap.get('id') || '1';
  }

  ngOnInit() {
    this.tipo = this.aRouter.snapshot.paramMap.get('tipo');
    const email = sessionStorage.getItem('email') || 'usuario';
    this.storageKey = `respuestas_${this.tipo}_${email}`;

    this.aRouter.paramMap.subscribe(params => {
      this.id = params.get('id')!;
      if (this.id) {
        this.cargarPreguntas();
        this.cargarRespuestasAPI()
        this.determinarTotalPreguntas();
      }
    });
  }

  determinarTotalPreguntas() {
    if (this.id.startsWith('inv1')) {
      this.totalQuestions = 120;
      this.inventario = 1;
    } else if (this.id.startsWith('inv2')) {
      this.totalQuestions = 130;
      this.inventario = 2;
    } else if (this.id.startsWith('inv3')) {
      this.totalQuestions = 60;
      this.inventario = 3;
    }
  }
  getPreguntaDesdeStorage() {
    const preguntas = JSON.parse(localStorage.getItem('preguntas') || '[]');
    const preguntaEncontrada = preguntas.find((p: Pregunta) => p.id === this.id) || { id: '', texto: '', imagen_url: '' };

    if (preguntaEncontrada.imagen_url) {
      this.determinarTotalPreguntas();
      preguntaEncontrada.imagen_url = this.sanitizer.bypassSecurityTrustUrl(preguntaEncontrada.imagen_url);
      let maxPregunta = parseInt(this.id.split('-')[1]);
      this.progress = (maxPregunta / this.totalQuestions) * 100;
      this.cargarRespuestaGuardada(this.id)

    }
    this.pregunta = preguntaEncontrada;
  }


  cargarPreguntas() {
    const preguntasGuardadas = localStorage.getItem('preguntas');

    if (preguntasGuardadas) {
      this.getPreguntaDesdeStorage();
    } else {
      this.preguntasService.getPreguntas(this.inventario).subscribe(
        (preguntas: Pregunta[]) => {
          localStorage.setItem('preguntas', JSON.stringify(preguntas));
          this.getPreguntaDesdeStorage();
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al cargar las preguntas',
            text: error.error?.message || 'Ocurrió un error desconocido.',
            confirmButtonText: 'Aceptar'
          });
          this.router.navigate(['/pruebasA']);
        }
      );
    }
  }
  cargarRespuestasAPI() {

    const respuestasGuardadas = sessionStorage.getItem('respuestasUsuario');
    this.loading = true;

    if (respuestasGuardadas) {
      this.respuestasUsuario = JSON.parse(respuestasGuardadas);
      this.getPreguntaDesdeStorage();
      this.loader.ocultarCargando();
    } else {
      this.preguntasService.obtenerRespuestasUsuario(sessionStorage.getItem('email')!).subscribe(
        (respuestas: Record<string, number>) => {
          sessionStorage.setItem('respuestasUsuario', JSON.stringify(respuestas));
          this.getPreguntaDesdeStorage();
        },
        () => this.getPreguntaDesdeStorage()
      );
      this.loader.ocultarCargando();
    }
  }


  cargarRespuestaGuardada(id: string) {
    const respuestasGuardadas = this.obtenerRespuestasGuardadas();
    const valor = this.respuestasUsuario[id];
    if (valor) {
      this.selectedAnswer = valor.toString();
      this.isAnswered = true;
    } else {
      this.selectedAnswer = null;
      this.isAnswered = false;
    }
  }

  obtenerRespuestasGuardadas(): { [key: string]: Respuesta} {
    const respuestasJSON = sessionStorage.getItem('respuestasUsuario');
    return respuestasJSON ? JSON.parse(respuestasJSON) : {};
  }

  guardarRespuesta() {
    if (this.selectedAnswer) {
      this.respuestasUsuario[this.id] = this.selectedAnswer;
      sessionStorage.setItem('respuestasUsuario', JSON.stringify(this.respuestasUsuario));
      this.isAnswered = true;
    }
  }


  onOptionChange(event: Event): void {
    this.selectedAnswer = (event.target as HTMLInputElement).value;
    this.guardarRespuesta();
  }

  enviarRespuestas(valorR: number, id: string) {
    const respuesta: Respuesta = {
      valor: valorR,
      id_Pregunta: id,
      emailAspirante: sessionStorage.getItem('email')!
    };
    this.preguntasService.saveRespuesta(respuesta).subscribe(
      (response: any) => {
        // Respuesta enviada correctamente
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al guardar la respuesta',
          text: error.error?.message || 'Ocurrió un error desconocido.',
          confirmButtonText: 'Aceptar'
        });
        this.prev();
      }
    );
  }

  next() {
    if (this.selectedAnswer) {
      this.enviarRespuestas(parseInt(this.selectedAnswer), this.id);
      const currentIdNumber = parseInt(this.id.split('-')[1]);
      if (!isNaN(currentIdNumber)) {
        const nextIdNumber = currentIdNumber + 1;
        if (nextIdNumber <= this.totalQuestions) {
          this.router.navigate([`${this.tipo}/preguntas/${this.id.split('-')[0]}-${nextIdNumber.toString().padStart(3, '0')}`]);
          this.getPreguntaDesdeStorage();
        } else {
          this.mostrarDialogoFinal();
        }
      }
    } else {
      Swal.fire({ title: 'Atención', text: 'Selecciona una respuesta antes de continuar.', icon: 'warning', confirmButtonText: 'Entendido', confirmButtonColor: '#007bff' });
    }
  }

  prev() {
    const currentIdNumber = parseInt(this.id.split('-')[1]);
    if (!isNaN(currentIdNumber) && currentIdNumber > 1) {
      this.router.navigate([`${this.tipo}/preguntas/${this.id.split('-')[0]}-${(currentIdNumber - 1).toString().padStart(3, '0')}`]);
      this.getPreguntaDesdeStorage(); // Cargar desde sessionStorage
    }
  }

  mostrarDialogoFinal() {
    Swal.fire({
      title: '¡Cuestionario completado!',
      text: '¿Deseas enviar todas tus respuestas?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, enviar ahora',
      cancelButtonText: 'Revisar respuestas',
    }).then((result) => {
      if (result.isConfirmed) {
        // Verificar respuestas antes de enviar
        this.verificarRespuestasFinales();
      } else {
        this.router.navigate(['/revisar-respuestas']);  // Redirigir a revisar respuestas si el usuario no ha terminado
      }
    });
  }

  verificarRespuestasFinales() {
    const email = sessionStorage.getItem('email') || 'usuario';

    this.respuestaService.verificarRespuestas(email).subscribe(
      (response: any) => {
        console.log('Respuesta de la API:', response);  // Verifica lo que llega de la API

        if (response && response.success !== undefined) {  // Verifica que la respuesta tenga el formato esperado
          if (response.success) {
            Swal.fire({
              title: '¡Todo listo!',
              text: 'Todas las preguntas tienen respuestas.',
              icon: 'success',
            }).then(() => {
              // Enviar las respuestas
              Object.keys(this.respuestasUsuario).forEach((key) => {
                const valorRespuesta = parseInt(this.respuestasUsuario[key]);
                this.enviarRespuestas(valorRespuesta, key);
              });
            });
          } else {
            // Verifica que preguntas_faltantes sea un arreglo y contiene datos
            if (Array.isArray(response.preguntasFaltantes) && response.preguntasFaltantes.length > 0) {
              const preguntasFaltantes = response.preguntasFaltantes.join(', '); // Aquí estamos uniendo las preguntas faltantes correctamente
              console.log('Preguntas faltantes:', preguntasFaltantes);  // Verifica que preguntas_faltantes no esté vacío

              Swal.fire({
                title: 'Faltan respuestas',
                text: `Las siguientes preguntas no tienen respuestas: ${preguntasFaltantes}`,
                icon: 'warning',
              });
            } else {
              // Si no hay preguntas faltantes, muestra el mensaje adecuado
              Swal.fire({
                title: 'Faltan respuestas',
                text: 'No se pudieron identificar las preguntas faltantes.',
                icon: 'warning',
              });
            }
          }
        } else {
          console.error('Formato de respuesta inesperado:', response);  // Diagnóstico de problemas
          Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error inesperado al verificar las respuestas.',
            icon: 'error',
          });
        }
      },
      (error) => {
        console.error('Error al verificar las respuestas:', error);  // Verifica qué está fallando
        Swal.fire({
          title: 'Error',
          text: 'Ocurrió un error al verificar las respuestas.',
          icon: 'error',
        });
      }
    );
  }







}

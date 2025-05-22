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
import { ResultadoService } from '../../services/resultado.service';

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
  respuestasUsuario: Record<string, number> = {};
  preguntasFaltantes: string[] = [];
  mensaje: string = '';
  parteIzquierda: string = '';
  option1Value: string = '1';


  constructor(
    private preguntasService: PreguntasService,
    private loader: LoaderService,
    private sanitizer: DomSanitizer,
    private aRouter: ActivatedRoute,
    private router: Router,
    private respuestaService: RespuestaService,
    private resultadoService: ResultadoService
  ) {
    this.id = this.aRouter.snapshot.paramMap.get('id') || '1';
  }

  ngOnInit() {
    this.tipo = this.aRouter.snapshot.paramMap.get('tipo');
    const email = sessionStorage.getItem('email') || 'usuario';
    this.storageKey = `respuestas_${this.tipo}_${email}`;

    this.aRouter.paramMap.subscribe(params => {
      this.id = params.get('id')!;
      this.parteIzquierda = this.id.split('-')[0];
      if(this.parteIzquierda === "inv1"){
          this.option1Value = '0';
      }
      if (this.id) {
        this.determinarTotalPreguntas();
        this.cargarPreguntas();
        this.cargarRespuestasAPI();
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
    const preguntas = JSON.parse(localStorage.getItem(`preguntas_${this.inventario}`) || '[]');
    const preguntaEncontrada = preguntas.find((p: Pregunta) => p.id === this.id) || { id: '', texto: '', imagen_url: '' };

    if (preguntaEncontrada.imagen_url) {
      this.determinarTotalPreguntas();
      preguntaEncontrada.imagen_url = this.sanitizer.bypassSecurityTrustUrl(preguntaEncontrada.imagen_url);
      let maxPregunta = parseInt(this.id.split('-')[1]);
      this.progress = (maxPregunta / this.totalQuestions) * 100;
      this.cargarRespuestaGuardada(this.id);
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
          localStorage.setItem(`preguntas_${this.inventario}`, JSON.stringify(preguntas));
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
      const email = sessionStorage.getItem('email');
      const inventario = this.id.split('-')[0]; // Esto es el"inv1" o "inv2"

      if (email && inventario) {
        this.preguntasService.obtenerRespuestasUsuario(email, inventario).subscribe(
          (respuestas: Record<string, number>) => {
            sessionStorage.setItem(`respuestasUsuario_${inventario}`, JSON.stringify(respuestas));
            this.respuestasUsuario = respuestas;
            this.getPreguntaDesdeStorage();
          },
          (error) => {
            console.error("Error al obtener respuestas: ", error);
            this.getPreguntaDesdeStorage();
          }
        );
      } else {
        console.error("No se pudo obtener el email o el inventario.");
        this.getPreguntaDesdeStorage();
      }

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

  obtenerRespuestasGuardadas(): { [key: string]: Respuesta } {
    const respuestasJSON = sessionStorage.getItem('respuestasUsuario');
    return respuestasJSON ? JSON.parse(respuestasJSON) : {};
  }

  guardarRespuesta() {
    if (this.selectedAnswer) {
      // Convertir la respuesta a número antes de guardarla
      this.respuestasUsuario[this.id] = parseInt(this.selectedAnswer);
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
        const respuestas = this.respuestasUsuario;
        const validacion = this.verificarRespuestas(respuestas);

        if (validacion) {
          // Si todas las respuestas son válidas, se pueden enviar
          this.preguntasService.obtenerRespuestasUsuario(sessionStorage.getItem('email')!, this.id.split('-')[0]!).subscribe(
            (respuestas: Record<string, number>) => {
              sessionStorage.setItem(`respuestasUsuario_${this.id.split('-')[0]}`, JSON.stringify(respuestas));
              this.respuestasUsuario = respuestas;
              this.getPreguntaDesdeStorage();
            },
            (error) => {
              console.error("Error al obtener respuestas: ", error);
              this.getPreguntaDesdeStorage();
            }
          );
        } else {
          Swal.fire({
            title: 'Faltan respuestas',
            text: `Por favor, responde todas las preguntas antes de enviar. Las preguntas faltantes son: ${this.preguntasFaltantes.join(', ')}`,
            icon: 'warning',
            confirmButtonText: 'Entendido'
          });
        }
      } else {

      }
    });
  }

  verificarRespuestas(respuestas: Record<string, number>): boolean {
    let respuestasCompletas = true;
    this.preguntasFaltantes = []; // Limpiamos las preguntas faltantes cada vez que verificamos

    for (let i = 1; i <= this.totalQuestions; i++) {
      const pregunta = `${this.id.split('-')[0]}-${String(i).padStart(3, '0')}`;

      if (!(pregunta in respuestas)) {
        respuestasCompletas = false;
        this.preguntasFaltantes.push(`${pregunta.split('-')[1]}`); // Añadimos cada pregunta faltante al array
      }
    }

    if (respuestasCompletas) {
      const email = sessionStorage.getItem('email');
      const inventario = this.parteIzquierda;
      this.loader.mostrarCargando('Calculando los resultados...');
      this.resultadoService.calcularResultado(inventario, email!).subscribe({
        next: (res) => {
          this.loader.ocultarCargando();
          Swal.fire({
            icon: 'success',
            title: 'Resultados calculados',
            text: res,
            confirmButtonText: 'Aceptar'
          }).then(() => {
        this.router.navigate(['/result-aptitudes']);
      });
      },
      error: (err) => {
        this.loader.ocultarCargando();

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error.message || 'No se pudo calcular el resultado',
          confirmButtonText: 'Aceptar'
        });
      }
    });
    }

    return respuestasCompletas;
  }
}

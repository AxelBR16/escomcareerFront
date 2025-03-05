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
    private router: Router

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
    this.loader.mostrarCargando('Cargando pregunta...');
    if (respuestasGuardadas) {
      this.respuestasUsuario = JSON.parse(respuestasGuardadas);
      this.getPreguntaDesdeStorage();
      this.loader.ocultarCargando();
    } else {
      this.preguntasService.obtenerRespuestasUsuario(sessionStorage.getItem('email')!).subscribe(
        (respuestas: { id_pregunta: string; valor: number }[]) => {
          this.respuestasUsuario = respuestas.reduce((acc, curr) => {
            acc[curr.id_pregunta] = curr.valor.toString();
            return acc;
          }, {} as { [key: string]: string });
          sessionStorage.setItem(this.storageKey, JSON.stringify(this.respuestasUsuario));
          this.getPreguntaDesdeStorage();
        },
        () => this.getPreguntaDesdeStorage()
      );
      this.loader.ocultarCargando();
    }
  }
  cargarRespuestaGuardada(id: string) {
    const respuestasGuardadas = this.obtenerRespuestasGuardadas();
    console.log(id)
    console.log(respuestasGuardadas)
    const respuesta = Object.values(respuestasGuardadas).find(respuesta => respuesta.id_Pregunta === id);
    console.log(respuesta)
    if (respuesta) {
      console.log('hola')
      this.selectedAnswer = respuesta.valor.toString();
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
      const respuestasGuardadas = this.obtenerRespuestasGuardadas();
      // respuestasGuardadas[this.id] = this.selectedAnswer;
      sessionStorage.setItem('respuestasUsuario', JSON.stringify(respuestasGuardadas));
      this.isAnswered = true;
    }
  }

  onOptionChange(event: Event): void {
    this.selectedAnswer = (event.target as HTMLInputElement).value;
    this.guardarRespuesta();
  }

  enviarRespuestas(valorR: number, id: string){
      const respuesta: Respuesta = {
        valor: valorR,
        id_Pregunta: id,
        emailAspirante: sessionStorage.getItem('email')!
      }
      this.preguntasService.saveRespuesta(respuesta).subscribe(
        (response: any) => {
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al guardar la respuesta',
            text: error.error?.message || 'Ocurrió un error desconocido.',
            confirmButtonText: 'Aceptar'
          });
          this.prev()
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
    });
  }
}

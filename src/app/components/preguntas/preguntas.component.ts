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
        if (this.id.startsWith('inv1')) {
          this.totalQuestions = 120;
        } else if (this.id.startsWith('inv2')) {
          this.totalQuestions = 130;
        } else if (this.id.startsWith('inv3')) {
          this.totalQuestions = 60;
        }

        const currentIdNumber = parseInt(this.id.split('-')[1]);
        if (!isNaN(currentIdNumber)) {
          this.progress = (currentIdNumber / this.totalQuestions) * 100;
        }
        this.cargarRespuestasAPI()
        this.getPregunta(this.id);
        this.cargarRespuestaGuardada();
      }
    });
  }

  cargarRespuestasAPI() {
    const respuestasGuardadas = sessionStorage.getItem('respuestasUsuario');

    if (respuestasGuardadas) {
      this.respuestasUsuario = JSON.parse(respuestasGuardadas);
      this.getPregunta(this.id);
    } else {
      // Si no hay respuestas en sessionStorage, hacer la petición a la API y guardarlas
      this.preguntasService.obtenerRespuestasUsuario(sessionStorage.getItem('email')!).subscribe(
        (respuestas: { id_pregunta: string; valor: number }[]) => {
          this.respuestasUsuario = respuestas.reduce((acc, curr) => {
            acc[curr.id_pregunta] = curr.valor.toString();
            return acc;
          }, {} as { [key: string]: string });

          sessionStorage.setItem(this.storageKey, JSON.stringify(this.respuestasUsuario));
          this.getPregunta(this.id);
        },
        () => this.getPregunta(this.id)
      );
    }
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
        this.cargarRespuestaGuardada();
      },
      (error) => {
        this.loader.ocultarCargando();
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar la pregunta',
          text: error.error?.message || 'Ocurrió un error desconocido.',
          confirmButtonText: 'Aceptar'
        });
      }
    );
  }

  cargarRespuestaGuardada() {
    const respuestasGuardadas = this.obtenerRespuestasGuardadas();
    if (respuestasGuardadas[this.id]) {
      this.selectedAnswer = respuestasGuardadas[this.id];
      this.isAnswered = true;
    } else {
      this.selectedAnswer = null;
      this.isAnswered = false;
    }
  }

  obtenerRespuestasGuardadas(): { [key: string]: string } {
    const respuestasJSON = localStorage.getItem(this.storageKey);
    return respuestasJSON ? JSON.parse(respuestasJSON) : {};
  }

  guardarRespuesta() {
    if (this.selectedAnswer) {
      const respuestasGuardadas = this.obtenerRespuestasGuardadas();
      respuestasGuardadas[this.id] = this.selectedAnswer;
      localStorage.setItem(this.storageKey, JSON.stringify(respuestasGuardadas));
      this.isAnswered = true;
    }
  }

  onOptionChange(event: Event): void {
    this.selectedAnswer = (event.target as HTMLInputElement).value;
    this.guardarRespuesta();
  }

  next() {
    if (this.selectedAnswer) {
      const currentIdNumber = parseInt(this.id.split('-')[1]);
      if (!isNaN(currentIdNumber)) {
        const nextIdNumber = currentIdNumber + 1;
        const currentIdinventario = this.id.split('-')[0];
        this.progress = (nextIdNumber / this.totalQuestions) * 100;
        if (nextIdNumber <= this.totalQuestions) {
          this.router.navigate([`${this.tipo}/preguntas/${currentIdinventario}-${nextIdNumber.toString().padStart(3, '0')}`]);
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
    const currentIdinventario = this.id.split('-')[0];
    if (!isNaN(currentIdNumber) && currentIdNumber > 1) {
      this.router.navigate([`${this.tipo}/preguntas/${currentIdinventario}-${(currentIdNumber - 1).toString().padStart(3, '0')}`]);
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

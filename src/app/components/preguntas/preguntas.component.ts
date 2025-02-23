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
    let tipoInventario = this.id.startsWith('inv2') ? 'intereses' : 'aptitudes';
    const respuestasGuardadas = sessionStorage.getItem(`respuestasUsuario_${tipoInventario}`);
  
    if (respuestasGuardadas) {
      this.respuestasUsuario = JSON.parse(respuestasGuardadas);
      this.getPregunta(this.id);
    } else {
      this.preguntasService.obtenerRespuestasUsuario(sessionStorage.getItem('email')!).subscribe(
        (respuestas: { id_pregunta: string; valor: number }[]) => {
          this.respuestasUsuario = respuestas.reduce((acc, curr) => {
            acc[curr.id_pregunta] = curr.valor.toString();
            return acc;
          }, {} as { [key: string]: string });
  
          // Guardar respuestas separadas en sessionStorage para evitar sobrescribir inventarios
          sessionStorage.setItem(`respuestasUsuario_${tipoInventario}`, JSON.stringify(this.respuestasUsuario));
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
    let tipoInventario = this.id.startsWith('inv2') ? 'intereses' : 'aptitudes';
    const respuestasJSON = sessionStorage.getItem(`respuestasUsuario_${tipoInventario}`);
    return respuestasJSON ? JSON.parse(respuestasJSON) : {};
  }
  

  guardarRespuesta() {
    if (this.selectedAnswer) {
      let tipoInventario = this.id.startsWith('inv2') ? 'intereses' : 'aptitudes';
      
      // Obtener respuestas guardadas
      const respuestasGuardadas = this.obtenerRespuestasGuardadas();
      
      // Guardar la nueva respuesta en localStorage
      respuestasGuardadas[this.id] = this.selectedAnswer;
      localStorage.setItem(`respuestasUsuario_${tipoInventario}`, JSON.stringify(respuestasGuardadas));
  
      // Enviar a la API
      this.enviarRespuestas(parseInt(this.selectedAnswer), this.id);
  
      // Actualizar el progreso en localStorage
      this.actualizarProgresoEnLocalStorage(tipoInventario, respuestasGuardadas);
  
      this.isAnswered = true;
    }
  }
  actualizarProgresoEnLocalStorage(tipoInventario: string, respuestas: { [key: string]: string }) {
    let totalPreguntas = tipoInventario === 'inv1' ? 120 : 130;
    let idsPreguntas = Object.keys(respuestas)
      .map(id => parseInt(id.replace(`${tipoInventario}-`, '')))
      .filter(num => !isNaN(num));
  
    if (idsPreguntas.length > 0) {
      let maxPregunta = Math.max(...idsPreguntas);
      let progresoCalculado = (maxPregunta / totalPreguntas) * 100;
  
      if (tipoInventario === 'inv1') {
        localStorage.setItem('progreso_inv1', progresoCalculado.toString());
      } else {
        localStorage.setItem('progreso_inv2', progresoCalculado.toString());
      }
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
    };
  
    this.preguntasService.saveRespuesta(respuesta).subscribe(
      (response: any) => {
        console.log("Respuesta guardada en la API:", response);
      },
      (error) => {
        console.error("Error al guardar la respuesta en la API", error);
      }
    );
  }
  
  

  next() {
    if (this.selectedAnswer) {
      this.enviarRespuestas(parseInt(this.selectedAnswer), this.id);
      const currentIdNumber = parseInt(this.id.split('-')[1]);
      console.log(this.selectedAnswer);
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

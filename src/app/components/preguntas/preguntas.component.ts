import { Component, inject, OnInit } from '@angular/core';
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';

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
  selectedOptions: string[] = [];
  readonly TOTAL_OPCIONES_INV3 = 6;
  currentQuestion: number = 0;
  isAnswered: boolean = false;
  progress: number = 0;
  tipo: string | null = null;
  inventario: number = 1;
  userAnswers: (string | null)[] = [];
  totalQuestions = 100;
  currentQuestionId: string = '';
  loading: boolean = false;
  storageKey: string = '';
  respuestasUsuario: Record<string, number> = {};
  preguntasFaltantes: string[] = [];
  mensaje: string = '';
  parteIzquierda: string = '';
  option1Value: string = '1';
  Nav: boolean = false;
  bloqueadas: Set<string> = new Set();
  eliminatedOptionsInv3: string[] = [];
  resetNext: boolean = false;
  emailUsuario: string = '';
  private snackBar = inject(MatSnackBar);


  constructor(
    private preguntasService: PreguntasService,
    private loader: LoaderService,
    private sanitizer: DomSanitizer,
    private aRouter: ActivatedRoute,
    private router: Router,
    private respuestaService: RespuestaService,
    private resultadoService: ResultadoService,
    private authService: AuthService,
    private http: HttpClient
  ) {
    this.id = this.aRouter.snapshot.paramMap.get('id') || '1';
  }

 async ngOnInit() {
  
  this.cargarEliminadasInv3();
  this.tipo = this.aRouter.snapshot.paramMap.get('tipo');

  const email = await this.authService.getCurrentUserEmail();
  this.emailUsuario = email!;
  if (!email) {
    console.error('Email no disponible');
    return;
  }

  this.storageKey = `respuestas_${this.tipo}_${email}`;

  this.aRouter.paramMap.subscribe(params => {
    this.id = params.get('id')!;
    this.parteIzquierda = this.id.split('-')[0];

    if (!this.puedeNavegarAPregunta(this.id)) {
      const maxPermitida = this.obtenerPreguntaMaximaPermitida();
      this.router.navigate([`${this.tipo}/preguntas/${maxPermitida}`]);
      return;
    }

    if (this.id) {
      this.determinarTotalPreguntas();
      this.cargarPreguntas();
      this.cargarRespuestasAPI();
    }
  });
}


async puedeNavegarAPregunta(idPregunta: string): Promise<boolean> {
  const numeroPregunta = parseInt(idPregunta.split('-')[1]);
  const maxPermitida = await this.obtenerPreguntaMaximaPermitida();
  const maxNumero = parseInt(maxPermitida.split('-')[1]);
  if(numeroPregunta <= maxNumero){
    this.Nav = false;
  }
  return numeroPregunta <= maxNumero;
}

async obtenerPreguntaMaximaPermitida(): Promise<string> {
  const inventario = this.id.split('-')[0];
  try {
    const maxRespondida = await this.preguntasService.obtenerRespuestasMasAlta(this.emailUsuario, inventario).toPromise();
    const siguiente = maxRespondida ? maxRespondida + 1 : 1;
    return `${inventario}-${String(siguiente).padStart(3, '0')}`;
  } catch (error) {
    console.error('Error al obtener la respuesta más alta:', error);
    return `${inventario}-001`;
  }
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
  const preguntasGuardadas = localStorage.getItem(`preguntas_${this.inventario}`);
  
  if (preguntasGuardadas) {
    this.getPreguntaDesdeStorage();
  } else {
    this.preguntasService.getPreguntas(this.inventario).subscribe(
      (preguntas: Pregunta[]) => {
        localStorage.setItem(`preguntas_${this.inventario}`, JSON.stringify(preguntas));
        this.getPreguntaDesdeStorage();
      },
      (error) => {
        this.cargarPreguntasDesdeArchivo();
      }
    );
  }
}

cargarPreguntasDesdeArchivo() {
  let archivo = '';

  // Determina el archivo JSON según el inventario
  switch (this.inventario) {
    case 1:
      archivo = 'inventario/1.json';
      break;
    case 2:
      archivo = 'inventario/2.json';
      break;
    case 3:
      archivo = 'inventario/3.json';
      break;
    default:
      archivo = 'inventario/1.json'; // Valor por defecto en caso de que no sea válido
      break;
  }

  // Ahora cargamos el archivo correspondiente desde el directorio de assets
  this.http.get<Pregunta[]>(`./${archivo}`).subscribe(
    (preguntas: Pregunta[]) => {
      // Guardamos las preguntas en localStorage para futuros usos
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
      this.router.navigate(['/error']);
    }
  );
}

  cargarRespuestasAPI() {
    const respuestasGuardadas = sessionStorage.getItem(`respuestasUsuario_${this.inventario}`);
    this.loading = true;
    if (respuestasGuardadas) {
      this.respuestasUsuario = JSON.parse(respuestasGuardadas);
      this.getPreguntaDesdeStorage();
      this.loader.ocultarCargando();
    } else {
      const inventario = this.id.split('-')[0];
      if (this.emailUsuario && inventario) {
        this.preguntasService.obtenerRespuestasUsuario(this.emailUsuario, inventario).subscribe(
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
    const valor = respuestasGuardadas[id];
    if (valor) {
      this.selectedAnswer = valor.toString();
      this.isAnswered = true;
    } else {
      this.isAnswered = false;
    }
  }

  obtenerRespuestasGuardadas(): { [key: string]: Respuesta } {
    const respuestasJSON = sessionStorage.getItem(`respuestasUsuario_${this.parteIzquierda}`);
    return respuestasJSON ? JSON.parse(respuestasJSON) : {};
  }

 guardarRespuesta() {
  if (this.selectedAnswer) {
    this.respuestasUsuario[this.id] = parseInt(this.selectedAnswer);
    sessionStorage.setItem(`respuestasUsuario_${this.parteIzquierda}`, JSON.stringify(this.respuestasUsuario));
    this.isAnswered = true;
  }
}



  onOptionChange(event: Event): void {
    this.selectedAnswer = (event.target as HTMLInputElement).value;
  }

  enviarRespuestas(valorR: number, id: string) {
    const respuesta: Respuesta = {
      valor: valorR,
      id_Pregunta: id,
      emailAspirante: this.emailUsuario!
    };
    this.preguntasService.saveRespuesta(respuesta).subscribe(
      (response: any) => {

      },
      (error) => {
        this.snackBar.open(`Error al guardar la respuesta`, 'OK', {
            duration: 6000,
            panelClass: ['custom-snackbar-error']
          });
        this.prev();
      }
    );
  }
next() {
  if (this.selectedAnswer) {
    if (!this.eliminatedOptionsInv3.includes(this.selectedAnswer)) {
      this.eliminatedOptionsInv3.push(this.selectedAnswer);
    }
    if (this.eliminatedOptionsInv3.length >= 6) {
      this.eliminatedOptionsInv3 = [];
    }
    this.enviarRespuestas(parseInt(this.selectedAnswer), this.id);
    const currentIdNumber = parseInt(this.id.split('-')[1]);
    if (!isNaN(currentIdNumber)) {
      const nextIdNumber = currentIdNumber + 1;
      if (nextIdNumber <= this.totalQuestions) {
        this.selectedAnswer = null;
        this.isAnswered = false;

        this.router.navigate([
          `${this.tipo}/preguntas/${this.id.split('-')[0]}-${nextIdNumber.toString().padStart(3, '0')}`
        ]);
      } else {
        this.cargarRespuestasAPI();
        this.eliminatedOptionsInv3 = [];
        this.mostrarDialogoFinal();
      }
    }
  } else {
    Swal.fire({
      title: 'Atención',
      text: 'Selecciona una respuesta antes de continuar.',
      icon: 'warning',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#007bff'
    });
  }
}


 prev() {
  const currentIdNumber = parseInt(this.id.split('-')[1]);
  if (!isNaN(currentIdNumber) && currentIdNumber > 1) {

    this.router.navigate([
      `${this.tipo}/preguntas/${this.id.split('-')[0]}-${(currentIdNumber - 1)
        .toString()
        .padStart(3, '0')}`
    ]);

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
          this.preguntasService.obtenerRespuestasUsuario(this.emailUsuario!, this.id.split('-')[0]!).subscribe(
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
    this.preguntasFaltantes = [];
    for (let i = 1; i <= this.totalQuestions; i++) {
      const pregunta = `${this.id.split('-')[0]}-${String(i).padStart(3, '0')}`;
      if (!(pregunta in respuestas)) {
        respuestasCompletas = false;
        this.preguntasFaltantes.push(`${pregunta.split('-')[1]}`);
      }
    }

    if (respuestasCompletas) {
      const inventario = this.parteIzquierda;
      this.loader.mostrarCargando('Calculando los resultados...');
      this.resultadoService.calcularResultado(inventario, this.emailUsuario!).subscribe({
        next: (res) => {
          this.loader.ocultarCargando();
          Swal.fire({
            icon: 'success',
            title: 'Resultados calculados',
            text: res,
            confirmButtonText: 'Aceptar'
          }).then(() => {
           switch (this.parteIzquierda) {
            case "inv1":
              this.router.navigate(['/result-aptitudes']);
              break;
            case "inv3":
              this.router.navigate(['/result-uni']);
              break;
            default:
              this.router.navigate(['/result-intereses']);
              break;
          }

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

onOptionChange1(event: any) {
   this.selectedAnswer = event.target.value;
}

checkResetInv3() {
  if (this.eliminatedOptionsInv3.length >= this.TOTAL_OPCIONES_INV3) {
    this.eliminatedOptionsInv3 = [];
    this.selectedAnswer = '';
    localStorage.removeItem('eliminatedOptionsInv3');
  }
}



onOptionChangeInv3(event: any) {
  this.selectedAnswer = event.target.value;
}



salir() {
  if (this.parteIzquierda === 'inv3') {
    localStorage.setItem('eliminatedOptionsInv3', JSON.stringify(this.eliminatedOptionsInv3));
  }
  this.router.navigate(['/cuestionario']);
  console.log('Saliendo del inventario', this.parteIzquierda);
}

cargarEliminadasInv3() {
  const eliminadas = localStorage.getItem('eliminatedOptionsInv3');
  this.eliminatedOptionsInv3 = eliminadas ? JSON.parse(eliminadas) : [];
}

cargarInv3() {
  this.parteIzquierda = 'inv3';
  this.cargarEliminadasInv3();
  this.selectedAnswer = '';
}
}

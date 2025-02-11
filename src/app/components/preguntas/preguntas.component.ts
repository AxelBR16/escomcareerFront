import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2'; // Asegúrate de tener instalado SweetAlert2 (npm install sweetalert2)
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PreguntasService } from '../../services/preguntas.service';
import { LoaderService } from '../../services/loader.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

interface Question {
  texto: string;
  imagen_url: string;
}

@Component({
  selector: 'app-preguntas',
  templateUrl: './preguntas.component.html',
  imports: [CommonModule, RouterModule, FormsModule],
  styleUrls: ['./preguntas.component.css'],
})
export class PreguntasComponent implements OnInit {

  questionsMap: { [key: string]: Question[] } = {
    'economico': [
      {
        texto: 'Pregunta Económico 1: ¿Te interesa trabajar en el sector financiero?',
        imagen_url: '/site/economico1.webp'
      },
      {
        texto: 'Pregunta Económico 2: ¿Valoras la estabilidad económica en un empleo?',
        imagen_url: '/site/economico2.webp'
      },
      {
        texto: 'Pregunta Económico 3: ¿Consideras emprender un negocio propio en el futuro?',
        imagen_url: '/site/economico3.webp'
      }
    ],
    'universitario': [
      {
        texto: 'Pregunta Universitario 1: ¿Te atrae la investigación académica?',
        imagen_url: '/site/universitario1.webp'
      },
      {
        texto: 'Pregunta Universitario 2: ¿Valoras la formación integral que ofrece la universidad?',
        imagen_url: '/site/universitario2.webp'
      },
      {
        texto: 'Pregunta Universitario 3: ¿Te gustaría tener una experiencia internacional durante tus estudios?',
        imagen_url: '/site/universitario3.webp'
      }
    ]
  };

  questions: Question[] = [];

  // Arreglo para almacenar la respuesta seleccionada para cada pregunta (null = sin responder)
  userAnswers: (string | null)[] = [];

  currentQuestion: number = 0;
  selectedAnswer: string | null = null;
  isAnswered: boolean = false;
  progress: number = 0;
  tipo: string | null = null;


  constructor(private route: ActivatedRoute, private preguntasService: PreguntasService, private loader: LoaderService,   private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.obtenerPreguntas();
    this.tipo = this.route.snapshot.paramMap.get('tipo');
    if (this.tipo && this.questionsMap[this.tipo]) {
      this.questions = this.questionsMap[this.tipo];
    }

    // Inicializamos el arreglo de respuestas con null para cada pregunta
    this.userAnswers = this.questions.map(() => null);

    // Mostramos la primera pregunta
    this.updateQuestion();
  }

  obtenerPreguntas() {
    this.loader.mostrarCargando('Cargando preguntas...');
    this.preguntasService.getPreguntasAptitudes().subscribe(
      (response) => {
        this.questionsMap['aptitudes'] = response;
        this.loader.ocultarCargando();

        if (this.tipo === 'aptitudes') {
          this.questions = this.questionsMap['aptitudes'];
          this.userAnswers = this.questions.map(() => null);
          this.currentQuestion = 0;
          this.updateQuestion();
        }
      },
      (error) => {
        this.loader.ocultarCargando();
        let errorMessage = 'Error desconocido';  // Mensaje por defecto
        if (error.status === 0) {
          errorMessage = 'El servidor no está disponible. Por favor, intente más tarde.';
        } else {
          errorMessage = `Error: ${error.status} - ${error.message}`;
        }
         Swal.fire({
                icon: 'error',
                title: `Error al obtener las preguntas`,
                text: errorMessage,
                confirmButtonText: 'Aceptar'
              });
      }
    );
  }


  // Calcula y actualiza el progreso en porcentaje
  updateProgress(): void {
    this.progress = ((this.currentQuestion + 1) / this.questions.length) * 100;
  }

  // Actualiza la pregunta actual y recupera la respuesta almacenada, si existe
  updateQuestion(): void {
    this.updateProgress();
    this.selectedAnswer = this.userAnswers[this.currentQuestion];
    this.isAnswered = this.selectedAnswer !== null;
  }

  // Cuando el usuario cambia la opción, se actualiza la respuesta para la pregunta actual
  onOptionChange(): void {
    this.isAnswered = true;
    this.userAnswers[this.currentQuestion] = this.selectedAnswer;
  }

  // Retrocede a la pregunta anterior
  prev(): void {
    if (this.currentQuestion > 0) {
      this.currentQuestion--;
      this.updateQuestion();
    }
  }

  // Avanza a la siguiente pregunta; si no hay respuesta seleccionada, muestra la alerta
  next(): void {
    if (this.isAnswered) {
      if (this.currentQuestion < this.questions.length - 1) {
        this.currentQuestion++;
        this.updateQuestion();
      }
    } else {
      Swal.fire({
        title: 'Atención',
        text: 'Por favor, selecciona una respuesta antes de continuar.',
        icon: 'warning',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#007bff'
      });
    }
  }

  get currentQuestionObj(): Question | null {
  return this.questions.length > 0 ? this.questions[this.currentQuestion] : null;
}

getSanitizedUrl(url: string | undefined): SafeUrl {
  return this.sanitizer.bypassSecurityTrustResourceUrl(url ?? '');
}



}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2'; // Asegúrate de tener instalado SweetAlert2 (npm install sweetalert2)
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Question {
  text: string;
  image: string;
}

@Component({
  selector: 'app-preguntas',
  templateUrl: './preguntas.component.html',
  // IMPORTANTE: En componentes standalone se usan "imports" en lugar de "declarations"
  imports: [CommonModule, RouterModule, FormsModule],
  styleUrls: ['./preguntas.component.css'],
})
export class PreguntasComponent implements OnInit {

  // Este objeto asocia cada tipo con un conjunto de preguntas.
  questionsMap: { [key: string]: Question[] } = {
    'aptitudes': [
      {
        text: 'Pregunta Aptitudes 1: ¿Te sientes cómodo realizando actividades manuales?',
        image: '/site/aptitudes1.webp'
      },
      {
        text: 'Pregunta Aptitudes 2: ¿Disfrutas resolviendo problemas complejos?',
        image: '/site/aptitudes2.webp'
      },
      {
        text: 'Pregunta Aptitudes 3: ¿Tienes facilidad para aprender idiomas?',
        image: '/site/aptitudes3.webp'
      }
    ],
    'economico': [
      {
        text: 'Pregunta Económico 1: ¿Te interesa trabajar en el sector financiero?',
        image: '/site/economico1.webp'
      },
      {
        text: 'Pregunta Económico 2: ¿Valoras la estabilidad económica en un empleo?',
        image: '/site/economico2.webp'
      },
      {
        text: 'Pregunta Económico 3: ¿Consideras emprender un negocio propio en el futuro?',
        image: '/site/economico3.webp'
      }
    ],
    'universitario': [
      {
        text: 'Pregunta Universitario 1: ¿Te atrae la investigación académica?',
        image: '/site/universitario1.webp'
      },
      {
        text: 'Pregunta Universitario 2: ¿Valoras la formación integral que ofrece la universidad?',
        image: '/site/universitario2.webp'
      },
      {
        text: 'Pregunta Universitario 3: ¿Te gustaría tener una experiencia internacional durante tus estudios?',
        image: '/site/universitario3.webp'
      }
    ]
  };

  // Arreglo que contendrá las preguntas según el tipo seleccionado.
  questions: Question[] = [];

  // Arreglo para almacenar la respuesta seleccionada para cada pregunta (null = sin responder)
  userAnswers: (string | null)[] = [];

  currentQuestion: number = 0;
  selectedAnswer: string | null = null;
  isAnswered: boolean = false;
  progress: number = 0;
  tipo: string | null = null;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Obtenemos el parámetro "tipo" de la URL (por ejemplo, 'aptitudes', 'economico' o 'universitario')
    this.tipo = this.route.snapshot.paramMap.get('tipo');

    // Asignamos el conjunto de preguntas correspondiente según el tipo recibido
    if (this.tipo && this.questionsMap[this.tipo]) {
      this.questions = this.questionsMap[this.tipo];
    } else {
      // Si no se encontró un tipo válido, mostramos un error y dejamos el arreglo de preguntas vacío.
      this.questions = [];
      Swal.fire({
        title: 'Error',
        text: 'No se encontraron preguntas para el tipo especificado.',
        icon: 'error'
      });
    }

    // Inicializamos el arreglo de respuestas con null para cada pregunta
    this.userAnswers = this.questions.map(() => null);

    // Mostramos la primera pregunta
    this.updateQuestion();
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

  // Getter para facilitar la lectura de la pregunta actual
  get currentQuestionObj(): Question {
    return this.questions[this.currentQuestion];
  }
}

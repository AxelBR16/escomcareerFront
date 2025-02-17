import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2'; // Asegúrate de tener instalado SweetAlert2 (npm install sweetalert2)
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
export class PreguntasComponent implements OnInit{
  id: string;
  pregunta: Pregunta = { id: '', texto: '', imagen_url: '' };
  selectedAnswer: string | null = null;
  currentQuestion: number = 0;
  isAnswered: boolean = false;
  progress: number = 0;
  tipo: string | null = null;
  userAnswers: (string | null)[] = [];
  totalQuestions = 10;
  currentQuestionId: string = '';

  constructor(private preguntasService: PreguntasService,
    private loader: LoaderService,
    private sanitizer: DomSanitizer,
    private aRouter: ActivatedRoute,
    private router: Router){
    this.id = this.aRouter.snapshot.paramMap.get('id') || '1';
  }

  loading: boolean = false;

  ngOnInit() {
    this.tipo = this.aRouter.snapshot.paramMap.get('tipo');
    this.aRouter.paramMap.subscribe(params => {
      this.id = params.get('id')!;
      if (this.id) {
        this.getPregunta(this.id);
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
        this.pregunta = {
          id: response.id,
          texto: response.texto,
          imagen_url: this.sanitizer.bypassSecurityTrustUrl(response.imagen_url)
        };
      },
      (error) => {
        this.loader.ocultarCargando();
        const errorMessage = error.error && error.error.message
        ? error.error.message
        : 'Ocurrió un error desconocido.';
         Swal.fire({
          icon: 'error',
          title: 'Error en el registro',
          text: errorMessage,
          confirmButtonText: 'Aceptar'
        });
      }
    );
  }

  onOptionChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.selectedAnswer = inputElement.value;
  }


  next() {
    if (this.selectedAnswer) {
      const currentIdNumber = parseInt(this.id.split('-')[1]);

      if (!isNaN(currentIdNumber)) {
        const nextIdNumber = currentIdNumber + 1;
        const currentIdinventario = this.id.split('-')[0];
        this.progress = (nextIdNumber / this.totalQuestions) * 100;
        const nextId = `${currentIdinventario}-${nextIdNumber.toString().padStart(3, '0')}`;
        this.selectedAnswer = null;

        this.router.navigate([`${this.tipo}/preguntas/${nextId}`]);
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
    const currentIdNumber = parseInt(this.id.replace('inv1-', ''));
    this.progress = (currentIdNumber / this.totalQuestions) * 100;
    if (!isNaN(currentIdNumber)) {
      const prevIdNumber = currentIdNumber - 1;
      if (prevIdNumber >= 1) {
        const prevId = `inv1-${prevIdNumber.toString().padStart(3, '0')}`;
        this.router.navigate([`${this.tipo}/preguntas/${prevId}`]);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error en el registro',
          text: 'No puedes retroceder más allá del primer ID',
          confirmButtonText: 'Aceptar'
        });
      }
    } else {
      console.error('Formato de ID no válido');
    }
  }

}

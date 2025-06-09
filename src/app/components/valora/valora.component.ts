import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-valora',
  imports: [FormsModule, CommonModule],
  templateUrl: './valora.component.html',
  styleUrl: './valora.component.css'
})
export class ValoraComponent {

enviado = false;
 preguntas = [
    { texto: '¿Cómo calificarías tu experiencia general con el sistema?', valor: 0 },
    { texto: '¿Qué tan útil fue la recomendación de carrera que te proporcionó el sistema para tu decisión final?', valor: 0 },
    { texto: '¿Qué te parecieron las experiencias y proyectos mostrados en la página?', valor: 0 },
    { texto: '¿Recomendarías este sistema a otros aspirantes?', valor: 0 }
  ];

  setValor(index: number, value: number): void {
    this.preguntas[index].valor = value;
  }

  onSubmit(): void {
    const respuestas = this.preguntas.map(p => ({ pregunta: p.texto, calificacion: p.valor }));
    console.log('Respuestas enviadas:', respuestas);
    this.enviado = true;

    // Aquí puedes integrar un servicio HTTP para enviar al backend
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Instruccion {
  titulo: string;
  descripcion: string;
  descripcion2: string;
  instrucciones?: string[];
}

@Component({
  selector: 'app-instrucciones',
  standalone: true,
  // IMPORTANTE: Usa "imports" y NO "declarations"
  imports: [CommonModule, RouterModule],
  templateUrl: './instrucciones.component.html',
  styleUrls: ['./instrucciones.component.css']
})
export class InstruccionesComponent implements OnInit {
  tipo: string | null = null;
  contenido!: Instruccion;
  type: string = '';
  preguntaN: string = '1';

  instruccionesMap: { [key: string]: Instruccion } = {
    'aptitudes': {
      titulo: 'Inventario de autoevaluación de aptitudes',
      descripcion: `A continuación se enumeran una serie de actividades que tienen como propósito medir tu grado de habilidad para la ejecución de las mismas.
                    Al contestar los reactivos, ten presente que no se busca que te gusten esas actividades, ni pienses si deberías tener determinada habilidad.
                    Solo se te pide que contestes qué tan hábilmente crees poder realizar la actividad citada, más allá de tus gustos o valores.

                    Esta prueba no exige un tiempo determinado, por lo que puedes meditar y reflexionar tus respuestas. Para tener información precisa en la elección
                    de tu carrera es necesario que contestes este inventario de manera honesta, sin menospreciarte o sobreestimarte. Si en alguna actividad no has tenido alguna experiencia,
                    piensa qué tan bien la realizarías si fuera necesario.`,
      instrucciones: [
        '5 = Mucho muy hábil: Si consideras que eres excelente en esta actividad.',
        '4 = Muy hábil: Si eres muy bueno, pero no excelente.',
        '3 = Medianamente hábil: Si puedes hacerlo, pero no te sientes totalmente cómodo.',
        '2 = Poco hábil: Si tienes dificultades para realizar la actividad.',
        '1 = Nada hábil: Si no puedes realizar la actividad en absoluto.'
      ],
       descripcion2: `Si en algún momento deseas salir, tus selecciones actuales
         se guardarán para continuar después sin perder lo realizado.`,


    },
    'economico': {
      titulo: 'Prueba económica Económico',
      descripcion: 'En esta parte se evaluará tu situación económica para encontrar opciones de carreras accesibles.',
      instrucciones: [
        'Sigue las pautas establecidas para evaluar tu situación económica.',
        'Considera factores como tus ingresos y gastos.'
      ],
       descripcion2: `Si en algún momento deseas salir, tus selecciones actuales
         se guardarán para continuar después sin perder lo realizado.`,
    },
    'universitario': {
      titulo: 'Inventario de preferencias universitarias',
      descripcion: `El propósito de este inventario es servir como informador al aspirante de nivel medio-superior, para definir su area. A continuación verás una serie de opciones que deberás 
                    seleccionar una a una, indicando tu preferencia en cada actividad. El aspirante debe usar una escala del 1 al 6, donde: 6 representa la actividad de mayor preferencia, 5 la segunda preferencia, y así sucesivamente hasta el 1, que es la de menor preferencia. Por lo que 
                    en cada grupo de opciones, el aspirante no puede repetir una calificación. Por ejemplo, no puede poner dos veces un 5 o un 4 en el mismo grupo. Procede de la siguiente manera:`,
                    
      instrucciones: [
        '',
        'Selecciona la opción que prefieras en cada pregunta.',
        'Al seleccionar, esa opción dejará de aparecer en las siguientes preguntas para que no la vuelvas a elegir.',
        'Cuando hayas seleccionado todas las opciones disponibles (6 en total), el sistema automáticamente reiniciará las opciones para que puedas comenzar a seleccionar nuevamente desde todas las opciones.',
        'Así, el proceso se repetirá hasta que completes todas las preguntas.'
      ],
        descripcion2: `Si en algún momento deseas salir, tus selecciones actuales
         se guardarán para continuar después sin perder lo realizado.`,
    },
    'intereses': {
      titulo: 'Inventario intereses ocupacionales',
      
      descripcion: 'A continuación se presentan una serie de actividades. Clasifícalas de acuerdo con tu gusto. Esto tiene como finalidad medir tu propio interés por realizarlas. Para esto, tus ponderaciones se ajustarán a las siguientes claves:',
      instrucciones: [
        '5. Me gusta mucho.',
        '4. Me gusta. ',
        '3. Me es indiferente.',
        '2. Me desagrada.',
        '1. Me desagrada totalmente.'
      ],
       descripcion2: `Si en algún momento deseas salir, tus selecciones actuales
         se guardarán para continuar después sin perder lo realizado.`,

    },
  };

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Obtenemos el parámetro "tipo" de la URL
    this.tipo = this.route.snapshot.paramMap.get('tipo');
    // Establecemos el contenido a mostrar basado en el tipo recibido
    if (this.tipo && this.instruccionesMap[this.tipo]) {
      this.contenido = this.instruccionesMap[this.tipo];
    } else {
      // Valor por defecto o manejo de error
      this.contenido = {
        titulo: 'Instrucciones',
        descripcion: 'No se encontró el tipo de instrucciones solicitado.',
        descripcion2: 'No se encontró el tipo de instrucciones solicitado.',
        instrucciones: []
      };
    }
  }

  get instruccionesArray(): string[] {
    return this.contenido && this.contenido.instrucciones ? this.contenido.instrucciones : [];
  }

  get iniciarLink(): string {
    if (this.tipo === 'aptitudes') {
  this.preguntaN = 'inv1-001';
  } else if (this.tipo === 'intereses') {
    this.preguntaN = 'inv2-001';
  } else if (this.tipo === 'universitario') {
    this.preguntaN = 'inv3-001';
  }


    return `/${this.tipo}/preguntas/${this.preguntaN}`
  }


}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Instruccion {
  titulo: string;
  descripcion: string;
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
        '5. Mucho muy hábil.',
        '4. Muy hábil.',
        '3. Medianamente hábil.',
        '2. Poco hábil.',
        '1. Nada hábil.'
      ]
    },
    'economico': {
      titulo: 'Prueba económica Económico',
      descripcion: 'En esta parte se evaluará tu situación económica para encontrar opciones de carreras accesibles.',
      instrucciones: [
        'Sigue las pautas establecidas para evaluar tu situación económica.',
        'Considera factores como tus ingresos y gastos.'
      ]
    },
    'universitario': {
      titulo: 'Inventario de preferencias universitarias',
      descripcion: `El propósito de este inventario es servir como informador al estudiante preparatoriano que requiere
                    del servicio de orientación vocacional, ya que por la forma en que está diseñado, el alumno lee y observa los
                    patrones de actividad de las diversas profesiones a través de los reactivos, lo cual lo obliga a procesar información a la vez que compara,
                    agrupa, evalúa y selecciona actividades diversas.`,
      instrucciones: [
        '1(1) 2(2) 3(3) 4(4) 5(5) 6(6)',
        'Si observas que alguna actividad se repite, no pienses en lo que contestaste anteriormente. Además, si al jerarquizar notas que ninguna actividad te satisface, entonces piensa cuál sería la que menos te disgustaría.'
      ]
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
      ]
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

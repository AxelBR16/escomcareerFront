import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MateriaService } from '../../services/materia.service';
import { log } from 'console';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle-carrera',
  imports: [CommonModule],
  templateUrl: './detalle-carrera.component.html',
  styleUrl: './detalle-carrera.component.css'
})
export class DetalleCarreraComponent implements OnInit{
  carreraId = 1;
  careers = [
    {
      title: 'Sistemas Computacionales',
      description: 'Transforma ideas en tecnología, desarrollando soluciones innovadoras que conectan el mundo digital.',
      Image: 'site/isc.jpg',
      planEstudios: [
        { nombre: '1er', titulo: 'Primer semestre', materias: [] },
        { nombre: '2do', titulo: 'Segundo semestre', materias: [] },
        { nombre: '3er', titulo: 'Tercer semestre', materias: [] },
        { nombre: '4to', titulo: 'Cuarto semestre', materias: [] },
        { nombre: '5to', titulo: 'Quinto semestre', materias: [] },
        { nombre: '6to', titulo: 'Sexto semestre', materias: [] },
        { nombre: '7mo', titulo: 'Séptimo semestre', materias: [] },
        { nombre: '8vo', titulo: 'Octavo semestre', materias: [] },
        { nombre: 'Opt', titulo: 'Optativas', materias: [] }
      ],

      escuelas: ['Escuela Superior de Cómputo (ESCOM)', 'UPIITA', 'UPIIG', 'UPIIZ', 'UPIH'],

      planDuracion: 'La carrera tiene una duración de 9 semestres con enfoque en el desarrollo de software, bases de datos, redes y mas.',
      planEstudiosInicio: 'Matemáticas, Programación, Arquitectura de Computadoras',
      planEstudiosMedios: 'Bases de Datos, Desarrollo web, Redes de Computadoras, Ingenieria de Software, Seguridad Informática, Sistemas Operativos',
      planEstudiosFinal: 'Inteligencia Artificial, Desarrollo móvil, Proyecto de titulación o residencia profesional',

      laboratorios: ['Laboratorios de computación y redes', 'Programación con Java, Python, C++, etc', 'Bases de datos con MySQL, PostgreSQL, Oracle', 'Desarrollo web con HTML, CSS, JavaScript', 'Administración de servidores y seguridad informática'],

      titulacion: ['Trabajo Terminal (TT)', 'Tesis', 'Examen de conocimientos por áreas', 'Trabajo profesional'],

      areaTrabajo: ['Desarrollo de software', 'Administración de bases de datos', 'Seguridad informática y redes', 'Inteligencia artificial y ciencia de datos', 'Emprendimiento tecnológico.'],

      perfilEgresado: [
        'Desarrollar software eficiente y seguro para diversas plataformas',
        'Diseñar y gestionar bases de datos para el almacenamiento y análisis de información',
        'Implementar y administrar redes de comunicación con protocolos modernos',
        'Aplicar inteligencia artificial y análisis de datos en la resolución de problemas',
        'Liderar proyectos tecnológicos y colaborar en equipos multidisciplinarios.',
        'Adaptarse a nuevas tecnologías y tendencias del sector',
      ],

      porqueEstudiar: [
        'Alta demanda laboral: La industria tecnológica está en constante crecimiento y hay muchas oportunidades de empleo en México y el mundo.',
        'Salarios competitivos: Es una de las carreras mejor pagadas en el país.',
        'Posibilidades de especialización: Puedes enfocarte en desarrollo de software, inteligencia artificial, ciberseguridad, redes, bases de datos y más.',
        'Convenios con empresas y universidades internacionales'
      ]

    },
    {
      title: 'Inteligencia Artificial',
      description: 'Crea sistemas inteligentes que aprenden, evolucionan y revolucionan el futuro de la humanidad.',
      Image: 'site/IA.jpg',
      planEstudios: [
        { nombre: '1er', titulo: 'Primer semestre', materias: [] },
        { nombre: '2do', titulo: 'Segundo semestre', materias: [] },
        { nombre: '3er', titulo: 'Tercer semestre', materias: [] },
        { nombre: '4to', titulo: 'Cuarto semestre', materias: [] },
        { nombre: '5to', titulo: 'Quinto semestre', materias: [] },
        { nombre: '6to', titulo: 'Sexto semestre', materias: [] },
        { nombre: '7mo', titulo: 'Séptimo semestre', materias: [] },
        { nombre: '8vo', titulo: 'Octavo semestre', materias: [] },
        { nombre: 'Opt', titulo: 'Optativas', materias: [] }

      ],

      escuelas: ['Escuela Superior de Cómputo (ESCOM)', 'UPIITA'],

      planDuracion: 'La carrera tiene una duración de 9 semestres con enfoque en IA y ética tecnológica.',
      planEstudiosInicio: 'Matemáticas, Programación, Estructuras de datos, Fundamentos de Redes Neuronales, Introduccion a IA',
      planEstudiosMedios: 'Machine Learning, Deep Learning, Procesamiento de Lenguaje Natural (NLP), Visión por Computadora, Big Data, Ética en la IA y toma de decisiones autónomas ',
      planEstudiosFinal: 'Optimización de modelos de IA, Inteligencia Artificial Explicable (XAI), Seguridad en IA y ética del uso de datos, Implementación de sistemas inteligentes en la industria, proyectos finales.',

      laboratorios: ['Big Data y Computación en la Nube', 'Desarrollo con TensorFlow y PyTorch', 'Visión por Computadora', 'Procesamiento de Lenguaje Natural', 'Robótica'],

      titulacion: ['Trabajo Terminal (TT)', 'Tesis en IA', 'Examen de Conocimientos', 'Certificaciones en IA'],

      areaTrabajo: ['Desarrollo de modelos de IA y Machine Learning en empresas de tecnología', 'Ciencia de datos y análisis predictivo en industrias como finanzas y salud', 'Visión por Computadora y NLP para reconocimiento facial, chatbots y asistentes virtuales', 'Emprendimiento tecnológico en AI Startups', 'Automatización y robótica en manufactura, vehículos autónomos y domótica.'],

      perfilEgresado: [
        'Desarrollar modelos de Machine Learning y Deep Learning',
        'Aplicar IA en visión por computadora y reconocimiento de imágenes',
        'Diseñar asistentes virtuales con NLP y chatbots inteligentes',
        'Desarrollar algoritmos de IA para robótica y automatización',
        'Evaluar el impacto ético y los sesgos en la inteligencia artificial'
      ],

      porqueEstudiar: [
        'Es una de las primeras carreras de IA en Latinoamérica',
        'Alta demanda laboral con sueldos competitivos',
        'Acceso a laboratorios de última tecnología en IA y robótica',
        'Convenios con empresas y universidades internacionales'
      ]

     },
    {
      title: 'Ciencia de Datos',
      description: 'Descubre el poder de los datos para entender patrones, anticipar tendencias y tomar decisiones inteligentes.',
      Image:'site/CD.jpg',
      planEstudios: [
        { nombre: '1er', titulo: 'Primer semestre', materias: ['Introducción a la Ciencia de Datos', 'Cálculo', 'Probabilidad y Estadística', 'Programación en R', 'Análisis de datos'] },
        { nombre: '2do', titulo: 'Segundo semestre', materias: ['Big Data', 'Bases de datos', 'Visualización de datos', 'Machine Learning', 'Optimización matemática'] }

      ],

      escuelas: ['Escuela Superior de Cómputo (ESCOM)', 'UPIITA', 'UPIIC'],

      planDuracion: 'La carrera tiene una duración de 8 semestres con enfoque en IA y ética tecnológica.',
      planEstudiosInicio: 'Matemáticas, programación, Introducción a la Ciencia de Datos, Algoritmos y Estructuras de Datos',
      planEstudiosMedios: 'Análisis y Diseño de Algoritmos, Programación para Ciencia de Datos, Bases de Datos y Bases de Datos Avanzadas, Analítica y Visualización de Datos, Minería de Datos',
      planEstudiosFinal: 'Modelado Predictivo, Procesamiento de Lenguaje Natural, Big Data, Proyectos Finales',

      laboratorios: ['Programación y desarrollo de software', 'Análisis de datos', 'Big Data y computación en la nube', 'Visualización de datos'],

      titulacion: ['Trabajo Terminal (TT)', 'Tesis', 'Examen Profesional', 'Trabajo Profesional'],

      areaTrabajo: ['Mercadotecina', 'Salud', 'Finanzas', 'Bioinformatica', 'Comercio electronico', 'Seguridad'],

      perfilEgresado: [
        'Extraer conocimiento útil a partir de grandes conjuntos de datos.',
        'Aplicar métodos de inteligencia artificial y aprendizaje automático para resolver problemas complejos.',
        'Utilizar técnicas estadísticas y modelos matemáticos en la toma de decisiones.',
        'Desarrollar soluciones informáticas que optimicen procesos en diversas industrias.',
        'Trabajar en equipos multidisciplinarios, demostrando liderazgo y habilidades de comunicación.',
        'Actuar con ética y responsabilidad social, considerando el impacto de sus soluciones en la sociedad.'
      ],

      porqueEstudiar: [
        'Versatilidad siendo aplicable en múltiples sectores como salud, finanzas, marketing, entre otros.',
        'Alta demanda laboral con sueldos competitivos',
        'Innovación constante, siendo una oportunidad de estar a la vanguardia en tecnologías emergentes.',
        'Posibilidad de desarrollar soluciones que impacten positivamente en la sociedad. '
      ]
     }
  ];

  career: any = null;
  selectedSection: string = 'Que ofrece';
  selectedSemestre: number = 0;


  experiencias: any[] = [];
  bolsaTrabajo: any[] = [];
  proyectos: any[] = [];
  id: string;

  constructor(private route: ActivatedRoute, private router: Router, private materiaService: MateriaService) {
    this.id = this.route.snapshot.paramMap.get('id') || '1';
  }

  ngOnInit() {

    this.route.params.subscribe(params => {
      const index = +params['id'];
      if (index >= 0 && index < this.careers.length) {
        this.career = this.careers[index];

        this.cargarMateriasApi();
        // carga de experiencias
        this.loadExperiences();
        this.loadJobOffers(); // Cargar datos simulados
        this.loadProjects();
      } else {
        this.router.navigate(['/']);
      }



    });
  }

cargarMateriasApi() {
  switch(this.id) {
    case '1':
      this.carreraId = 2;
      break;
    case '2':
      this.carreraId = 3;
      break;
    default:
      this.carreraId = 1;
  }

  this.career.planEstudios.forEach((semestre: any) => {
    const semestreNumero = this.parseNumeroSemestre(semestre.nombre);
    this.materiaService.getMateriasPorSemestreYcarrera(semestreNumero, this.carreraId)
      .subscribe(materias => {
        // Guardar array de objetos con nombre y descripción
        semestre.materias = materias.map(m => ({
          nombre: m.nombre,
          descripcion: m.descripcion || 'Descripción no disponible'
        }));
      });
  });
}


  regresar() {
    this.router.navigate(['/carreras']);
  }
   parseNumeroSemestre(nombre: string): number {
    if (nombre.startsWith('1')) return 1;
    if (nombre.startsWith('2')) return 2;
    if (nombre.startsWith('3')) return 3;
    if (nombre.startsWith('4')) return 4;
    if (nombre.startsWith('5')) return 5;
    if (nombre.startsWith('6')) return 6;
    if (nombre.startsWith('7')) return 7;
    if (nombre.startsWith('8')) return 8;
    if (nombre.startsWith('O')) return 0;
    return 0;
  }

 mostrarDescripcion(materia: { nombre: string; descripcion: string }) {
  Swal.fire({
    title: materia.nombre,
    text: materia.descripcion,
    icon: 'info',
    confirmButtonText: 'Cerrar'
  });
}


  changeSection(section: string) {
    this.selectedSection = section;
  }


  selectSemestre(index: number) {
    this.selectedSemestre = index;
  }


   loadExperiences() {
    this.experiencias = [
      {
        id: 1,
        nombre: 'Gómez Pérez Jimena',
        status: 'Egresado',
        comentario: 'Una experiencia retadora, pero muy enriquecedora. Aprendí mucho sobre desarrollo de software.',
        voto: null
      },
      {
        id: 2,
        nombre: 'Pérez Medina Ruben',
        status: 'Egresado',
        comentario: 'El ambiente es muy bueno y los profesores están bien capacitados en su área.',
        voto: null
      },
      {
        id: 3,
        nombre: 'Yael Escalona Bastida',
        status: 'Estudiante',
        comentario: 'Me encanta la carrera, aunque hay muchas materias difíciles, la comunidad es muy unida.',
        voto: null
      }
    ];
  }

  votar(id: number, tipo: 'like' | 'dislike') {
    const experiencia = this.experiencias.find(exp => exp.id === id);
    if (experiencia) {
      if (experiencia.voto === tipo) {
        experiencia.voto = null; // Si ya estaba votado con el mismo, lo quita
      } else {
        experiencia.voto = tipo; // Asigna el nuevo voto
      }
    }
  }

  getInitial(nombre: string): string {
    return nombre.charAt(0).toUpperCase();
  }


   loadJobOffers() {
    this.bolsaTrabajo = [
      {
        id: 1,
        salario: "$27,000 MXN mensuales",
        puesto: "Desarrollador de Software Junior",
        habilidades: ["Python", "Ingles", "Spring", "React", "Angular"],
        descripcion: "Escribir y probar código, colaborar con equipos multidisciplinarios, realizar análisis de requerimientos y asegurarse de que el software sea eficiente y escalable.",
        nombre: "Pérez Medina Ruben",
        status: "Egresado"
      },
      {
        id: 2,
        salario: "$30,000 MXN mensuales",
        puesto: "Administrador de Bases de Datos",
        habilidades: ["MySQL", "AWS", "DynamoDB"],
        descripcion: "Gestión y mantenimiento de bases de datos para asegurar que los datos estén organizados, accesibles y seguros.",
        nombre: "Pérez Medina Ruben",
        status: "Egresado"
      }
    ];
  }




   loadProjects() {
    this.proyectos = [
      {
        id: 1,
        titulo: "Práctica 3 Termómetro con diodo",
        descripcion: "Lorem ipsum dolor sit amet consectetur. Sed et magna massa vestibulum malesuada adipiscing vestibulum. Dictumst massa tellus nulla venenatis interdum.",
        categoria: "Instrumentación y Control",
        imagen: "assets/proyecto1.jpg",
        autor: "Pérez Medina Ruben",
        status: "Egresado",
        voto: null
      },
      {
        id: 2,
        titulo: "Proyecto: Aplicación de análisis de movimientos bancarios con AWS",
        descripcion: "Lorem ipsum dolor sit amet consectetur. Sed et magna massa vestibulum malesuada adipiscing vestibulum. Dictumst massa tellus nulla venenatis interdum.",
        categoria: "Sistemas distribuidos",
        imagen: "assets/proyecto2.jpg",
        autor: "Pérez Medina Ruben",
        status: "Egresado",
        voto: null
      }
    ];
  }

  votarproyecto(id: number, tipo: 'like' | 'dislike') {
    const proyecto = this.proyectos.find(proj => proj.id === id);
    if (proyecto) {
      proyecto.voto = proyecto.voto === tipo ? null : tipo;
    }
  }

}

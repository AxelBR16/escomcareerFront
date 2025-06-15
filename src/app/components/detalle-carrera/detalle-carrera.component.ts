import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule,ExtraOptions  } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MateriaService } from '../../services/materia.service';
import { log } from 'console';
import Swal from 'sweetalert2';
import { ProyectoService } from '../../services/proyecto.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Experiencia } from '../../models/experiencia';
import { ExperienciaService } from '../../services/experiencia.service';
import { JobOffer } from '../../models/jobOffer';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-detalle-carrera',
  imports: [CommonModule, RouterModule],
  templateUrl: './detalle-carrera.component.html',
  styleUrl: './detalle-carrera.component.css'
})
export class DetalleCarreraComponent implements OnInit{
  private snackBar = inject(MatSnackBar);
  experiencias: Experiencia[] = [];
  trabajos: JobOffer[] = [];
  carreraId = 1;
  careers = [
    {
      title: 'Sistemas Computacionales',
      description: 'Transforma ideas en tecnología, desarrollando soluciones innovadoras que conectan el mundo digital.',
      Image: 'site/isc.webp',
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
      Image: 'site/IA.webp',
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
      Image:'site/CD.webp',
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
  bolsaTrabajo: any[] = [];
  proyectos: any[] = [];
  id: string;
  usuarioAutenticado = false;


  constructor(private route: ActivatedRoute, 
    private router: Router, 
    private materiaService: MateriaService, 
    private proyectoService: ProyectoService, 
    private sanitizer: DomSanitizer, 
    private experienciaService: ExperienciaService,
    private authService: AuthService
  ) {
    this.id = this.route.snapshot.paramMap.get('id') || '1';
  }


  irAProyectos(): void {
    const role = sessionStorage.getItem('role');

    if (role === 'ROLE_EGRESADO') {
      this.router.navigate(['/proyectEgresado']);
    } else {
        this.router.navigate(['/login']).then(() => {
      window.scrollTo(0, 0);
    });
      this.snackBar.open('👋 ¡Hola! Para compartir tus increíbles proyectos, por favor regístrate o inicia sesión. ¡Queremos ver tu talento! 🚀', 'OK', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    }
  }


irATrbajo(): void {
  const role = sessionStorage.getItem('role');

  if (role === 'ROLE_EGRESADO') {
    this.router.navigate(['/experience']).then(() => {
      window.scrollTo(0, 0);
    });
  } else {
    this.router.navigate(['/login']).then(() => {
      window.scrollTo(0, 0);
    });
    this.snackBar.open(
      '👋 ¡Hola! Para compartir información de tu trabajo, por favor regístrate o inicia sesión. ¡Queremos ver tu trayecto! 🚀',
      'OK',
      {
        duration: 5000,
        panelClass: ['warning-snackbar']
      }
    );
  }
}

irAExpe(): void {
  const role = sessionStorage.getItem('role');

  if (role === 'ROLE_EGRESADO') {
    this.router.navigate(['/experience']).then(() => {
      window.scrollTo(0, 0);
    });
  } else {
    this.router.navigate(['/login']).then(() => {
      window.scrollTo(0, 0);
    });
    this.snackBar.open(
      '👋 ¡Hola! Para compartir tus increíbles experiencias, por favor regístrate o inicia sesión. ¡Queremos ver tu trayecto! 🚀',
      'OK',
      {
        duration: 5000,
        panelClass: ['warning-snackbar']
      }
    );
  }
}




  async ngOnInit() {

     this.usuarioAutenticado = await this.authService.isLoggedIn();

    this.route.params.subscribe(params => {
      const index = +params['id'];
      if (index >= 0 && index < this.careers.length) {
        this.career = this.careers[index];

        this.cargarMateriasApi();
        this.loadExperiences();
        this.loadJobOffers();
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
    this.experienciaService.getExperienciasPorCarrera(this.carreraId).subscribe({
      next: (data) => {
        this.experiencias = data;
      },
      error: (err) => {
        console.error('Error al cargar experiencias', err);
        this.experiencias = [];
      }
    });
  }

  votar(id: number, tipo: 'like' | 'dislike') {
    /*
    const experiencia = this.experiencias.find(exp => exp.id === id);
    if (experiencia) {
      if (experiencia.voto === tipo) {
        experiencia.voto = null;
      } else {
        experiencia.voto = tipo;
      }
    }*/
  }

  getInitial(nombre: string): string {
    return nombre.charAt(0).toUpperCase();
  }



loadJobOffers() {
  this.experienciaService.getTrabajosPorCarrera(this.carreraId).subscribe({
    next: (data) => {
      this.trabajos = data.filter(t => t.estado); // solo los que estén activos
    },
    error: (error) => {
      console.error('Error cargando trabajos', error);
      this.trabajos = [];
    }
  });
}



loadProjects() {
    this.proyectoService.obtenerProyectosPorCarrera(this.carreraId).subscribe({
      next: (data) => {
        this.proyectos = data.map(proy => ({
          id: proy.id,
          titulo: proy.nombre,
          descripcion: proy.descripcion,
          categoria: proy.nombreMateria,
          imagen: proy.url,
          autor: `${proy.nombreEgresado} ${proy.apellidoEgresado}`,
          status: proy.fecha,
          voto: null
        }));
      },
      error: (err) => console.error('Error cargando proyectos', err)
    });
  }

  votarproyecto(id: number, tipo: 'like' | 'dislike'): void {
  const proyecto = this.proyectos.find(p => p.id === id);
  if (!proyecto || proyecto.yaVoto) return; // Bloquear si ya votó
    
  this.proyectoService.votarProyecto(id, tipo).subscribe(
    actualizado => {
      proyecto.likes = actualizado.likes;
      proyecto.dislikes = actualizado.dislikes;
      proyecto.voto = tipo;
      proyecto.yaVoto = true; // Marcar como ya votado
    },
    error => {
      console.error('Error al votar:', error);
    }
  );
}


  getVideoEmbedUrl(url: string): SafeResourceUrl | null {
    if (!url) return null;

    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^\s&]+)/);
    if (youtubeMatch && youtubeMatch[1]) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${youtubeMatch[1]}`);
    }

    // Google Drive
    const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^\/]+)/);
    if (driveMatch && driveMatch[1]) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(`https://drive.google.com/file/d/${driveMatch[1]}/preview`);
    }

    return null;
  }



//paginacion de proyectos 

currentPage = 1;
itemsPerPage = 2;

get pagedProjects() {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  return this.proyectos.slice(start, start + this.itemsPerPage);
}

changePage(page: number) {
  if (page < 1 || page > this.totalPages) return;
  this.currentPage = page;
}

get totalPages() {
  return Math.ceil(this.proyectos.length / this.itemsPerPage);
}

get pagesArray() {
  return Array(this.totalPages).fill(0).map((x,i) => i + 1);
}





currentPage1 = 1; // Página actual
itemsPerPage1 = 3; // Experiencias por página de experiencias 

  get paginatedExperiences() {
    const startIndex = (this.currentPage1 - 1) * this.itemsPerPage1;
    return this.experiencias.slice(startIndex, startIndex + this.itemsPerPage1);
  }

  // Cambiar la página
  changePage1(page: number) {
    if (page > 0 && page <= this.totalPages1) {
      this.currentPage1 = page;
    }
  }

  // Obtener el total de páginas
  get totalPages1() {
    return Math.ceil(this.experiencias.length / this.itemsPerPage1);
  }




  
currentPage2 = 1; // Página actual bolsa de trabajo 
itemsPerPage2 = 4; // Experiencias por página 
    get paginatedJobs() {
    const startIndex = (this.currentPage2 - 1) * this.itemsPerPage2;
    return this.trabajos.slice(startIndex, startIndex + this.itemsPerPage2);
  }

   changePage2(page: number) {
    if (page > 0 && page <= this.totalPages2) {
      this.currentPage2 = page;
    }
  }

  get totalPages2() {
    return Math.ceil(this.trabajos.length / this.itemsPerPage2);
  }



}

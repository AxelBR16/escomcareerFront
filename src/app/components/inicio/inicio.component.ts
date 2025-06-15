import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';
import { Testimonio } from '../../models/testimonio.model';
import { TestimonioService } from '../../services/testimonio.service';
import { Experiencia } from '../../models/experiencia';
import { ExperienciaService } from '../../services/experiencia.service';
import { ActivatedRoute } from '@angular/router';
import { RetroalimentacionService } from '../../services/retroalimentacion.service';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-inicio',
  imports: [RouterModule, CommonModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})


export class InicioComponent implements OnInit {
  experiencias: Experiencia[] = [];
  testimonios: Testimonio[] = [];
  carreraId = 1;
  isTextVisible: boolean = false;
  selectedSection: string = 'Experiencias'; // Agregar propiedad selectedSection
  currentSlideIndex: number = 0; // Índice del carrusel
  interval: any;
  experienciasAleatorias = [];
  currentIndex = 0;
  retroalimentaciones: any[] = [];  // Variable para almacenar las retroalimentaciones
  maxStars = 3;
slidesPerView = 1;
totalSlides = 0;
currentSlide = 0;
autoPlayInterval: any;

labelNames: any = {
  general: 'General',
  experiencias: 'Experiencias',
  recomendacion: 'Recomendación',
  sistema: 'Sistema'
};


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private experienciaService: ExperienciaService,
    private retroalimentacionService: RetroalimentacionService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Inicializamos el valor de `carreraId` usando la ruta.
    this.carreraId = parseInt(this.route.snapshot.paramMap.get('id') || '1');
  }

  ngOnInit(): void {
    // Cargar las experiencias cuando el componente se inicializa.
    this.loadExperiences();
    this.getAllRetroalimentaciones()
    
    if (isPlatformBrowser(this.platformId)) {
    this.updateResponsive();
    window.addEventListener('resize', () => {
      this.updateResponsive();
      this.calculateTotalSlides();
      
    });
  }
  }

  ngOnDestroy() {
  this.stopAutoPlay();
}


  // Método que alterna la visibilidad del texto
  toggleTextVisibility(): void {
    this.isTextVisible = !this.isTextVisible;
  }

  // Método para cargar las experiencias desde el servicio
  loadExperiences(): void {
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
  

  // Método de votación (comentado, aún no implementado)
  votar(id: number, tipo: 'like' | 'dislike') {
    /*
    const experiencia = this.experiencias.find(exp => exp.id === id);
    if (experiencia) {
      if (experiencia.voto === tipo) {
        experiencia.voto = null;
      } else {
        experiencia.voto = tipo;
      }
    }
    */
  }

  // Método para obtener las iniciales de un nombre
  getInitial(name: string): string {
    if (!name) return '';
    const nameParts = name.split(' ');
    const initials = nameParts.map(part => part.charAt(0).toUpperCase()).join('');
    return initials;
  }

  


  currentPage = 1;  // Página actual
  itemsPerPage = 3; // Experiencias por página

  get paginatedExperiences() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.experiencias.slice(startIndex, startIndex + this.itemsPerPage);
  }

  changePage(page: number) {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  get totalPages() {
    return Math.ceil(this.experiencias.length / this.itemsPerPage);
  }

  getAllRetroalimentaciones(): void {
  this.retroalimentacionService.getAllRetroalimentaciones().subscribe(
    (data) => {
      this.retroalimentaciones = data;
      this.calculateTotalSlides(); // <- Aquí también
    },
    (error) => {
      console.error('Error cargando retroalimentaciones', error);
    }
  );
}


   updateResponsive() {
  const width = window.innerWidth;

  if (width > 1024) {
    this.slidesPerView = 3;
  } else if (width > 768) {
    this.slidesPerView = 2;
  } else {
    this.slidesPerView = 1;
  }

  this.calculateTotalSlides(); // <-- importante recalcular aquí
}


calculateTotalSlides() {
  if (this.retroalimentaciones.length === 0) {
    this.totalSlides = 0;
  } else {
    this.totalSlides = Math.ceil(this.retroalimentaciones.length / this.slidesPerView);
  }
}


createStarsArray(rating: number): boolean[] {
  return Array(this.maxStars).fill(false).map((_, index) => index < rating);
}

getRatingEntries(user: any): [string, number][] {
  return Object.entries(user)
    .filter(([key]) =>
      ['general', 'experiencias', 'recomendacion', 'sistema'].includes(key)
    )
    .map(([key, value]) => [key, value as number]);
}

getLabelName(key: string): string {
  return this.labelNames[key as keyof typeof this.labelNames] || key;
}

getTrackTransform(): string {
  const cardWidth = 300;
  const margin = 30;
  const totalOffset = this.currentSlide * (cardWidth + margin);

  if (!isPlatformBrowser(this.platformId)) {
    return 'translateX(0px)'; // fallback seguro en SSR
  }

  if (this.slidesPerView === 1) {
    return `translateX(-${totalOffset}px)`;
  }

  const visibleWidth = this.slidesPerView * (cardWidth + margin);
  const extraSpace = Math.max(0, (window.innerWidth - visibleWidth) / 2);

  return `translateX(calc(-${totalOffset}px + ${extraSpace}px))`;
}







nextSlide() {
  if (this.currentSlide < this.totalSlides - 1) {
    this.currentSlide++;
  }
}

prevSlide() {
  if (this.currentSlide > 0) {
    this.currentSlide--;
  }
}

goToSlide(index: number) {
  this.currentSlide = index;
}

canGoPrev(): boolean {
  return this.currentSlide > 0;
}

canGoNext(): boolean {
  return this.currentSlide < this.totalSlides - 1;
}

getIndicatorsArray(): number[] {
  return Array(this.totalSlides).fill(0).map((_, i) => i);
}

startAutoPlay() {
  this.autoPlayInterval = setInterval(() => {
    if (this.canGoNext()) {
      this.nextSlide();
    } else {
      this.currentSlide = 0;
    }
  }, 5000);
}

stopAutoPlay() {
  if (this.autoPlayInterval) {
    clearInterval(this.autoPlayInterval);
  }
}

onMouseEnter() {
  this.stopAutoPlay();
}

onMouseLeave() {
  this.startAutoPlay();
}



  
}

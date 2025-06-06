import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';
import { Testimonio } from '../../models/testimonio.model';
import { TestimonioService } from '../../services/testimonio.service';
import { Experiencia } from '../../models/experiencia';
import { ExperienciaService } from '../../services/experiencia.service';
import { ActivatedRoute } from '@angular/router';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private experienciaService: ExperienciaService
  ) {
    // Inicializamos el valor de `carreraId` usando la ruta.
    this.carreraId = parseInt(this.route.snapshot.paramMap.get('id') || '1');
  }

  ngOnInit(): void {
    // Cargar las experiencias cuando el componente se inicializa.
    this.loadExperiences();
   

    
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

  // Cambiar la página
  changePage(page: number) {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Obtener el total de páginas
  get totalPages() {
    return Math.ceil(this.experiencias.length / this.itemsPerPage);
  }



  
}

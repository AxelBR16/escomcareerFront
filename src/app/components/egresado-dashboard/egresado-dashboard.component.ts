import { Component } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';
import { Experiencia } from '../../models/experiencia';
import { ExperienciaService } from '../../services/experiencia.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-egresado-dashboard',
 imports: [RouterModule, CommonModule],
  templateUrl: './egresado-dashboard.component.html',
  styleUrl: './egresado-dashboard.component.css'
})
export class EgresadoDashboardComponent {
 experiencias: Experiencia[] = [];

  carreraId = 1;
  isTextVisible: boolean = false;
  selectedSection: string = 'Experiencias';
  currentSlideIndex: number = 0; 
  interval: any;
  experienciasAleatorias = [];
  currentIndex = 0;
  nombreUsuario: string | null = null;



 constructor(
    private route: ActivatedRoute,
    private router: Router,
    private experienciaService: ExperienciaService,
    private authService: AuthService
  ) {
    this.carreraId = parseInt(this.route.snapshot.paramMap.get('id') || '1');
  }
  ngOnInit(): void {
    this.loadExperiences();
    this.loadNombreUsuario(); 
    console.log(this.nombreUsuario)
  }

  async loadNombreUsuario(): Promise<void> {
    this.nombreUsuario = await this.authService.getCurrentUserName();
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
  













}

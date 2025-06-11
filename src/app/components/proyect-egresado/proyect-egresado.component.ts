import { MateriaService } from './../../services/materia.service';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ProyectoService } from '../../services/proyecto.service';
import { proyecto } from '../../models/proyecto';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Materia } from '../../models/materia';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-proyect-egresado',
  imports: [CommonModule, RouterModule,IonicModule, FormsModule],
  templateUrl: './proyect-egresado.component.html',
  styleUrl: './proyect-egresado.component.css'
})
export class ProyectEgresadoComponent implements OnInit {
  activeTab: string = 'detalles';

  constructor(
    private proyectoService: ProyectoService, 
    private materiaService: MateriaService, 
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private snackBar: MatSnackBar  // Inyección de MatSnackBar
  ) {}

  title: string = '';
  description: string = '';
  carrera: number = 0;
  semestre: number = 0;
  unidadAprendizaje: string = '';
  urlVideo: string = '';
  materiaId: number = 1;
  carreraId: number = 1;
  email = '';
  materias: Materia[] = [];
  proyectosPendientes: proyecto[] = [];
  videoEmbedUrls: { [key: number]: SafeResourceUrl | null } = {};
  videos: proyecto[] = [];

  ngOnInit() {
    this.authService.getCurrentUserEmail().then(email => {
        this.cargarProyectosPendientes(email!);
        this.cargarProyectos(email!);
        this.email = email!;
      });
  }

  cargarProyectosPendientes(correo: string) {
    this.proyectoService.obtenerProyectosPendientes(correo)
    .subscribe(proyectos => {
      this.proyectosPendientes = proyectos;
      this.proyectosPendientes.forEach(proy => {
      this.videoEmbedUrls[proy.id!] = this.getVideoEmbedUrl(proy.url);
    });
  });
  }

  cargarMaterias() {
  if (this.semestre != null && this.carreraId != null) {
    this.materiaService.getMateriasPorSemestreYcarrera(this.semestre, this.carreraId)
    .subscribe({
        next: (data) => {
          this.materias = data;
        },
        error: (err) => {
          console.error('Error cargando materias', err);
          this.materias = [];
        }
      });
  } else {
    this.materias = [];
  }
}


subirProyecto() {
    // Validación del título
    if (!this.title) {
      this.snackBar.open('El título es obligatorio', 'OK', {
        duration: 4000,
        panelClass: ['warning-snackbar']
      });
      return;
    }

    // Validación de la descripción
    if (!this.description) {
      this.snackBar.open('La descripción es obligatoria', 'OK', {
        duration: 4000,
        panelClass: ['warning-snackbar']
      });
      return;
    }

    // Validación de la carrera
    if (!this.carreraId) {
      this.snackBar.open('Por favor selecciona una carrera', 'OK', {
        duration: 4000,
        panelClass: ['warning-snackbar']
      });
      return;
    }

    // Validación del semestre
    if (!this.semestre) {
      this.snackBar.open('Por favor selecciona un semestre', 'OK', {
        duration: 4000,
        panelClass: ['warning-snackbar']
      });
      return;
    }

    // Validación de la materia (Unidad de Aprendizaje)
    if (!this.materiaId) {
      this.snackBar.open('Por favor selecciona una unidad de aprendizaje', 'OK', {
        duration: 4000,
        panelClass: ['warning-snackbar']
      });
      return;
    }

    // Validación de la URL del video
  const urlPattern = /^(https?:\/\/)(youtu\.be\/[^\s]+|youtube\.com\/(watch\?v=[^\s]+)|vimeo\.com\/[^\s]+|drive\.google\.com\/file\/d\/[^\s]+\/preview)$/;



    if (!this.urlVideo || !urlPattern.test(this.urlVideo)) {
      this.snackBar.open('Por favor ingresa una URL válida de video (YouTube, Vimeo, Google Drive)', 'OK', {
        duration: 4000,
        panelClass: ['warning-snackbar']
      });
      return;
    }

    // Si todas las validaciones pasan, creamos el nuevo proyecto
    const nuevoProyecto: proyecto = {
      nombre: this.title,
      descripcion: this.description,
      url: this.urlVideo,
      likes: 0,
      dislikes: 0,
      materiaId: this.materiaId,
      egresadoEmail: this.email
    };

    this.proyectoService.guardarProyecto(nuevoProyecto).subscribe(
      (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Registro exitoso',
          text: 'El proyecto se ha subido correctamente.',
          confirmButtonText: 'Aceptar'
        });
        this.limpiarFormulario();
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al guardar la respuesta',
          text: error.error?.message || 'Ocurrió un error desconocido.',
          confirmButtonText: 'Aceptar'
        });
      }
    );
  }





  limpiarFormulario() {
    this.title = '';
    this.description = '';
    this.carreraId = 1;
    this.materiaId = 1;
    this.semestre = 1;
    this.unidadAprendizaje = '';
    this.urlVideo = '';
  }
  setActiveTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'pendiente') {
      this.cargarProyectos(this.email );
      this.cargarProyectosPendientes(this.email );
    }
  }
  eliminarProyecto(id: number): void {
  console.log('hols')
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará el proyecto permanentemente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      this.proyectoService.eliminarProyecto(id).subscribe({
        next: () => {
          Swal.fire('¡Eliminado!', 'El proyecto ha sido eliminado.', 'success');
          this.cargarProyectos(this.email); // Recargar lista
        },
        error: err => {
          console.error('Error al eliminar proyecto', err);
          Swal.fire('Error', 'No se pudo eliminar el proyecto.', 'error');
        }
      });
    }
  });
}


   getVideoEmbedUrl(url: string): SafeResourceUrl | null {
    if (!url) return null;

    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^\s&]+)/);
    if (youtubeMatch && youtubeMatch[1]) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${youtubeMatch[1]}`);
    }

    const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^\/]+)/);
    if (driveMatch && driveMatch[1]) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(`https://drive.google.com/file/d/${driveMatch[1]}/preview`);
    }

    return null;
  }

  cargarProyectos(email: string): void {
  this.proyectoService.obtenerTodosLosProyectos(email).subscribe({
    next: proyectos => {
      this.videos = proyectos;
      this.videos.forEach(proy => {
        this.videoEmbedUrls[proy.id!] = this.getVideoEmbedUrl(proy.url);
      });
    },
    error: err => console.error('Error al cargar proyectos', err)
  });
}


}

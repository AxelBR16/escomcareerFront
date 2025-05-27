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

@Component({
  selector: 'app-proyect-egresado',
  imports: [CommonModule, RouterModule,IonicModule, FormsModule],
  templateUrl: './proyect-egresado.component.html',
  styleUrl: './proyect-egresado.component.css'
})
export class ProyectEgresadoComponent implements OnInit {
  activeTab: string = 'detalles';

  constructor(private proyectoService: ProyectoService, private materiaService: MateriaService, private sanitizer: DomSanitizer) {}

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
    this.email = sessionStorage.getItem('email')!;
    this.cargarProyectosPendientes();
    this.cargarProyectos();
  }

  cargarProyectosPendientes() {
    this.proyectoService.obtenerProyectosPendientes(this.email)
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
    if (!this.title) {
      alert('El título es obligatorio');
      return;
    }
    const nuevoProyecto: proyecto = {
      nombre: this.title,
      descripcion: this.description,
      url: this.urlVideo,
      likes: 0,
      dislikes: 0,
      materiaId: this.materiaId,
      carreraId: Number(this.carreraId),
      egresadoEmail: this.email
    };
   this.proyectoService.guardarProyecto(nuevoProyecto).subscribe(
      (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Registro exitoso',
          text:  'Registro exitoso',
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
      this.cargarProyectos();
      this.cargarProyectosPendientes();
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
          this.cargarProyectos(); // Recargar lista
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

  cargarProyectos(): void {
  this.proyectoService.obtenerTodosLosProyectos(this.email).subscribe({
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

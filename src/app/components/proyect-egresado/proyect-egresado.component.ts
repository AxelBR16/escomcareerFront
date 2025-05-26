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


interface Video {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  likes: number;
  dislikes: number;
}

@Component({
  selector: 'app-proyect-egresado',
  imports: [CommonModule, RouterModule,IonicModule, FormsModule],
  templateUrl: './proyect-egresado.component.html',
  styleUrl: './proyect-egresado.component.css'
})
export class ProyectEgresadoComponent implements OnInit {
  activeTab: string = 'detalles'; // Define la pestaña activa por defecto

  constructor(private proyectoService: ProyectoService, private materiaService: MateriaService) {}
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

  ngOnInit() {
     this.email = sessionStorage.getItem('email')!;
  }

  cargarMaterias() {
  if (this.semestre != null && this.carreraId != null) {
    this.materiaService.getMateriasPorSemestreYcarrera(this.semestre, this.carreraId)
      .subscribe({
        next: (data) => {
          this.materias = data;
          // Opcional: asignar la primera materia como seleccionada automáticamente
          if (this.materias.length > 0) {
            this.materiaId = this.materias[0].id;
          }
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
console.log();
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
  // Cambiar pestaña activa
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  // Lista de videos con datos dinámicos
  videos: Video[] = [
    {
      id: 1,
      title: 'Video 1',
      description: 'Descripción del Video 1',
      thumbnail: '/site/Escom6.png',
      likes: 45,
      dislikes: 5
    },
    {
      id: 2,
      title: 'Video 2',
      description: 'Descripción del Video 2',
      thumbnail: '/site/Escom5.png',
      likes: 30,
      dislikes: 10
    },
    {
      id: 3,
      title: 'Video 3',
      description: 'Descripción del Video 3',
      thumbnail: '/site/Escom4.png',
      likes: 60,
      dislikes: 2
    },
    {
      id: 4,
      title: 'Video 4',
      description: 'Descripción del Video 4',
      thumbnail: '/site/Escom4.png',
      likes: 60,
      dislikes: 2
    }
  ];

  // Función para eliminar un video
  deleteVideo(videoId: number) {
    this.videos = this.videos.filter(video => video.id !== videoId);
    console.log("Video eliminado:", videoId);
  }
}

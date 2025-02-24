import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';


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
  imports: [CommonModule, RouterModule,IonicModule],
  templateUrl: './proyect-egresado.component.html',
  styleUrl: './proyect-egresado.component.css'
})
export class ProyectEgresadoComponent {
  activeTab: string = 'detalles'; // Define la pestaña activa por defecto

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

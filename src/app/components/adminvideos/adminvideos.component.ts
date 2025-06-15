import { Component, inject, OnInit } from '@angular/core';
import { ProyectoService } from '../../services/proyecto.service';
import { proyecto } from '../../models/proyecto';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-adminvideos',
  imports: [CommonModule],
  templateUrl: './adminvideos.component.html',
  styleUrl: './adminvideos.component.css'
})
export class AdminvideosComponent implements OnInit{

  private snackBar = inject(MatSnackBar);
  proyectos: proyecto[] = [];
  videoEmbedUrls: { [key: number]: SafeResourceUrl | null } = {};

  constructor(private proyectoService: ProyectoService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.cargarProyectos();
  }

  cargarProyectos(): void {
  this.proyectoService.obtenerProyectosSinAprobar().subscribe(
    data => {
      this.proyectos = data;
      this.proyectos.forEach(p => {
        this.videoEmbedUrls[p.id!] = this.getVideoEmbedUrl(p.url);
      });
    },
    error => console.error('Error al cargar proyectos', error)
  );
}


 aprobar(id?: number) {
  if (id === undefined) return;
  this.proyectoService.aprobarProyecto(id).subscribe(() => {
    this.proyectos = this.proyectos.filter(p => p.id !== id);
    this.snackBar.open('Proyecto aprobado correctamente', 'OK', {
      duration: 3000,
      panelClass: ['custom-snackbar']
    });
  }, error => {
    this.snackBar.open('Error al aprobar el proyecto', 'Cerrar', {
      duration: 3000,
      panelClass: ['custom-snackbar-error']
    });
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




rechazar(id?: number) {
  if (id === undefined) return;
  this.proyectoService.rechazarProyecto(id).subscribe(() => {
    this.proyectos = this.proyectos.filter(p => p.id !== id);
    this.snackBar.open('Proyecto rechazado y eliminado', 'OK', {
      duration: 3000,
      panelClass: ['custom-snackbar']
    });
  }, error => {
    this.snackBar.open('Error al rechazar el proyecto', 'Cerrar', {
      duration: 3000,
      panelClass: ['custom-snackbar-error']
    });
  });
}
}

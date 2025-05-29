import { Component, inject, OnInit } from '@angular/core';
import { ProyectoService } from '../../services/proyecto.service';
import { proyecto } from '../../models/proyecto';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-adminvideos',
  imports: [CommonModule],
  templateUrl: './adminvideos.component.html',
  styleUrl: './adminvideos.component.css'
})
export class AdminvideosComponent implements OnInit{

  private snackBar = inject(MatSnackBar);
  proyectos: proyecto[] = [];

  constructor(private proyectoService: ProyectoService) { }

  ngOnInit(): void {
    this.cargarProyectos();
  }

  cargarProyectos(): void {
    this.proyectoService.obtenerProyectosSinAprobar().subscribe(
      data => this.proyectos = data,
      error => console.error('Error al cargar proyectos', error)
    );
    console.log(this.proyectos);
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

import { Component, inject, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExperienciaService } from '../../services/experiencia.service';
import { CommonModule } from '@angular/common';
import { JobOffer } from '../../models/jobOffer';

@Component({
  selector: 'app-admin-trabajo',
  imports: [CommonModule],
  templateUrl: './admin-trabajo.component.html',
  styleUrl: './admin-trabajo.component.css'
})
export class AdminTrabajoComponent implements OnInit{
private snackBar = inject(MatSnackBar);
  trabajos: JobOffer[] = [];

  constructor(private experienciaService: ExperienciaService) { }

  ngOnInit(): void {
    this.cargarTrabajos();
  }

  cargarTrabajos(): void {
    this.experienciaService.obtenerTrabajosPendientes().subscribe(
      data => {
        console.log(data);
        this.trabajos = data;
      },
      error => console.error('Error al cargar trabajos', error)
    );
  }

  aprobar(id?: number) {
    if (id === undefined) return;
    this.experienciaService.aprobarTrabajo(id).subscribe(() => {
      this.trabajos = this.trabajos.filter(t => t.id !== id);
      this.snackBar.open('Trabajo aprobado correctamente', 'OK', {
        duration: 3000,
        panelClass: ['custom-snackbar']
      });
    },
    error => {
      console.error(error);
      this.snackBar.open('Error al aprobar el trabajo', 'Cerrar', {
        duration: 3000,
        panelClass: ['custom-snackbar-error']
      });
    });
  }

  rechazar(id?: number) {
    if (id === undefined) return;
    this.experienciaService.rechazarTrabajo(id).subscribe(() => {
      this.trabajos = this.trabajos.filter(t => t.id !== id);
      this.snackBar.open('Trabajo rechazado y eliminado', 'OK', {
        duration: 3000,
        panelClass: ['custom-snackbar']
      });
    }, error => {
       console.error(error);
      this.snackBar.open('Error al rechazar el trabajo', 'Cerrar', {
        duration: 3000,
        panelClass: ['custom-snackbar-error']
      });
    });
  }
}

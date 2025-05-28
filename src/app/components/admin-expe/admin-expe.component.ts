import { Component, inject } from '@angular/core';
import { ExperienciaService } from '../../services/experiencia.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Experiencia } from '../../models/experiencia';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-expe',
  imports: [CommonModule],
  templateUrl: './admin-expe.component.html',
  styleUrl: './admin-expe.component.css'
})
export class AdminExpeComponent {
private snackBar = inject(MatSnackBar);

experiencias: Experiencia[] = [];

  constructor(private experienciaService: ExperienciaService) {}

  ngOnInit(): void {
    this.cargarExperiencias();
  }

  cargarExperiencias(): void {
    this.experienciaService.obtenerExperienciasPendientes().subscribe(
      data => this.experiencias = data,
      error => console.error('Error al cargar experiencias', error)
    );
  }

  aprobar(id?: number) {
    if (id === undefined) return;
    this.experienciaService.aprobarExperiencia(id).subscribe(() => {
      this.experiencias = this.experiencias.filter(e => e.id !== id);
      this.snackBar.open('Experiencia aprobada correctamente', 'OK', {
        duration: 3000,
        panelClass: ['custom-snackbar']
      });
    }, error => {
      this.snackBar.open('Error al aprobar la experiencia', 'Cerrar', {
        duration: 3000,
        panelClass: ['custom-snackbar-error']
      });
    });
  }

  rechazar(id?: number) {
    if (id === undefined) return;
    this.experienciaService.rechazarExperiencia(id).subscribe(() => {
      this.experiencias = this.experiencias.filter(e => e.id !== id);
      this.snackBar.open('Experiencia rechazada y eliminada', 'OK', {
        duration: 3000,
        panelClass: ['custom-snackbar']
      });
    }, error => {
      this.snackBar.open('Error al rechazar la experiencia', 'Cerrar', {
        duration: 3000,
        panelClass: ['custom-snackbar-error']
      });
    });
  }
}

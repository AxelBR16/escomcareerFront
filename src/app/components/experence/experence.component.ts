import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExperienciaService } from '../../services/experiencia.service';
import { Observable } from 'rxjs';
import { debounceTime, switchMap, startWith } from 'rxjs/operators';
import { Habilidad } from '../../models/habilidad';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-experence',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, MatAutocompleteModule, MatInputModule],
  templateUrl: './experence.component.html',
  styleUrls: ['./experence.component.css']
})
export class ExperenceComponent implements OnInit {

  experiencia: string = '';
  trabajaRelacionada: string = '';
  salario?: number;
  descripcionTrabajo: string = '';
  puesto: string = '';
  email: string = '';

  habilidadCtrl = new FormControl('');
  habilidadesFiltradas!: Observable<Habilidad[]>;
  habilidadesSeleccionadas: string[] = [];

  private snackBar = inject(MatSnackBar);

  constructor(
    private experienciaService: ExperienciaService,  
    private authService: AuthService 
  ) {}

  ngOnInit() {
    this.authService.getCurrentUserEmail().then(email => {
      this.email = email!;
    });
    this.habilidadesFiltradas = this.habilidadCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap(value => this.experienciaService.buscarHabilidades(value || ''))
    );
  }

  agregarHabilidad(nombre: string) {
    if (!this.habilidadesSeleccionadas.includes(nombre)) {
      this.habilidadesSeleccionadas.push(nombre);
    }
    this.habilidadCtrl.setValue('');
  }

  removerHabilidad(nombre: string) {
    this.habilidadesSeleccionadas = this.habilidadesSeleccionadas.filter(h => h !== nombre);
  }

  get showCampos() {
    return this.trabajaRelacionada === 'si';
  }

  agregarTestimonio(): void {
    // Validación de campos vacíos
    if (!this.experiencia || !this.trabajaRelacionada) {
      this.snackBar.open('Por favor completa los campos obligatorios', 'OK', {
        duration: 4000,
        panelClass: ['warning-snackbar']
      });
      return;
    }

    // Si trabaja en algo relacionado, valida los campos adicionales
    if (this.trabajaRelacionada === 'si') {
      if (!this.puesto || !this.descripcionTrabajo || !this.salario || !this.habilidadesSeleccionadas.length) {
        this.snackBar.open('Por favor completa todos los campos (Puesto, Descripción, Salario y Habilidades)', 'OK', {
          duration: 4000,
          panelClass: ['warning-snackbar']
        });
        return;
      }

      // Validación de salario en rango
      if (this.salario < 5000 || this.salario > 50000) {
        this.snackBar.open('El salario debe estar entre 5,000 y 50,000', 'OK', {
          duration: 4000,
          panelClass: ['warning-snackbar']
        });
        return;
      }
    }

    // Guardar experiencia
    const experienciaData = {
      descripcion: this.experiencia,
      correo: this.email
    };

    this.experienciaService.guardarExperiencia(experienciaData).subscribe({
      next: () => {
        if (this.trabajaRelacionada === 'si') {
          const trabajoData = {
            descripcion: this.descripcionTrabajo,
            puesto: this.puesto,
            salario: this.salario || 0,
            correoEgresado: this.email,
            habilidades: this.habilidadesSeleccionadas
          };

          this.experienciaService.guardarTrabajo(trabajoData).subscribe({
            next: () => {
              this.snackBar.open('Experiencia y trabajo guardados correctamente', 'OK', {
                duration: 5000,
                panelClass: ['custom-snackbar']
              });
              this.limpiarFormulario();
            },
            error: () => {
              this.snackBar.open('Error al guardar el trabajo', 'Cerrar', {
                duration: 5000,
                panelClass: ['custom-snackbar-error']
              });
            }
          });
        } else {
          this.snackBar.open('Gracias por compartir tu experiencia', 'OK', {
            duration: 5000,
            panelClass: ['custom-snackbar']
          });
          this.limpiarFormulario();
        }
      },
      error: () => {
        this.snackBar.open('Error al guardar la experiencia', 'Cerrar', {
          duration: 5000,
          panelClass: ['custom-snackbar-error']
        });
      }
    });
  }

  limpiarFormulario(): void {
    this.experiencia = '';
    this.trabajaRelacionada = '';
    this.salario = undefined;
    this.descripcionTrabajo = '';
    this.puesto = '';
    this.habilidadesSeleccionadas = [];
    this.habilidadCtrl.setValue('');
  }


  
}


import { Component,AfterViewInit,PLATFORM_ID,Inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import { ResultadoService } from '../../services/resultado.service';
import { ResultadoResumenDTO } from '../../models/ResultadoResumenDTO';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-result-intereses',
  imports: [CommonModule, RouterModule],
  templateUrl: './result-intereses.component.html',
  styleUrl: './result-intereses.component.css'
})
export class ResultInteresesComponent {
  private chart: any;

  constructor(@Inject(PLATFORM_ID) private platformId: any, private router: Router,private resultadoService: ResultadoService,  private authService: AuthService) {}

 async ngAfterViewInit(): Promise<void> {
   await new Promise(resolve => setTimeout(resolve, 500));
 
   try {
     const emailU = await this.authService.getCurrentUserEmail();
     if (emailU) {
       this.resultadoService.obtenerResumenPorCorreo(emailU).subscribe({
         next: (res) => {
           const { etiquetas, puntajes } = this.ordenarPorEscala(res);
           sessionStorage.setItem('puntajes', JSON.stringify({ puntajes }));
           this.initChart(etiquetas, puntajes);
         },
         error: () => {
           Swal.fire('Error', 'No se pudieron cargar los resultados', 'error');
         }
       });
     } else {
       Swal.fire('Error', 'Email no encontrado', 'error');
     }
   } catch (error) {
     Swal.fire('Error', 'No se pudieron cargar los resultados', 'error');
   }
 }
 

     ordenarPorEscala(resultados: ResultadoResumenDTO[]): { etiquetas: string[], puntajes: number[] } {
       const escalaLabels: { [key: number]: string } = {
          13: 'Biológicos',
          14: 'Campestres',
          15: 'Geofísicos',
          16: 'Literarios',
          17: 'Cálculo',
          18: 'Contabilidad',
          19: 'Científicos',
          20: 'Mecánicos',
          21: 'S. social',
          22: 'Organización',
          23: 'Persuasivo',
          24: 'Musical',
          25: 'Artístico-plástico'
        };

        const filtrados = resultados.filter(r => r.escalaId >= 13 && r.escalaId <= 25);
        const ordenados = filtrados.sort((a, b) => a.escalaId - b.escalaId);
        const etiquetas = ordenados.map(r => escalaLabels[r.escalaId] || `Escala ${r.escalaId}`);
        const puntajes = ordenados.map(r => r.puntaje);

        return { etiquetas, puntajes };
      }

initChart(etiquetas: string[], puntajes: number[]): void {
    const canvas = document.getElementById('aptitudesChart') as HTMLCanvasElement;

    if (!canvas) {
      console.error('No se encontró el canvas en el DOM.');
      return;
    }

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: etiquetas,
        datasets: [{
          label: "Puntaje",
          data: puntajes,
          backgroundColor: [
            "#A8E6A3",
          "#A8E6A3", "#C5E1A5", "#D7CCC8", "#D1C4E9", "#BBDEFB", "#B2DFDB", "#C5CAE9", "#CFD8DC", "#FFCCBC", "#FFF59D", "#FFCDD2", "#E1BEE7", "#FFAB91"
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 50
          }
        }
      }
    });
  }



    // Método que se activa al hacer clic en el botón
    showLoading(): void {
      // Muestra la alerta de SweetAlert2
      Swal.fire({
        title: 'Cargando...',
        text: 'Analizando resultados similares en el sistema de recomendación...',
        icon: 'info',
        allowOutsideClick: false, // Evita que el usuario cierre la alerta
        showConfirmButton: false, // No mostrar el botón de confirmación
        willOpen: () => {
          Swal.showLoading(); // Muestra el spinner de carga
        }
      });

      // Simula una espera de 2 segundos antes de redirigir
      setTimeout(() => {
        this.router.navigate(['/resultAI2']); // Redirige a la página de resultados
        Swal.close(); // Cierra la alerta de carga
      }, 4000); // El tiempo de espera puede ajustarse
    }
}

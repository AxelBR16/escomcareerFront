
import { Component,AfterViewInit,PLATFORM_ID,Inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import { ResultadoService } from '../../services/resultado.service';
import Swal from 'sweetalert2';
import { ResultadoResumenDTO } from '../../models/ResultadoResumenDTO';


@Component({
  selector: 'app-result-univer',
  imports: [CommonModule, RouterModule],
  templateUrl: './result-univer.component.html',
  styleUrl: './result-univer.component.css'
})
export class ResultUniverComponent {
  private chart: any;

  constructor(@Inject(PLATFORM_ID) private platformId: any, private router: Router,private resultadoService: ResultadoService) {}
   ngAfterViewInit(): void {
      if (isPlatformBrowser(this.platformId)) {
        setTimeout(() => {
          const email = sessionStorage.getItem('email')!;

          this.resultadoService.obtenerResumenPorCorreo(email).subscribe({
            next: (res) => {
              const { etiquetas, puntajes } = this.ordenarPorEscala(res);
              this.initChart(etiquetas, puntajes);
            },
            error: () => {
              Swal.fire('Error', 'No se pudieron cargar los resultados', 'error');
            }
          });
        }, 500);
      }
    }

     ordenarPorEscala(resultados: ResultadoResumenDTO[]): { etiquetas: string[], puntajes: number[] } {
    const escalaLabels: { [key: number]: string } = {
      26: 'Fisicomatemáticas',
      27: 'Administrativas',
      28: 'Biológicas',
      29: 'Químicas',
      30: 'Sociales',
      31: 'Humanidades',
    };

    // Filtrar solo escalas entre 1 y 12
    const filtrados = resultados.filter(r => r.escalaId >= 26 && r.escalaId <= 31);

    // Ordenar por escalaId
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
               "#D3D3D3", "#98FB98", "#DDA0DD", "#FDFD96", "#ADD8E6","#FFB6C1"
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
        this.router.navigate(['/resultAI']); // Redirige a la página de resultados
        Swal.close(); // Cierra la alerta de carga
      }, 4000); // El tiempo de espera puede ajustarse
    }
  }


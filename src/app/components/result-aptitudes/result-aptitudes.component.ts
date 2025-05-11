import { Component, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import Swal from 'sweetalert2'; // Importar SweetAlert2

Chart.register(annotationPlugin);

@Component({
  selector: 'app-result-aptitudes',
  templateUrl: './result-aptitudes.component.html',
  styleUrls: ['./result-aptitudes.component.css']
})
export class ResultAptitudesComponent implements AfterViewInit {
  private chart: any;

  constructor(@Inject(PLATFORM_ID) private platformId: any, private router: Router) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.initChart();
      }, 500); //se Espera a que la vista cargue completamente
    }
  }

  initChart(): void {
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
        labels: [
          "Abstracto", "Coordinación", "Numérica", "Verbal", "Persuasiva",
          "Mecánica", "Social", "Directiva", "Organización", "Musical",
          "Artístico-Plástica", "Espacial"
        ],
        datasets: [{
          label: "Puntaje",
          data: [20, 35, 25, 40, 30, 28, 36, 42, 29, 33, 47, 10],
          backgroundColor: [
            "#AEC6CF", "#B2E7D4", "#FDFD96", "#FADADD", "#CFC4E1",
            "#D3D3D3", "#FFD1DC", "#FFB347", "#E6E6FA", "#FFCBA4",
            "#FF6347", "#B0E0E6"
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

    console.log("Gráfica generada correctamente");
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

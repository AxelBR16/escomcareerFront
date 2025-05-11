import { Component, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';  // Importa isPlatformBrowser
import Chart from 'chart.js/auto';  // Importa Chart.js

@Component({
  selector: 'app-result-ai',
  templateUrl: './result-ai.component.html',
  styleUrls: ['./result-ai.component.css']
})
export class ResultAIComponent implements AfterViewInit {

  constructor(@Inject(PLATFORM_ID) private platformId: any, private router: Router) {}

  ngAfterViewInit(): void {
    // Verifica si estamos en el navegador antes de acceder a document
    if (isPlatformBrowser(this.platformId)) {
      this.createPieChart();
    }
  }

  createPieChart(): void {
    // Ahora este código solo se ejecutará en el navegador
    const ctx = (document.getElementById('pieChart') as HTMLCanvasElement).getContext('2d');
    
    if (ctx) {
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Similitud con Ingeniería en Sistemas Computacionales', 'Resto'],
          datasets: [{
            data: [78, 22], // 78% y 22% para completar el 100%
            backgroundColor: ['#3498db', '#d1d1d1'], // Azul para el 78% y gris para el 22%
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,  // Permite que el gráfico se ajuste al tamaño del canvas
          maintainAspectRatio: true,  // Mantiene la proporción del gráfico
          plugins: {
            legend: {
              position: 'bottom', // Coloca la leyenda en la parte inferior
            },
            tooltip: {
              callbacks: {
                label: function(tooltipItem) {
                  return tooltipItem.raw + '%'; // Muestra el porcentaje en el tooltip
                }
              }
            }
          }
        }
      });
    }
  }
}

import { Component, AfterViewInit, PLATFORM_ID, Inject, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';  // Importa isPlatformBrowser
import Chart from 'chart.js/auto';  // Importa Chart.js
import Swal from 'sweetalert2';

@Component({
  selector: 'app-result-ai2',
  templateUrl: './result-ai2.component.html',
  imports: [RouterModule],
  styleUrls: ['./result-ai2.component.css']
})
export class ResultAI2Component implements AfterViewInit {

  // Tres carreras proporcionadas
  carreras: string[] = [
    'Ingeniería en Sistemas Computacionales',
    'Licenciatura en Ciencia de Datos',
    'Ingeniería en Inteligencia Artificial'
  ];

  carreraSugerida: string = '';  // Carrera sugerida
  porcentaje: number = 0;  // Probabilidad de la carrera sugerida

  // Datos simulados de probabilidades (esto reemplaza la predicción real)
  probabilidades = {
    '0': 0.70,  // Ingeniería en Sistemas Computacionales
    '1': 0.27,  // Licenciatura en Ciencia de Datos
    '2': 0.23   // Ingeniería en Inteligencia Artificial
  };

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Simulamos los datos para elegir una carrera sugerida
      const prediccion = 0;  // Usamos el índice de la carrera con la probabilidad más alta
      this.carreraSugerida = this.carreras[prediccion];
      this.porcentaje = Math.round(this.probabilidades[prediccion] * 100);  // Convierte la probabilidad en porcentaje

      const data: number[] = Object.entries(this.probabilidades).map(
  ([key, value]) => Math.round(value * 100)
);

      const labels: string[] = this.carreras;

      // Crear el gráfico con los resultados
      this.createPieChart(labels, data);
    }
  }

  // Método para crear el gráfico de torta con los datos de las probabilidades simuladas
  createPieChart(labels: string[], data: number[]): void {
    const ctx = (document.getElementById('pieChart') as HTMLCanvasElement)?.getContext('2d');

    if (ctx) {
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: ['#3498db', '#2ecc71', '#f1c40f'],  // Colores para las secciones del gráfico
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: 'bottom'  // Coloca la leyenda en la parte inferior
            },
            tooltip: {
              callbacks: {
                label: function(tooltipItem: any) {
                  return tooltipItem.label + ': ' + tooltipItem.raw + '%';  // Muestra el porcentaje en el tooltip
                }
              }
            }
          }
        }
      });
    }
  }
}

import { Component, AfterViewInit, PLATFORM_ID, Inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-result-ai',
  templateUrl: './result-ai.component.html',
  styleUrls: ['./result-ai.component.css']
})
export class ResultAIComponent implements AfterViewInit {

  carreras: string[] = [
    'Ingeniería en Sistemas Computacionales',
    'Licenciatura en Ciencia de Datos',
    'Ingeniería en Inteligencia Artificial'
  ];

  carreraSugerida: string = '';
  porcentaje: number = 0;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const datosIA = sessionStorage.getItem('prediccionIA');

      if (datosIA) {
        try {
          const parsed = JSON.parse(datosIA);
          const probabilidades = parsed.probabilidades;
          const prediccion = parseInt(parsed.prediccion);
          this.cdRef.detectChanges();
          if (
            isNaN(prediccion) ||
            !this.carreras[prediccion] ||
            !probabilidades.hasOwnProperty(prediccion)
          ) {
            throw new Error('Datos de predicción inválidos.');
          }

          this.carreraSugerida = this.carreras[prediccion];
          this.porcentaje = Math.round(probabilidades[prediccion] * 100);
          const data: number[] = Object.keys(probabilidades).map(
            (k) => Math.round(probabilidades[k] * 100)
          );
          const labels: string[] = this.carreras;

          this.createPieChart(labels, data);

        } catch (error) {
          console.error('Error al procesar la predicción:', error);
          alert('Hubo un problema al cargar la predicción.');
          this.router.navigate(['/']);
        }
      } else {
        alert('No se encontró la predicción. Redirigiendo...');
        this.router.navigate(['/']);
      }
    }
  }

  createPieChart(labels: string[], data: number[]): void {
    const ctx = (document.getElementById('pieChart') as HTMLCanvasElement)?.getContext('2d');

    if (ctx) {
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: ['#3498db', '#2ecc71', '#f1c40f'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: 'bottom'
            },
            tooltip: {
              callbacks: {
                label: function(tooltipItem: any) {
                  return tooltipItem.label + ': ' + tooltipItem.raw + '%';
                }
              }
            }
          }
        }
      });
    }
  }
}

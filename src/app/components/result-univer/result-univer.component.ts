
import { Component,AfterViewInit,PLATFORM_ID,Inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';


@Component({
  selector: 'app-result-univer',
  imports: [CommonModule, RouterModule],
  templateUrl: './result-univer.component.html',
  styleUrl: './result-univer.component.css'
})
export class ResultUniverComponent {
  private chart: any;

  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

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
      console.error(' No se encontró el canvas en el DOM.');
      return;
    }

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: [
          "Fisico-matematicas", "Administrativas", "Biologicas", "Químicas", "Sociales",
          "Humanidades"
        ],
        datasets: [{
          label: "Puntaje",
          data: [20, 35, 25, 40, 30, 45], 
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

    console.log("Gráfica generada correctamente");
  }


}

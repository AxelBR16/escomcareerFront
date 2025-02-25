
import { Component,AfterViewInit,PLATFORM_ID,Inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';

@Component({
  selector: 'app-result-intereses',
  imports: [CommonModule, RouterModule],
  templateUrl: './result-intereses.component.html',
  styleUrl: './result-intereses.component.css'
})
export class ResultInteresesComponent {
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
          "Abstracto", "Coordinación", "Numérica", "Verbal", "Persuasiva",
          "Mecánica", "Social", "Directiva", "Organización", "Musical",
          "Artístico-Plástica", "Espacial"
        ],
        datasets: [{
          label: "Puntaje",
          data: [20, 35, 25, 40, 30, 28, 36, 42, 29, 33, 47, 10], 
          backgroundColor: [
            "#FFD700", "#98FB98", "#DDA0DD", "#FFB6C1", "#ADD8E6",
            "#FA8072", "#FFA07A", "#FF8C00", "#BA55D3", "#87CEEB",
            "#FF6347", "#FFDAB9"
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

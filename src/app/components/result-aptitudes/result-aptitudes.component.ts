import { Component, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import Swal from 'sweetalert2'; // Importar SweetAlert2

import { ResultadoResumenDTO } from '../../models/ResultadoResumenDTO';
import { ResultadoService } from '../../services/resultado.service';
import { HttpClientModule } from '@angular/common/http';
import { ModelService } from '../../services/model.service';
import { LoaderService } from '../../services/loader.service';
import { PredictionResponse } from '../../models/PredictionResponse';

Chart.register(annotationPlugin);

@Component({
  selector: 'app-result-aptitudes',
  templateUrl: './result-aptitudes.component.html',
  styleUrls: ['./result-aptitudes.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [ResultadoService]
})
export class ResultAptitudesComponent implements AfterViewInit {
  private chart: any;

  constructor(@Inject(PLATFORM_ID) private platformId: any, private router: Router,private resultadoService: ResultadoService,
  private modelService: ModelService,
  private loaderService: LoaderService) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        const email = sessionStorage.getItem('email')!;

        this.resultadoService.obtenerResumenPorCorreo(email).subscribe({
          next: (res) => {
            const { etiquetas, puntajes } = this.ordenarPorEscala(res);
            sessionStorage.setItem('puntajes', JSON.stringify({ puntajes }));
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
    1: 'Abstracta o Científica',
    2: 'Coordinación',
    3: 'Numérica',
    4: 'Verbal',
    5: 'Persuasiva',
    6: 'Mecánica',
    7: 'Social',
    8: 'Directiva',
    9: 'Organización',
    10: 'Musical',
    11: 'Artístico-Plástica',
    12: 'Espacial'
  };

  // Filtrar solo escalas entre 1 y 12
  const filtrados = resultados.filter(r => r.escalaId >= 1 && r.escalaId <= 12);

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
  }

   calcularIA() {
    const datosGuardados = sessionStorage.getItem('puntajes');

if (datosGuardados) {
  // Parseamos el string para obtener el objeto con la propiedad 'puntajes'
  const datos = JSON.parse(datosGuardados); // { puntajes: [...] }

  // Enviamos solo el array puntajes a la API
  this.loaderService.mostrarCargando('Calculando resultados, por favor espera...');

  this.modelService.predictCareer(datos.puntajes).subscribe({
    next: (response: PredictionResponse) => {
      sessionStorage.setItem('prediccionIA', JSON.stringify(response));
      this.loaderService.ocultarCargando();
      alert('Predicción guardada en sesión correctamente.');
    },
    error: (err) => {
      console.error('Error al obtener predicción:', err);
      this.loaderService.ocultarCargando();
      alert('Ocurrió un error al calcular la predicción.');
    }
  });
} else {
  alert('No se encontraron los puntajes guardados.');
}
  }


}

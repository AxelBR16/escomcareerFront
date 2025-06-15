import { Component, AfterViewInit, PLATFORM_ID, Inject, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { ResultadoService } from '../../services/resultado.service';
import Chart from 'chart.js/auto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-result-ai2',
  imports: [CommonModule, RouterModule],
  templateUrl: './result-ai2.component.html',
  styleUrls: ['./result-ai2.component.css']
})
export class ResultAI2Component implements AfterViewInit {

  // Carreras disponibles (según el modelo de intereses)
  carreras: string[] = [
    'Ingeniería en Sistemas Computacionales',
    'Licenciatura en Ciencia de Datos',
    'Ingeniería en Inteligencia Artificial'
  ];

  carreraSugerida: string = '';  // Carrera sugerida por el modelo
  porcentaje: number = 0;  // Probabilidad de la carrera sugerida

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private router: Router,
    private cdRef: ChangeDetectorRef,  // Inyectamos ChangeDetectorRef
    private resultadoService: ResultadoService  // Inyectamos el ResultadoService
  ) {}

  async ngAfterViewInit(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      // Obtén el email del usuario (debes obtenerlo dinámicamente)
      const emailU = 'usuario@example.com';  // Reemplaza esto por el email real del usuario

      if (emailU) {
        // Obtén los resultados de puntajes del servicio
        this.resultadoService.obtenerResumenPorCorreo(emailU).subscribe({
          next: (res) => {
            const { etiquetas, puntajes } = this.ordenarPorEscala(res);
            // Guarda los puntajes en sessionStorage
            sessionStorage.setItem('puntajes', JSON.stringify({ puntajes }));

            // Llama a Lambda para obtener la predicción usando el servicio
            this.resultadoService.enviarCaracteristicasALambda(puntajes).subscribe(
              (response: any) => {
                // Usamos los datos de respuesta de Lambda
                const probabilidades = response.probabilidades;
                const prediccion = parseInt(response.prediccion);
                this.carreraSugerida = this.carreras[prediccion];
                this.porcentaje = Math.round(probabilidades[prediccion] * 100);  // Convertimos la probabilidad en porcentaje

                const data: number[] = Object.keys(probabilidades).map(
                  (k) => Math.round(probabilidades[k] * 100)
                );
                const labels: string[] = this.carreras;

                this.cdRef.detectChanges();
                this.createPieChart(labels, data);
              },
              (error) => {
                console.error('Error al obtener la respuesta de Lambda:', error);
                Swal.fire('Error', 'Hubo un problema al cargar la predicción.', 'error');
              }
            );
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

  // Ordena las escalas y puntajes
  ordenarPorEscala(resultados: any[]): { etiquetas: string[], puntajes: number[] } {
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

  // Método para crear el gráfico de torta
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

import { Component, AfterViewInit, PLATFORM_ID, Inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import Chart from 'chart.js/auto';
import Swal from 'sweetalert2';  // Para mostrar alertas de carga
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resumen-global',
  imports: [RouterModule, CommonModule],
  templateUrl: './resumen-global.component.html',
  styleUrls: ['./resumen-global.component.css']
})
export class ResumenGlobalComponent implements AfterViewInit {

  // Carreras simuladas
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

  // Datos simulados para el inventario de aptitudes
  aptitudes = {
    'Abstracta o Científica': 35,
    'Coordinación': 45,
    'Numérica': 30,
    'Verbal': 50,
    'Persuasiva': 25,
    'Mecánica': 40,
    'Social': 45,
    'Directiva': 35,
    'Organización': 40,
    'Musical': 20,
    'Artístico-Plástica': 15,
    'Espacial': 25
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

      // Crear el gráfico de recomendación IA
      this.createPieChart(labels, data);

      // Crear el gráfico de aptitudes
      const aptitudesLabels = Object.keys(this.aptitudes);
      const aptitudesData = Object.values(this.aptitudes);
      this.createBarChart(aptitudesLabels, aptitudesData);
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

  // Método para crear el gráfico de barras con las aptitudes
  createBarChart(labels: string[], data: number[]): void {
    const ctx = (document.getElementById('aptitudesChart') as HTMLCanvasElement)?.getContext('2d');

    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Puntaje',
            data: data,
            backgroundColor: '#8e44ad', // Color de las barras
            borderColor: '#8e44ad',
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
          },
          plugins: {
            legend: {
              display: false  // Ocultamos la leyenda
            },
            tooltip: {
              callbacks: {
                label: function(tooltipItem: any) {
                  return tooltipItem.raw + ' puntos';  // Muestra el puntaje en el tooltip
                }
              }
            }
          }
        }
      });
    }
  }

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

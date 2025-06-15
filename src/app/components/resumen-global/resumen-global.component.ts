import { Component, AfterViewInit, PLATFORM_ID, Inject, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import Chart from 'chart.js/auto';
import Swal from 'sweetalert2';  // Para mostrar alertas de carga
import { CommonModule } from '@angular/common';
import { ResultadoService } from '../../services/resultado.service';  // Importa el servicio

@Component({
  selector: 'app-resumen-global',
  imports: [RouterModule, CommonModule],
  templateUrl: './resumen-global.component.html',
  styleUrls: ['./resumen-global.component.css']
})
export class ResumenGlobalComponent implements AfterViewInit {

  carreras: string[] = [
    'Ingeniería en Sistemas Computacionales',
    'Licenciatura en Ciencia de Datos',
    'Ingeniería en Inteligencia Artificial'
  ];

  carreraSugerida: string = '';
  porcentaje: number = 0;

  carreraSugeridaIntereses: string = '';
  porcentajeIntereses: number = 0;
  top3PreferenciasUniversitarias: { escala: string, puntaje: number }[] = [];
  top3Aptitudes: { escala: string, puntaje: number }[] = [];
  top3Intereses: { escala: string, puntaje: number }[] = [];


  // Para mostrar el Top 3 de las áreas más altas
  top3Areas: { area: string, puntaje: number }[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private resultadoService: ResultadoService  // Inyectar el servicio
  ) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {

        const top3Guardado = sessionStorage.getItem('top3PreferenciasUniversitarias');
        if (top3Guardado) {
          try {
            this.top3PreferenciasUniversitarias = JSON.parse(top3Guardado);
          } catch (error) {
            console.error('No se pudo cargar el top 3 de preferencias universitarias:', error);
          }
        }

        const top3AptitudesGuardado = sessionStorage.getItem('top3Aptitudes');
          if (top3AptitudesGuardado) {
            try {
              this.top3Aptitudes = JSON.parse(top3AptitudesGuardado);
            } catch (error) {
              console.error('No se pudo cargar el top 3 de aptitudes:', error);
            }
          }

          const top3InteresesGuardado = sessionStorage.getItem('top3Intereses');
          if (top3InteresesGuardado) {
            try {
              this.top3Intereses = JSON.parse(top3InteresesGuardado);
            } catch (error) {
              console.error('No se pudo cargar el top 3 de intereses:', error);
            }
          }





      // Obtener los resultados del servicio
      const resultados = this.resultadoService.getResultados();
      const etiquetas = resultados.etiquetas;
      const puntajes = resultados.puntajes;

      if (etiquetas && puntajes) {
        // Calcular el Top 3
        this.top3Areas = this.getTop3Areas(etiquetas, puntajes);
      } else {
        Swal.fire('Sin datos', 'No se encontraron los resultados. Redirigiendo...', 'info');
        this.router.navigate(['/']);
      }

      // Mostrar también la gráfica de intereses
const datosIntereses = sessionStorage.getItem('prediccionIA-intereses');
if (datosIntereses) {
  try {
    const parsed = JSON.parse(datosIntereses);
    const probabilidades = parsed.probabilidades;
    const prediccion = parseInt(parsed.prediccion);

    this.cdRef.detectChanges();
    if (
      isNaN(prediccion) ||
      !this.carreras[prediccion] ||
      !probabilidades.hasOwnProperty(prediccion)
    ) {
      throw new Error('Datos de intereses inválidos.');
    }

    this.carreraSugeridaIntereses = this.carreras[prediccion];
    this.porcentajeIntereses = Math.round(probabilidades[prediccion] * 100);

    const data: number[] = Object.keys(probabilidades).map(
      (k) => Math.round(probabilidades[k] * 100)
    );
    const labels: string[] = this.carreras;

    this.createPieChartIntereses(labels, data);

  } catch (error) {
    console.error('Error al procesar intereses:', error);
  }
}



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
          Swal.fire('Error', 'Hubo un problema al cargar la predicción.', 'error');
          this.router.navigate(['/']);
        }
      } else {
        Swal.fire('Sin datos', 'No se encontró la predicción. Redirigiendo...', 'info');
        this.router.navigate(['/']);
      }
    }
  }

  // Método para obtener el Top 3 de áreas más altas
  getTop3Areas(etiquetas: string[], puntajes: number[]): { area: string, puntaje: number }[] {
    const areasPuntajes = etiquetas.map((etiqueta, index) => ({
      area: etiqueta,
      puntaje: puntajes[index]
    }));

    // Ordenar por puntaje (de mayor a menor)
    areasPuntajes.sort((a, b) => b.puntaje - a.puntaje);

    // Toma solo las tres primeras áreas
    return areasPuntajes.slice(0, 3);
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

  //aqui po la otra grafica de intereses 
  createPieChartIntereses(labels: string[], data: number[]): void {
  const ctx = (document.getElementById('pieChartIntereses') as HTMLCanvasElement)?.getContext('2d');

  if (ctx) {
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: ['#9b59b6', '#1abc9c', '#e67e22'],
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
              label: function (tooltipItem: any) {
                return tooltipItem.label + ': ' + tooltipItem.raw + '%';
              }
            }
          }
        }
      }
    });
  }
}

  
//efectivo
}

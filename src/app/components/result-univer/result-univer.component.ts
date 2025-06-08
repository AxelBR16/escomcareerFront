
import { Component,AfterViewInit,PLATFORM_ID,Inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import { ResultadoService } from '../../services/resultado.service';
import Swal from 'sweetalert2';
import { ResultadoResumenDTO } from '../../models/ResultadoResumenDTO';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-result-univer',
  imports: [CommonModule, RouterModule],
  templateUrl: './result-univer.component.html',
  styleUrl: './result-univer.component.css'
})
export class ResultUniverComponent {
  private chart: any;
   etiquetas: string[] = [];
  puntajes: number[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: any, private router: Router,private resultadoService: ResultadoService, private authService: AuthService) {}
   async ngAfterViewInit(): Promise<void> {
      await new Promise(resolve => setTimeout(resolve, 500));
    
      try {
        const emailU = await this.authService.getCurrentUserEmail();
        if (emailU) {
          this.resultadoService.obtenerResumenPorCorreo(emailU).subscribe({
            next: (res) => {
              const { etiquetas, puntajes } = this.ordenarPorEscala(res);
              sessionStorage.setItem('puntajes', JSON.stringify({ puntajes }));
              this.initChart(etiquetas, puntajes);
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
     ordenarPorEscala(resultados: ResultadoResumenDTO[]): { etiquetas: string[], puntajes: number[] } {
    const escalaLabels: { [key: number]: string } = {
      26: 'Fisicomatemáticas',
      27: 'Administrativas',
      28: 'Biológicas',
      29: 'Químicas',
      30: 'Sociales',
      31: 'Humanidades',
    };

    // Filtrar solo escalas entre 1 y 12
    const filtrados = resultados.filter(r => r.escalaId >= 26 && r.escalaId <= 31);

    // Ordenar por escalaId
    const ordenados = filtrados.sort((a, b) => a.escalaId - b.escalaId);

    const etiquetas = ordenados.map(r => escalaLabels[r.escalaId] || `Escala ${r.escalaId}`);
    const puntajes = ordenados.map(r => r.puntaje);

    return { etiquetas, puntajes };
  }


     initChart(etiquetas: string[], puntajes: number[]): void {
      const canvas = document.getElementById('aptitudesChart') as HTMLCanvasElement;
      this.etiquetas = etiquetas;
      this.puntajes = puntajes;

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


 mostrarAlertaYRedirigir(etiquetas: string[], puntajes: number[]) {
  const indexFisico = etiquetas.indexOf('Fisicomatemáticas');
  if (indexFisico === -1) {
    Swal.fire('Información', 'No se encontró la escala Fisicomatemáticas.', 'info');
    return;
  }

  const pares = etiquetas.map((et, i) => ({ etiqueta: et, puntaje: puntajes[i] }));
  pares.sort((a, b) => b.puntaje - a.puntaje);
  const fisicoEnTop3 = pares.slice(0, 3).some(p => p.etiqueta === 'Fisicomatemáticas');

  if (fisicoEnTop3) {
    Swal.fire({
      title: '¡Felicidades!',
      html: '<b>Tu puntaje en Fisicomatemáticas está dentro de los 3 más altos.</b> Puedes contestar los demás cuestionarios.',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: { popup: 'swal2-popup-custom' }
    }).then(result => {
      if (result.isConfirmed) {
        this.router.navigate(['/pruebasA']);
      }
    });
  } else {
    Swal.fire({
      title: 'Acceso denegado',
      html: 'Tu puntaje en Fisicomatemáticas no está entre los 3 más altos, por lo que no puedes acceder a los siguientes cuestionarios.',
      icon: 'error',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: { popup: 'swal2-popup-custom' }
    });
  }
}




  }


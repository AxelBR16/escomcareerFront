import { Component, AfterViewInit, PLATFORM_ID, Inject, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
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

 ngAfterViewInit(): void {
     if (isPlatformBrowser(this.platformId)) {
       const datosIA = sessionStorage.getItem('prediccionIA-intereses');
 
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
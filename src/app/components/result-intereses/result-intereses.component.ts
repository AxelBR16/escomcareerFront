
import { Component,AfterViewInit,PLATFORM_ID,Inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import Swal from 'sweetalert2';
import { ResultadoService } from '../../services/resultado.service';
import { ResultadoResumenDTO } from '../../models/ResultadoResumenDTO';
import { HttpClientModule } from '@angular/common/http';
import { ModelService } from '../../services/model.service';
import { LoaderService } from '../../services/loader.service';
import { PredictionResponse } from '../../models/PredictionResponse';
import { AuthService } from '../../services/auth.service';

Chart.register(annotationPlugin);

@Component({
  selector: 'app-result-intereses',
  imports: [CommonModule, RouterModule],
  templateUrl: './result-intereses.component.html',
  standalone: true,
  styleUrl: './result-intereses.component.css',
  providers: [ResultadoService]
})
export class ResultInteresesComponent {
  private chart: any;

  constructor(@Inject(PLATFORM_ID) private platformId: any, private router: Router,private resultadoService: ResultadoService,  
  private modelService: ModelService,
  private loaderService: LoaderService,
  private authService: AuthService) {}

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

          // ✅ Guardar Top 3 de intereses
        const top3 = etiquetas.map((et, index) => ({
          escala: et,
          puntaje: puntajes[index]
        }))
        .sort((a, b) => b.puntaje - a.puntaje)
        .slice(0, 3);

        sessionStorage.setItem('top3Intereses', JSON.stringify(top3));

        return { etiquetas, puntajes };
      }

initChart(etiquetas: string[], puntajes: number[]): void {
    const canvas = document.getElementById('interesesChart') as HTMLCanvasElement;

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
            "#A8E6A3",
          "#A8E6A3", "#C5E1A5", "#D7CCC8", "#D1C4E9", "#BBDEFB", "#B2DFDB", "#C5CAE9", "#CFD8DC", "#FFCCBC", "#FFF59D", "#FFCDD2", "#E1BEE7", "#FFAB91"
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
        },
         onClick: (event: any) => this.handleChartClick(event) // Agregar el evento de clic
      }
    });
  }


  textosBarra: string[] = [
  "Esta habilidad se refiere a la capacidad de aplicar el pensamiento de manera amplia, especialmente en el ámbito científico. Implica la habilidad para observar, inferir, entender relaciones sistemáticas, plantear hipótesis, construir predicciones y comprender relaciones complejas de manera eficiente. Las personas con esta aptitud son aptas para ocupaciones en áreas como química, medicina y biología.",
  "Esta habilidad se refiere a la capacidad de realizar movimientos manuales precisos, coordinados entre manos y ojos. Implica la destreza para ejecutar tareas que requieren movimientos finos, como el trazo de líneas delicadas o el manejo de herramientas pequeñas. Se desarrolla cuando un individuo puede trabajar de manera precisa con mínima error. Ocupaciones que requieren esta habilidad incluyen joyería, reparaciones electrónicas, y cirugía.",
  "Esta habilidad involucra el conocimiento y uso adecuado de fórmulas numéricas y el lenguaje simbólico en operaciones que requieren números. Las personas con esta habilidad pueden resolver problemas numéricos eficientemente, traducir situaciones a un lenguaje numérico y formular problemas de este tipo. Además, pueden enseñar la disciplina de manera clara. Las ocupaciones relacionadas incluyen áreas como ingeniería, matemáticas, estadísticas y contabilidad.",
  "La aptitud verbal se caracteriza por el manejo eficiente de representaciones semánticas, como la construcción mental de un discurso o la lectura. Las personas con esta habilidad pueden reconocer ideas principales, coordinar párrafos, obtener mensajes con facilidad y desarrollar textos de manera coherente. Las ocupaciones relacionadas incluyen derecho, filosofía, relaciones públicas, sociología y trabajo social.",
  "La aptitud persuasiva se refiere a la capacidad de formular argumentos para apoyar un punto de vista y persuadir a otros a cambiar sus actitudes. Además, involucra la habilidad para argumentar desde puntos de vista contrarios. Las personas con esta habilidad pueden apelar a los sentimientos y razones convincentes, y formular razonamientos de manera rápida y efectiva. Las ocupaciones relacionadas incluyen ventas, psicología, relaciones públicas, derecho, mercadotecnia y relaciones internacionales.",
  "Esta habilidad implica el uso eficiente de herramientas y la capacidad para representar espacialmente cómo se transmite el movimiento entre las partes de un artefacto. También incluye la capacidad para entender cómo se transforma la energía en dispositivos mecánicos o eléctricos. Las personas con esta habilidad pueden identificar disfunciones en artefactos y hacer predicciones sobre su funcionamiento. Las ocupaciones relacionadas incluyen ingeniería, mecánica, automotriz y electrónica.",
  "La aptitud social se refiere a la capacidad de comprender el mundo desde la perspectiva de otras personas, interpretando temores, sentimientos y expectativas. Un indicador de esta habilidad es la capacidad de escuchar empáticamente, es decir, sin juzgar y comprendiendo realmente al otro. Las ocupaciones relacionadas incluyen psicología, trabajo social, terapia familiar, y sacerdocio.",
  "La aptitud directiva se refiere a la capacidad de un sujeto para liderar grupos laborales y cumplir con responsabilidades. Las personas con esta habilidad pueden formular juicios, evaluar logros de trabajo, interpretar reglamentos y tomar decisiones justas. Además, tienen la capacidad de liderar grupos y gestionar eficientemente la ejecución de tareas. Las ocupaciones relacionadas incluyen administración, supervisión de equipos y liderazgo en organizaciones.",
  "La aptitud organizacional se refiere a la capacidad para manejar información usando sistemas de cómputo, establecer variables, tabular y representar datos complejos. Implica también diseñar modelos y procedimientos para la localización rápida de objetos (como inventarios). Las personas con esta habilidad se destacan en técnicas formales de organización. Las ocupaciones relacionadas incluyen archivistas, licenciados en computación e informática, y roles en administración.",
  "La aptitud musical se manifiesta cuando un individuo tiene una destacada memoria auditiva y la capacidad para reconocer diferencias y semejanzas de tonos. También incluye la habilidad para combinar tonos en ejecución musical con acordes y melodías. Las personas con esta aptitud son capaces de asociar notas significativas y crear composiciones armoniosas.",
  "Esta habilidad se refiere al uso y aplicación armónica de colores, la expresión de formas en tres dimensiones y el manejo de herramientas para estas labores. Implica también el manejo de transformaciones visuales y plásticas de diversos materiales, así como la interpretación y diseño de planos y bosquejos. Las ocupaciones relacionadas incluyen decoradores de interiores, artesanos, arquitectos y diseñadores gráficos.",
  "La aptitud espacial se caracteriza por la capacidad para manejar representaciones y orientarse en el espacio. Implica memoria visual y habilidad para localizar puntos en mapas, así como para imaginar objetos en tres dimensiones. Las personas con esta habilidad también pueden optimizar el acomodo de objetos o diseñar con representaciones tridimensionales detalladas. Las ocupaciones relacionadas incluyen diseñadores industriales, arquitectos, ingenieros civiles y topógrafos.",
  "La aptitud espacial se caracteriza por la capacidad para manejar representaciones y orientarse en el espacio. Implica memoria visual y habilidad para localizar puntos en mapas, así como para imaginar objetos en tres dimensiones. Las personas con esta habilidad también pueden optimizar el acomodo de objetos o diseñar con representaciones tridimensionales detalladas. Las ocupaciones relacionadas incluyen diseñadores industriales, arquitectos, ingenieros civiles y topógrafos."
];


// Maneja el clic en una barra
handleChartClick(event: any): void {
  const activePoints = this.chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);
  if (activePoints.length > 0) {
    const index = activePoints[0].index;
    const label = this.chart.data.labels[index];

    // Obtener el texto asociado a la barra seleccionada
    const textoBarra = this.textosBarra[index];

    // Mostrar el texto usando SweetAlert2
    Swal.fire({
      title: `Información sobre la escala ${label}`,
      text: textoBarra,
      icon: 'info'
    });
  }
}
  

    calcularIA() {
      // Si ya hay una predicción guardada, redirige directamente al resultado
      const prediccionGuardada = sessionStorage.getItem('prediccionIA-intereses');
      if (prediccionGuardada) {
        this.router.navigate(['/resultAI2']);
        return;
      }
      const datosGuardados = sessionStorage.getItem('puntajes');
      if (datosGuardados) {
        const datos = JSON.parse(datosGuardados);

        this.loaderService.mostrarCargando('Calculando resultados, por favor espera...');

       

        this.modelService.predictCareerIntereses(datos.puntajes).subscribe({
          next: (response: PredictionResponse) => {
            sessionStorage.setItem('prediccionIA-intereses', JSON.stringify(response));
            this.loaderService.ocultarCargando();
            this.router.navigate(['/resultAI2']);
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






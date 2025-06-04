import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-splash-screen',
  imports: [RouterModule, CommonModule],
  templateUrl: './splash-screen.component.html',
  styleUrl: './splash-screen.component.css'
})
export class SplashScreenComponent implements OnInit {

            constructor(private router: Router) { }


ngOnInit(): void {
                // Simular carga de datos, autenticación, etc.
                this.loadApplication();
            }

            private loadApplication(): void {
                setTimeout(() => {
                  this.router.navigate(['/inicio-mobile']);
                }, 4000);
            }
}

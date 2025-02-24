import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectsInicioComponent } from './proyects-inicio.component';

describe('ProyectsInicioComponent', () => {
  let component: ProyectsInicioComponent;
  let fixture: ComponentFixture<ProyectsInicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProyectsInicioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProyectsInicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

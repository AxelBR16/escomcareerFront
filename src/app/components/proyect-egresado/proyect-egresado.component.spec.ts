import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectEgresadoComponent } from './proyect-egresado.component';

describe('ProyectEgresadoComponent', () => {
  let component: ProyectEgresadoComponent;
  let fixture: ComponentFixture<ProyectEgresadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProyectEgresadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProyectEgresadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

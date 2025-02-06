import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EgresadoDashboardComponent } from './egresado-dashboard.component';

describe('EgresadoDashboardComponent', () => {
  let component: EgresadoDashboardComponent;
  let fixture: ComponentFixture<EgresadoDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EgresadoDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EgresadoDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

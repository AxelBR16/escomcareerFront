import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingInicioComponent } from './loading-inicio.component';

describe('LoadingInicioComponent', () => {
  let component: LoadingInicioComponent;
  let fixture: ComponentFixture<LoadingInicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingInicioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingInicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

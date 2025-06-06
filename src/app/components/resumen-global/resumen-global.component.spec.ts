import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenGlobalComponent } from './resumen-global.component';

describe('ResumenGlobalComponent', () => {
  let component: ResumenGlobalComponent;
  let fixture: ComponentFixture<ResumenGlobalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumenGlobalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumenGlobalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

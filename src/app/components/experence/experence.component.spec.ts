import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperenceComponent } from './experence.component';

describe('ExperenceComponent', () => {
  let component: ExperenceComponent;
  let fixture: ComponentFixture<ExperenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExperenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

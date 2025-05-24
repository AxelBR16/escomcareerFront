import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultAI2Component } from './result-ai2.component';

describe('ResultAI2Component', () => {
  let component: ResultAI2Component;
  let fixture: ComponentFixture<ResultAI2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultAI2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultAI2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

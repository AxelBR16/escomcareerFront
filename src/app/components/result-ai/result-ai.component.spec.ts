import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultAIComponent } from './result-ai.component';

describe('ResultAIComponent', () => {
  let component: ResultAIComponent;
  let fixture: ComponentFixture<ResultAIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultAIComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultAIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

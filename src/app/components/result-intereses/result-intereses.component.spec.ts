import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultInteresesComponent } from './result-intereses.component';

describe('ResultInteresesComponent', () => {
  let component: ResultInteresesComponent;
  let fixture: ComponentFixture<ResultInteresesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultInteresesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultInteresesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

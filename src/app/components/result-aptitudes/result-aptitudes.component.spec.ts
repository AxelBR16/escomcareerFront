import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultAptitudesComponent } from './result-aptitudes.component';

describe('ResultAptitudesComponent', () => {
  let component: ResultAptitudesComponent;
  let fixture: ComponentFixture<ResultAptitudesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultAptitudesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultAptitudesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

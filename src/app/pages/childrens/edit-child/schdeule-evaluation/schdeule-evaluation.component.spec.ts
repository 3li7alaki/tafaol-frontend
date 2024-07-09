import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchdeuleEvaluationComponent } from './schdeule-evaluation.component';

describe('SchdeuleEvaluationComponent', () => {
  let component: SchdeuleEvaluationComponent;
  let fixture: ComponentFixture<SchdeuleEvaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchdeuleEvaluationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SchdeuleEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

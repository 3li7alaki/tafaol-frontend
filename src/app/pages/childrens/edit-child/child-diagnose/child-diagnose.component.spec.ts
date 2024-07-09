import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildDiagnoseComponent } from './child-diagnose.component';

describe('ChildDiagnoseComponent', () => {
  let component: ChildDiagnoseComponent;
  let fixture: ComponentFixture<ChildDiagnoseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChildDiagnoseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChildDiagnoseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

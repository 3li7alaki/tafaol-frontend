import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDiagnoseComponent } from './add-diagnose.component';

describe('AddDiagnoseComponent', () => {
  let component: AddDiagnoseComponent;
  let fixture: ComponentFixture<AddDiagnoseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDiagnoseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddDiagnoseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

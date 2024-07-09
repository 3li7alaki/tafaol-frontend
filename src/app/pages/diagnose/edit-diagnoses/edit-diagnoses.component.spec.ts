import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDiagnosesComponent } from './edit-diagnoses.component';

describe('EditDiagnosesComponent', () => {
  let component: EditDiagnosesComponent;
  let fixture: ComponentFixture<EditDiagnosesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDiagnosesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditDiagnosesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

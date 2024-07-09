import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDiagnosesComponent } from './add-diagnoses.component';

describe('AddDiagnosesComponent', () => {
  let component: AddDiagnosesComponent;
  let fixture: ComponentFixture<AddDiagnosesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDiagnosesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddDiagnosesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

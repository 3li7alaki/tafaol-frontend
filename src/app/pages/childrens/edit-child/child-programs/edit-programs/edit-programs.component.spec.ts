import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProgramsComponent } from './edit-programs.component';

describe('EditProgramsComponent', () => {
  let component: EditProgramsComponent;
  let fixture: ComponentFixture<EditProgramsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditProgramsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditProgramsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGaurdianComponent } from './edit-gaurdian.component';

describe('EditGaurdianComponent', () => {
  let component: EditGaurdianComponent;
  let fixture: ComponentFixture<EditGaurdianComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditGaurdianComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditGaurdianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

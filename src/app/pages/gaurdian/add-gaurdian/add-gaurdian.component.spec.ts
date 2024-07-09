import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGaurdianComponent } from './add-gaurdian.component';

describe('AddGaurdianComponent', () => {
  let component: AddGaurdianComponent;
  let fixture: ComponentFixture<AddGaurdianComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddGaurdianComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddGaurdianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBasicChildDataComponent } from './add-basic-child-data.component';

describe('AddBasicChildDataComponent', () => {
  let component: AddBasicChildDataComponent;
  let fixture: ComponentFixture<AddBasicChildDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBasicChildDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddBasicChildDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

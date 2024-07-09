import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNationalityComponent } from './edit-nationality.component';

describe('EditNationalityComponent', () => {
  let component: EditNationalityComponent;
  let fixture: ComponentFixture<EditNationalityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditNationalityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditNationalityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildPlansComponent } from './child-plans.component';

describe('ChildPlansComponent', () => {
  let component: ChildPlansComponent;
  let fixture: ComponentFixture<ChildPlansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChildPlansComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChildPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

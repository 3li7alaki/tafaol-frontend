import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildProgramsComponent } from './child-programs.component';

describe('ChildProgramsComponent', () => {
  let component: ChildProgramsComponent;
  let fixture: ComponentFixture<ChildProgramsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChildProgramsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChildProgramsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

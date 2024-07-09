import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildrensListComponent } from './childrens-list.component';

describe('ChildrensListComponent', () => {
  let component: ChildrensListComponent;
  let fixture: ComponentFixture<ChildrensListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChildrensListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChildrensListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

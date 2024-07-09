import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicChildDataComponent } from './basic-child-data.component';

describe('BasicChildDataComponent', () => {
  let component: BasicChildDataComponent;
  let fixture: ComponentFixture<BasicChildDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicChildDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BasicChildDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

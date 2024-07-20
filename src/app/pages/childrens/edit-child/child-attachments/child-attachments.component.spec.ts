import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildAttachmentsComponent } from './child-attachments.component';

describe('ChildAttachmentsComponent', () => {
  let component: ChildAttachmentsComponent;
  let fixture: ComponentFixture<ChildAttachmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChildAttachmentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChildAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

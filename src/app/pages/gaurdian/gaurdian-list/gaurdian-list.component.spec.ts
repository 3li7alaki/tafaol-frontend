import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GaurdianListComponent } from './gaurdian-list.component';

describe('GaurdianListComponent', () => {
  let component: GaurdianListComponent;
  let fixture: ComponentFixture<GaurdianListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GaurdianListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GaurdianListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

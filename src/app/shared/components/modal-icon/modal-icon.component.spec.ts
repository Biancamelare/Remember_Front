import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalIconComponent } from './modal-icon.component';

describe('ModalIconComponent', () => {
  let component: ModalIconComponent;
  let fixture: ComponentFixture<ModalIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalIconComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

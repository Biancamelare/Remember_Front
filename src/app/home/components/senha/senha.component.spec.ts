import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SenhaComponent } from './senha.component';

describe('SenhaComponent', () => {
  let component: SenhaComponent;
  let fixture: ComponentFixture<SenhaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SenhaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SenhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

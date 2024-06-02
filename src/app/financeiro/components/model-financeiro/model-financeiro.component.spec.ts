import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelFinanceiroComponent } from './model-financeiro.component';

describe('ModelFinanceiroComponent', () => {
  let component: ModelFinanceiroComponent;
  let fixture: ComponentFixture<ModelFinanceiroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModelFinanceiroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModelFinanceiroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

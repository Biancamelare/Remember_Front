import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaFinanceiroComponent } from './lista-financeiro.component';

describe('ListaFinanceiroComponent', () => {
  let component: ListaFinanceiroComponent;
  let fixture: ComponentFixture<ListaFinanceiroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaFinanceiroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListaFinanceiroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

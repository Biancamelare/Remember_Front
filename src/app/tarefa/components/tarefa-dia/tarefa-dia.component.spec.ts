import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarefaDiaComponent } from './tarefa-dia.component';

describe('TarefaDiaComponent', () => {
  let component: TarefaDiaComponent;
  let fixture: ComponentFixture<TarefaDiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarefaDiaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TarefaDiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

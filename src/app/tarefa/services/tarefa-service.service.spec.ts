import { TestBed } from '@angular/core/testing';

import { TarefaServiceService } from './tarefa-service.service';

describe('TarefaServiceService', () => {
  let service: TarefaServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TarefaServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfirmacaoService } from './service/confirm.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.css'
})

export class ConfirmComponent implements OnDestroy {
  confirmacao: any = {};
  isConfirmacaoVisible: boolean = false;
  private confirmacaoSubscription: Subscription;

  constructor(private confirmacaoService: ConfirmacaoService) {
    this.confirmacaoSubscription = this.confirmacaoService.getConfirmacao().subscribe(confirmacao => {
      this.confirmacao = confirmacao;
      this.openModal();
    });
  }

  ngOnDestroy(): void {
    this.confirmacaoSubscription.unsubscribe();
  }
  confirmarAcao(): void {
    this.confirmacao.resolve(true);
    this.closeModal()
  }

  cancelarAcao(): void {
    this.confirmacao.resolve(false);
    this.closeModal()
  }

  openModal() {
    this.isConfirmacaoVisible = true;
  }
  closeModal() {
    this.isConfirmacaoVisible = false;
}}

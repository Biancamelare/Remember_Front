import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })
  export class FuncoesService {
  
   token?: string;
   user: any | null = null;
  
  
    constructor() { }
  
    formatarData(dataISO: string): string {
        const data = new Date(dataISO);
        const dia = this.padZero(data.getDate());
        const mes = this.padZero(data.getMonth() + 1); 
        const ano = data.getFullYear();
    
        return `${ano}-${mes}-${dia}`;
      }
    
      private padZero(num: number): string {
        return num < 10 ? `0${num}` : `${num}`;
      }
    
      
      formatarTelefone(telefone: string): string {
        const telefoneLimpo = telefone.replace(/\D/g, '');
        if (telefoneLimpo.length !== 11) {
          return telefone;
        }
        const parte1 = telefoneLimpo.slice(0, 2); 
        const parte2 = telefoneLimpo.slice(2, 7); 
        const parte3 = telefoneLimpo.slice(7); 
        return `(${parte1})${parte2}-${parte3}`;
      }
    
    
      formatarNomeCompleto(nomeCompleto: string): string {
        const partesNome = nomeCompleto.split(' ');
        const primeiroNome = partesNome[0];
        const primeiraLetraMaiuscula = primeiroNome.charAt(0).toUpperCase();
        const restanteNome = primeiroNome.slice(1);
      
        const nomeFormatado = primeiraLetraMaiuscula + restanteNome;
      
        return nomeFormatado;
      }

      formatarTelefone2(event: Event): void {
        const target = event.target as HTMLInputElement; 
        if (target && target.value) { 
          const telefoneNumerico = target.value.replace(/\D/g, ''); 
          const match = telefoneNumerico.match(/^(\d{2})(\d{5})(\d{4})$/);
      
          if (match) {
            target.value = `(${match[1]}) ${match[2]}-${match[3]}`; 
          }
        }
      }
    
  }
  
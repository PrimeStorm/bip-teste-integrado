import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Beneficio, BeneficioService } from '../../services/beneficio';

@Component({
  selector: 'app-beneficio-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  
  templateUrl: './beneficio-list.html',
  styleUrls: ['./beneficio-list.css']
})
export class BeneficioListComponent implements OnInit {
  beneficios: Beneficio[] = [];
  
  origemId: number | null = null;
  destinoId: number | null = null;
  valor: number | null = null;
  mensagem: string = '';

  constructor(private service: BeneficioService) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  limparFormulario() {
    this.valor = null;
    this.origemId = null;
    this.destinoId = null;
  }
  carregarDados() {
    this.service.listar().subscribe({
      next: (dados) => this.beneficios = dados,
      error: (erro) => console.error('Erro ao buscar dados', erro)
    });
  }

  realizarTransferencia() {
    if (!this.origemId || !this.destinoId || !this.valor) {
      this.mensagem = 'Preencha todos os campos!';
      return;
    }
    
    // Validação: Valor Negativo ou Zero
    if (this.valor <= 0) {
      this.mensagem = 'O valor deve ser maior que zero!';
      return;
    }

    // Validação: Transferência para a mesma conta
    if (this.origemId === this.destinoId) {
      this.mensagem = 'Origem e Destino não podem ser iguais!!';
      return;
    }

    this.service.transferir(this.origemId, this.destinoId, this.valor).subscribe({
      next: () => {
        this.mensagem = 'Transferência realizada com sucesso!';
        this.carregarDados();
        this.limparFormulario();       
      },
      error: (err) => {
        // Pega a mensagem de erro ou usa uma genérica
        const msgErro = err.error ? err.error : 'Falha na transferência';
        this.mensagem = 'Erro: ' + msgErro;
      }
    });
  }
}

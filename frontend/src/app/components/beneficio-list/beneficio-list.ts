import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // <--- 1. ADICIONE O ChangeDetectorRef AQUI
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Beneficio, BeneficioService } from '../../services/beneficio';
import { finalize } from 'rxjs/operators';

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
  carregando: boolean = false;

  constructor(
    private service: BeneficioService,
    private cd: ChangeDetectorRef 
  ) {}

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
    // Validações campos obrigatórios
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
    // INÍCIO: Avisa que começou a carregar processamento
    this.carregando = true;
    this.mensagem = 'Processando...';

    this.service.transferir(this.origemId, this.destinoId, this.valor)
      .pipe(      
        finalize(() => {
          this.carregando = false;
          this.cd.detectChanges(); //força atualização da view
          //console.log("Processo finalizado.");
        })
      ).subscribe({
        next: (resp) => {
          // Sucesso
          //console.log('Resposta do Java:', resp);
          this.mensagem = 'Transferência realizada com sucesso!';
          this.carregarDados();    // Atualiza a tabela
          this.limparFormulario(); // Limpa os inputs
        },
      error: (err) => {
        // Erro
          console.error('Erro:', err);
          // Tenta ler a mensagem de erro, se for um JSON ou texto
          let msg = 'Falha na transferência';
          if (err.error && typeof err.error === 'string') {
             msg = err.error; // Erro veio como texto simples
          } else if (err.error && err.error.message) {
             msg = err.error.message; // Erro veio como objeto JSON
          }
          this.mensagem = 'Erro: ' + msg;
      }
    });
  }
}

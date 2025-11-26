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
  novoNome: string = '';
  novoValor: number | null = null;
  novaDescricao: string = '';
  mensagem: string = '';
  carregando: boolean = false;

  constructor(
    private service: BeneficioService,
    private cd: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  // Função para criar conta
  criarBeneficio() {
    if (!this.novoNome || !this.novoValor) {
      alert('Preencha nome e valor inicial!');
      return;
    }

    // Cria o objeto parcial para enviar
    const novo = { 
      nome: this.novoNome, 
      valor: this.novoValor, 
      descricao: this.novaDescricao ? this.novaDescricao : 'Sem descrição'
    };    
    this.service.criar(novo).subscribe(() => {
      this.carregarDados(); // Atualiza a lista
      this.limparFormulario(); // Limpa os inputs
    });
  }

  // Função para deletar conta
  deletarBeneficio(id: number) {
    if(confirm('Tem certeza que deseja excluir esta conta?')) {
      this.service.remover(id).subscribe(() => {
        this.carregarDados(); // Atualiza a lista apos remover
      });
    }
  }

  limparFormulario() {
    this.valor = null;
    this.origemId = null;
    this.destinoId = null;
    this.novoNome = '';
    this.novoValor = null;
    this.novaDescricao = '';
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
        })
      ).subscribe({
        next: (resp) => {
          // Sucesso
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

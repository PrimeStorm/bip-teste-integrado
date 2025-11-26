# 🏗️ Desafio Fullstack Integrado
# 🚀 Desafio Bip Teste Integrado - Solução Fullstack

Solução completa desenvolvida para o desafio técnico, integrando correção de EJB legado, API Spring Boot e Frontend Angular.

## 📋 Visão Geral
O projeto corrige falhas críticas de concorrência em um módulo EJB bancário e expõe suas funcionalidades através de uma arquitetura moderna Fullstack.

### ✨ Funcionalidades Entregues
1.  **Core & Concorrência:**
    * Correção de bug de **Lost Update** e saldo negativo usando **Optimistic Locking** (`@Version`).
    * Implementação de transações seguras.

2.  **Backend (Spring Boot 3):**
    * API RESTful documentada (Swagger).
    * **CRUD Completo:** Listar, Criar, Transferir (Update) e Deletar contas.
    * Testes de Integração automatizados.

3.  **Frontend (Angular 17+):**
    * Interface reativa com **Standalone Components**.
    * Gestão de estado visual (Loading, Feedback de Erro/Sucesso).
    * Atualização automática de listagem (Change Detection).

---

## 🛠️ Stack Tecnológica
* **Java 17** & **Spring Boot 3.2.5**
* **Jakarta EE (EJB)**
* **Angular CLI** & **TypeScript**
* **H2 Database** (Em memória)
* **Maven** & **Git**

---

## 🚀 Guia de Execução

Você precisará de dois terminais abertos simultaneamente.

### 1. Backend (API)
```bash
cd backend-module
mvn clean spring-boot:run

. A API iniciará em: http://localhost:8080
. O banco H2 é criado automaticamente com dados de teste.

cd frontend
npm install
ng serve

. Acesse a aplicação em: http://localhost:4200

🧪 Qualidade e Testes
O projeto possui uma suíte de testes de integração que valida o fluxo completo (Banco -> Service -> Controller).

Para rodar os testes:

cd backend-module
mvn test

. ✅ Testa carga de dados (Seed).

. ✅ Testa concorrência e regras de saldo.

. ✅ Testa criação e remoção de contas.


📚 Documentação da API
Com o backend rodando, acesse a documentação interativa (Swagger UI):
 👉 http://localhost:8080/swagger-ui/index.html

Desenvolvido por Ramon R.Vieira

_______________________________________________________________________________________________________________________________



## 🎯 Objetivo
Criar solução completa em camadas (DB, EJB, Backend, Frontend), corrigindo bug em EJB e entregando aplicação funcional.

## 📦 Estrutura
- db/: scripts schema e seed
- ejb-module/: serviço EJB com bug a ser corrigido
- backend-module/: backend Spring Boot
- frontend/: app Angular
- docs/: instruções e critérios
- .github/workflows/: CI

## ✅ Tarefas do candidato
1. Executar db/schema.sql e db/seed.sql
2. Corrigir bug no BeneficioEjbService
3. Implementar backend CRUD + integração com EJB
4. Desenvolver frontend Angular consumindo backend
5. Implementar testes
6. Documentar (Swagger, README)
7. Submeter via fork + PR

## 🐞 Bug no EJB
- Transferência não verifica saldo, não usa locking, pode gerar inconsistência
- Espera-se correção com validações, rollback, locking/optimistic locking

## 📊 Critérios de avaliação
- Arquitetura em camadas (20%)
- Correção EJB (20%)
- CRUD + Transferência (15%)
- Qualidade de código (10%)
- Testes (15%)
- Documentação (10%)
- Frontend (10%)

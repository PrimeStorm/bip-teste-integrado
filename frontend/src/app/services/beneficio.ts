import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Beneficio {
  id: number;
  nome: string;
  valor: number;
  version: number;
  descricao?: string; // (é opcional)
}

@Injectable({
  providedIn: 'root'
})
export class BeneficioService {
  // URL do Backend Java
  private apiUrl = 'http://localhost:8080/api/v1/beneficios';

  constructor(private http: HttpClient) { }

  // Lista todos os benefícios
  listar(): Observable<Beneficio[]> {
    return this.http.get<Beneficio[]>(this.apiUrl);
  }
  // Criar (POST)
  criar(beneficio: Partial<Beneficio>): Observable<Beneficio> {
    return this.http.post<Beneficio>(this.apiUrl, beneficio);
  }

  // Deletar (DELETE)
  remover(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Realiza a transferência
  transferir(fromId: number, toId: number, amount: number): Observable<any> {
    const payload = { fromId, toId, amount };
    // Chama o endpoint POST /transfer
    //return this.http.post(`${this.apiUrl}/transfer`, payload);
    // para evitar erro de JSON vazio
    return this.http.post(`${this.apiUrl}/transfer`, payload, {
      responseType: 'text' as 'json'
    });
  }
}

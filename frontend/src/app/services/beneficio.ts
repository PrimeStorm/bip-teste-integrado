import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Beneficio {
  id: number;
  nome: string;
  valor: number;
  version: number;
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

  // Realiza a transferência
  transferir(fromId: number, toId: number, amount: number): Observable<any> {
    const payload = { fromId, toId, amount };
    // Chama o endpoint POST /transfer
    return this.http.post(`${this.apiUrl}/transfer`, payload);
  }
}

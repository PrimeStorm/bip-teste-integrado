package com.example.ejb;

import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional; 
import java.math.BigDecimal;
import org.springframework.stereotype.Service;

@Stateless
@Service //Faz o Spring gerenciar essa classe
public class BeneficioEjbService {

    @PersistenceContext
    private EntityManager em;

    /**
     * Realiza transferência com validações de regra de negócio e controle de concorrência.
     */
    @Transactional
    public void transfer(Long fromId, Long toId, BigDecimal amount) throws Exception {
        // 1. Validações básicas
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor da transferência deve ser positivo.");
        }
        if (fromId.equals(toId)) {
            throw new IllegalArgumentException("Conta de origem e destino não podem ser iguais.");
        }

        // 2. Busca as contas (O JPA vai carregar a versão atual aqui)
        Beneficio from = em.find(Beneficio.class, fromId);
        Beneficio to   = em.find(Beneficio.class, toId);

        if (from == null || to == null) {
            throw new IllegalArgumentException("Conta de origem ou destino não encontrada.");
        }

        // 3. Verifica saldo (Correção do Bug de Saldo Negativo)
        if (from.getValor().compareTo(amount) < 0) {
            throw new IllegalArgumentException("Saldo insuficiente para realizar a transferência.");
        }

        // 4. Realiza a operação
        from.setValor(from.getValor().subtract(amount));
        to.setValor(to.getValor().add(amount));

        // 5. Persiste (Aqui o @Version vai atuar automaticamente contra Lost Updates)
        em.merge(from);
        em.merge(to);
    }
}

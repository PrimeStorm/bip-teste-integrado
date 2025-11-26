package com.example.backend;

import com.example.ejb.Beneficio;
import com.example.ejb.BeneficioEjbService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@SpringBootTest
public class BeneficioIntegrationTest {

    @Autowired
    private BeneficioRepository repository;

    @Autowired
    private BeneficioEjbService ejbService;

    @Autowired
    private BeneficioController controller; 

    @Test
    void deveListarBeneficiosDoSeed() {
        // Verifica se o seed.sql rodou e criou os registros iniciais
        List<Beneficio> lista = repository.findAll();
        Assertions.assertTrue(lista.size() >= 2); // Garante que tem pelo menos os 2 do seed
    }

    @Test
    @Transactional
    void deveRealizarTransferenciaComSucesso() throws Exception {
        // Cenário: Transfere 100 de A (ID 1) para B (ID 2)
        // Nota: Usamos IDs fixos do seed.sql
        ejbService.transfer(1L, 2L, new BigDecimal("100.00"));

        Beneficio contaA = repository.findById(1L).get();
        Beneficio contaB = repository.findById(2L).get();

        // Valores originais: A=1000, B=500
        // Esperado: A=900, B=600
        Assertions.assertEquals(0, contaA.getValor().compareTo(new BigDecimal("900.00")));
        Assertions.assertEquals(0, contaB.getValor().compareTo(new BigDecimal("600.00")));
    }

    @Test
    void naoDeveTransferirSeSaldoInsuficiente() {
        Exception exception = Assertions.assertThrows(Exception.class, () -> {
            ejbService.transfer(1L, 2L, new BigDecimal("99999.00"));
        });
        Assertions.assertTrue(exception.getMessage().contains("Saldo insuficiente"));
    }

    @Test
    void naoDeveAceitarValorNegativo() {
        Exception exception = Assertions.assertThrows(Exception.class, () -> {
            ejbService.transfer(1L, 2L, new BigDecimal("-10.00"));
        });
        Assertions.assertTrue(exception.getMessage().contains("positivo"));
    }

    // --- TESTES DO CRUD ---

   @Test
   @Transactional
    void deveCriarBeneficio() {
        Beneficio novo = new Beneficio();
        novo.setNome("Teste Criação");
        novo.setValor(new BigDecimal("150.00"));
        
        // [NOVO] Testando se a descrição é salva
        novo.setDescricao("Descrição do Teste Automatizado");

        // Chama o controller para criar
        Beneficio criado = controller.create(novo);

        // Verifica se salvou no banco e gerou ID
        Assertions.assertNotNull(criado.getId());
        Assertions.assertEquals("Teste Criação", criado.getNome());
        
        // [NOVO] Valida se a descrição voltou correta
        Assertions.assertEquals("Descrição do Teste Automatizado", criado.getDescricao());
        
        // Confirma no repositório
        Assertions.assertTrue(repository.existsById(criado.getId()));
    }

    @Test
    @Transactional
    void deveDeletarBeneficio() {
        // 1. Cria um beneficio temporário para deletar
        Beneficio temp = new Beneficio();
        temp.setNome("Para Deletar");
        temp.setValor(BigDecimal.TEN);
        temp.setAtivo(true);
        Beneficio salvo = repository.save(temp);
        Long idParaDeletar = salvo.getId();

        // 2. Chama o controller para deletar
        ResponseEntity<?> resposta = controller.delete(idParaDeletar);

        // 3. Verifica se o status é 200 OK
        Assertions.assertEquals(200, resposta.getStatusCode().value());

        // 4. Verifica se sumiu do banco
        Assertions.assertFalse(repository.existsById(idParaDeletar));
    }
}
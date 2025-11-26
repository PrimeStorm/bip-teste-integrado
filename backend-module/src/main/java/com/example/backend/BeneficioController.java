package com.example.backend;

import com.example.ejb.Beneficio;
import com.example.ejb.BeneficioEjbService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/beneficios")
@CrossOrigin(origins = "http://localhost:4200")
@Tag(name = "Benefícios", description = "Gerenciamento de contas e transferências") // Título no Swagger
public class BeneficioController {

    @Autowired
    private BeneficioRepository repository;

    @Autowired
    private BeneficioEjbService ejbService;

    @Operation(summary = "Listar todas as contas", description = "Retorna a lista completa de benefícios com saldo atualizado.")
    @GetMapping
    public List<Beneficio> list() {
        return repository.findAll();
    }

    @Operation(summary = "Criar nova conta", description = "Cria um novo benefício com saldo inicial.")
    @PostMapping
    public Beneficio create(@RequestBody Beneficio beneficio) {
        beneficio.setAtivo(true);
        beneficio.setId(null);
        return repository.save(beneficio);
    }

    @Operation(summary = "Realizar Transferência", description = "Transfere valores entre contas com validação de saldo e concorrência (Optimistic Locking).")
    @ApiResponse(responseCode = "200", description = "Transferência realizada com sucesso")
    @ApiResponse(responseCode = "400", description = "Erro de negócio (Saldo insuficiente, conta inválida)")
    @PostMapping("/transfer")
    public ResponseEntity<?> transfer(@RequestBody TransferenciaDTO dto) {
        try {
            ejbService.transfer(dto.fromId(), dto.toId(), dto.amount());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Remover conta", description = "Exclui um benefício do sistema pelo ID.")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    public record TransferenciaDTO(Long fromId, Long toId, BigDecimal amount) {}
}


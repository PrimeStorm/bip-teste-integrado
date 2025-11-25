package com.example.backend;

import com.example.ejb.Beneficio;
import com.example.ejb.BeneficioEjbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.math.BigDecimal;


@RestController
@RequestMapping("/api/v1/beneficios")
@CrossOrigin(origins = "*") // Permite que o Angular acesse sem bloqueio
public class BeneficioController {

    @Autowired
    private BeneficioRepository repository; // Para leitura (CRUD)

    @Autowired
    private BeneficioEjbService ejbService; // Para regra de negócio (Transferência)

    // 1. Listar todos (GET)
    @GetMapping
    public List<Beneficio> list() {
        return repository.findAll();
    }

    // 2. Realizar Transferência (POST)
    @PostMapping("/transfer")
    public ResponseEntity<?> transfer(@RequestBody TransferenciaDTO dto) {
        try {
            ejbService.transfer(dto.fromId(), dto.toId(), dto.amount());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            // Retorna erro 400 se saldo for insuficiente ou contas inválidas
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // DTO auxiliar para receber o JSON
    public record TransferenciaDTO(Long fromId, Long toId, BigDecimal amount) {}
}


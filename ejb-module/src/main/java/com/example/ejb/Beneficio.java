package com.example.ejb;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "BENEFICIO")
public class Beneficio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    private String descricao;

    @Column(nullable = false)
    private BigDecimal valor;

    private Boolean ativo;

    // --- O SEGREDO DA SEGURANÇA ---
    //A anotação @Version diz ao Hibernate: "Toda vez que For salvar essa conta, verifique se o número da versão no banco é igual ao que eu tenho aqui na memória. Se mudou, cancele tudo porque alguém mexeu antes de mim." Isso resolve o problema de Lost Update.
    @Version
    private Long version;
    // ------------------------------

    // Construtores
    public Beneficio() {}

    // Getters e Setters
    public Long getId() {
         return id;
    }
    public void setId(Long id) {
         this.id = id; 
    }

    public String getNome() {
         return nome;
    }
    public void setNome(String nome) {
         this.nome = nome; 
    }

    public BigDecimal getValor() {
         return valor;
    }
    public void setValor(BigDecimal valor) {
         this.valor = valor;
    }

    public Long getVersion() {
         return version; 
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }
    
    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
}

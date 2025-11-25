package com.example.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {"com.example.backend", "com.example.ejb"})
@EntityScan(basePackages = {"com.example.ejb"}) // Ensina o JPA a achar a entidade Beneficio no outro módulo
@EnableJpaRepositories(basePackages = {"com.example.backend"}) 
public class BackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }
}

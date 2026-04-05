package io.github.aj316.crimelog.backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class PersonSchemaMigrationConfig {

    @Bean
    CommandLineRunner relaxPersonSecondaryContactConstraint(JdbcTemplate jdbcTemplate) {
        return args -> {
            jdbcTemplate.execute("ALTER TABLE person MODIFY contact_secondary VARCHAR(15) NULL");
        };
    }
}
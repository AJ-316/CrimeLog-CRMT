package io.github.aj316.crimelog.backend.repository;

import io.github.aj316.crimelog.backend.model.Alert;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findByActiveTrueOrderByCreatedAtDesc();
}

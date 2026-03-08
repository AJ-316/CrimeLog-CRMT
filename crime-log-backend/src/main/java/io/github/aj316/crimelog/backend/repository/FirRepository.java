package io.github.aj316.crimelog.backend.repository;

import io.github.aj316.crimelog.backend.model.cases.FIR;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FirRepository extends JpaRepository<FIR, Long> {
}

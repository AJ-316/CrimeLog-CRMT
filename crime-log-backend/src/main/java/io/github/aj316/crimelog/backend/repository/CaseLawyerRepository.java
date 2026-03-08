package io.github.aj316.crimelog.backend.repository;

import io.github.aj316.crimelog.backend.model.cases.CaseLawyer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CaseLawyerRepository extends JpaRepository<CaseLawyer, Long> {
}
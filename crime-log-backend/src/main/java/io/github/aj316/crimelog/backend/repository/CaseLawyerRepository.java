package io.github.aj316.crimelog.backend.repository;

import io.github.aj316.crimelog.backend.model.cases.CaseLawyer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CaseLawyerRepository extends JpaRepository<CaseLawyer, Long> {
    List<CaseLawyer> findByLawyer_UserId(Long userId);
}
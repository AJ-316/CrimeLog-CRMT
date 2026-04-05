package io.github.aj316.crimelog.backend.repository;

import io.github.aj316.crimelog.backend.model.institutes.Court;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourtRepository extends JpaRepository<Court, Long> {
    List<Court> findAllByOrderByCourtNameAsc();
}
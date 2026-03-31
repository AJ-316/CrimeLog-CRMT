package io.github.aj316.crimelog.backend.repository;

import io.github.aj316.crimelog.backend.model.institutes.Agency;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AgencyRepository extends JpaRepository<Agency, Long> {
    List<Agency> findAllByOrderByNameAsc();
    Optional<Agency> findByName(String name);
}

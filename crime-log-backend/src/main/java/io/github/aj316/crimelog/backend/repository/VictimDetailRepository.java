package io.github.aj316.crimelog.backend.repository;

import io.github.aj316.crimelog.backend.model.cases.parties.VictimDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VictimDetailRepository extends JpaRepository<VictimDetail, Long> {
}

package io.github.aj316.crimelog.backend.repository;

import io.github.aj316.crimelog.backend.model.cases.parties.AccusedDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccusedDetailRepository extends JpaRepository<AccusedDetail, Long> {
}

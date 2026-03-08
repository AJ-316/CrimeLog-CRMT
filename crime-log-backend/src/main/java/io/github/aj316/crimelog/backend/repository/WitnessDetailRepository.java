package io.github.aj316.crimelog.backend.repository;

import io.github.aj316.crimelog.backend.model.cases.parties.WitnessDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WitnessDetailRepository extends JpaRepository<WitnessDetail, Long> {
}

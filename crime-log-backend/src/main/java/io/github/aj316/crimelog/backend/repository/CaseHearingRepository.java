package io.github.aj316.crimelog.backend.repository;

import io.github.aj316.crimelog.backend.model.cases.CaseHearing;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CaseHearingRepository extends JpaRepository<CaseHearing, Long> {
}

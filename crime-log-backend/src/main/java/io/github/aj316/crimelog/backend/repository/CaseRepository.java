package io.github.aj316.crimelog.backend.repository;

import io.github.aj316.crimelog.backend.dto.cases.BasicCaseDetailDto;
import io.github.aj316.crimelog.backend.model.cases.Case;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CaseRepository extends JpaRepository<Case, Long> {

    @Query("""
            SELECT new io.github.aj316.crimelog.backend.dto.cases.BasicCaseDetailDto(
                        c.caseNumber, c.stage, c.court, c.openedOn
            ) FROM Case c
            """)
    List<BasicCaseDetailDto> findAllBasic();

    List<Case> findAllByOrderByOpenedOnDesc();

    Optional<Case> findByFir_FirId(Long firId);

    boolean existsByFir_FirId(Long firId);
}

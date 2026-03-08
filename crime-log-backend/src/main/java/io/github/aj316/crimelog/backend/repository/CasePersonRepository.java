package io.github.aj316.crimelog.backend.repository;

import io.github.aj316.crimelog.backend.model.cases.parties.CasePerson;
import io.github.aj316.crimelog.backend.model.types.CasePersonType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CasePersonRepository extends JpaRepository<CasePerson, Long> {
    List<CasePerson> findByCaseEntity_CaseIdOrderByAddedOnDesc(Long caseId);

    boolean existsByCaseEntity_CaseIdAndPerson_PersonIdAndCasePersonType(Long caseId, Long personId, CasePersonType casePersonType);
}

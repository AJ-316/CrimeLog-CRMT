package io.github.aj316.crimelog.backend.repository;

import io.github.aj316.crimelog.backend.model.cases.parties.CasePerson;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CasePersonRepository extends JpaRepository<CasePerson, Long> {
}

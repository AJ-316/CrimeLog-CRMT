package io.github.aj316.crimelog.backend.repository;

import io.github.aj316.crimelog.backend.model.Person;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonRepository extends JpaRepository<Person, Long> {
    boolean existsByNationalId(String s);
}

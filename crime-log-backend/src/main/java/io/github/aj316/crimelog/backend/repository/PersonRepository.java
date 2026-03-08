package io.github.aj316.crimelog.backend.repository;

import io.github.aj316.crimelog.backend.model.people.Person;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PersonRepository extends JpaRepository<Person, Long> {
    boolean existsByNationalId(String s);

    List<Person> findAllByOrderByFirstNameAscLastNameAsc();
}

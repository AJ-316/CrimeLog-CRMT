package io.github.aj316.crimelog.backend.repository;

import io.github.aj316.crimelog.backend.model.institutes.DepartmentUnit;
import io.github.aj316.crimelog.backend.model.people.users.LawyerProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DepartmentUnitRepository extends JpaRepository<DepartmentUnit,Long> {

}

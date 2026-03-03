package io.github.aj316.crimelog.backend.repository;

import io.github.aj316.crimelog.backend.model.people.users.LawyerProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LawyerProfileRepository extends JpaRepository<LawyerProfile,Long> {
}

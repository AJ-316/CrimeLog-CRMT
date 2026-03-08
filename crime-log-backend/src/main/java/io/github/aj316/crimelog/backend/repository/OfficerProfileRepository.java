package io.github.aj316.crimelog.backend.repository;

import io.github.aj316.crimelog.backend.model.people.users.OfficerProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OfficerProfileRepository extends JpaRepository<OfficerProfile, Long> {
}

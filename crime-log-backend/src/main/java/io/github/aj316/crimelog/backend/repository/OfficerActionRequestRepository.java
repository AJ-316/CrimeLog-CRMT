package io.github.aj316.crimelog.backend.repository;

import io.github.aj316.crimelog.backend.model.requests.OfficerActionRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OfficerActionRequestRepository extends JpaRepository<OfficerActionRequest, Long> {
}

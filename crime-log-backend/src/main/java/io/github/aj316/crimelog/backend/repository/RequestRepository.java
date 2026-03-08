package io.github.aj316.crimelog.backend.repository;

import io.github.aj316.crimelog.backend.model.Request;
import io.github.aj316.crimelog.backend.model.types.Status;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RequestRepository extends JpaRepository<Request, Long> {
    List<Request> findByStatusOrderByCreatedAtDesc(Status status);

    List<Request> findByRequestedByUserIdOrderByCreatedAtDesc(Long requestedByUserId);
}

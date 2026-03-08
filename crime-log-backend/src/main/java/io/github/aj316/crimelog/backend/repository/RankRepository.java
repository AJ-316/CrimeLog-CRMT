package io.github.aj316.crimelog.backend.repository;

import io.github.aj316.crimelog.backend.model.people.users.Rank;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RankRepository extends JpaRepository<Rank, Long> {
}

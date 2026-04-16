package io.github.aj316.crimelog.backend.repository;


import io.github.aj316.crimelog.backend.model.people.users.User;
import io.github.aj316.crimelog.backend.model.types.Role;
import io.github.aj316.crimelog.backend.model.types.Status;
import jakarta.validation.constraints.Email;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(@Email String email);
    
    long countByRole(Role role);

    List<User> findByAccountStatusOrderByUserIdDesc(Status accountStatus);

    List<User> findAllByOrderByUserIdDesc();
}

package io.github.aj316.crimelog.backend.repository;

import io.github.aj316.crimelog.backend.model.cases.FIR;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FirRepository extends JpaRepository<FIR, Long> {
    List<FIR> findAllByOrderByRegistrationDateTimeDesc();
    
    Optional<FIR> findByFirNumber(String firNumber);
    
    List<FIR> findByFirNumberContainingIgnoreCase(String firNumber);
    
    List<FIR> findByAccusedFirstNameContainingIgnoreCaseOrAccusedLastNameContainingIgnoreCase(String firstName, String lastName);
}

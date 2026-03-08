package io.github.aj316.crimelog.backend.model.cases;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "case_hearings")
public class CaseHearing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long caseHearingId;

    @ManyToOne
    @JoinColumn(name = "case_id", nullable = false)
    private Case attachedCase;

    @Column(nullable = false)
    private LocalDate hearingDate;

    @Column(nullable = false)
    private LocalDate nextDate;

    @Column(nullable = false, length = 255)
    private String proceedingSummary;

    @Column(nullable = false, length = 255)
    private String ordersPassed;

    @CreationTimestamp
    private LocalDateTime createdDateTime;
}
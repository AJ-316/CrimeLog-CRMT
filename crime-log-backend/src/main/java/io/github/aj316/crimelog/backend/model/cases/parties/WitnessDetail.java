package io.github.aj316.crimelog.backend.model.cases.parties;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "witness_details")
public class WitnessDetail {

    @Id
    private Long casePersonId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "case_person_id")
    private CasePerson casePerson;

    @Column(nullable = false)
    private String statementSummary;

    @Column(nullable = false)
    private LocalDate statementRecordedOn;

    @Column(nullable = false)
    private Boolean isProtected;
}

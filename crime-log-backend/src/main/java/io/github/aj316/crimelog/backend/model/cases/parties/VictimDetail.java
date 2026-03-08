package io.github.aj316.crimelog.backend.model.cases.parties;

import io.github.aj316.crimelog.backend.model.types.InjurySeverity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "victim_details")
public class VictimDetail {

    @Id
    private Long casePersonId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "case_person_id")
    private CasePerson casePerson;

    @Column(nullable = false)
    private InjurySeverity injurySeverity;

    @Column(nullable = false)
    private Boolean medicalAttentionRequired;

    @Column(nullable = false)
    private LocalDate statementRecordedOn;
}

package io.github.aj316.crimelog.backend.model.cases.parties;

import io.github.aj316.crimelog.backend.model.cases.Case;
import io.github.aj316.crimelog.backend.model.people.Person;
import io.github.aj316.crimelog.backend.model.types.CasePersonType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "case_persons")
public class CasePerson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long casePersonId;

    @ManyToOne
    @JoinColumn(name = "person_id")
    private Person person;

    @ManyToOne
    @JoinColumn(name = "case_id")
    private Case caseEntity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CasePersonType casePersonType;

    @CreationTimestamp
    private LocalDate addedOn;
}

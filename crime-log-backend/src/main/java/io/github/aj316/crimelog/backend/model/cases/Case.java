package io.github.aj316.crimelog.backend.model.cases;

import io.github.aj316.crimelog.backend.model.FIR;
import io.github.aj316.crimelog.backend.model.institutes.Court;
import io.github.aj316.crimelog.backend.model.institutes.DepartmentUnit;
import io.github.aj316.crimelog.backend.model.types.CaseStage;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "cases")
public class Case {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long caseId;

    @Column(nullable = false, unique = true)
    private String caseNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CaseStage stage = CaseStage.INVESTIGATION;

    @ManyToOne
    @JoinColumn(name = "court_id")
    private Court court;

    @OneToOne
    @JoinColumn(name = "fir_id", nullable = false)
    private FIR fir;

    @ManyToOne
    @JoinColumn(name = "current_investigating_unit_id")
    private DepartmentUnit currentInvestigatingUnit;

    @CreationTimestamp
    private LocalDate openedOn;

    private LocalDate closedOn;
}
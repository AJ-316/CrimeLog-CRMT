package io.github.aj316.crimelog.backend.model.cases.parties;

import io.github.aj316.crimelog.backend.model.types.ArrestStatus;
import io.github.aj316.crimelog.backend.model.types.BailStatus;
import io.github.aj316.crimelog.backend.model.types.CustodyStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "accused_details")
public class AccusedDetail {

    @Id
    private Long casePersonId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "case_person_id")
    private CasePerson casePerson;

    @Column(nullable = false)
    private ArrestStatus arrestStatus = ArrestStatus.NOT_ARRESTED;

    @Column(nullable = false)
    private BailStatus bailStatus;

    @Column(nullable = false)
    private CustodyStatus custodyStatus = CustodyStatus.NONE;
}

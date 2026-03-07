package io.github.aj316.crimelog.backend.model.people.users;

import io.github.aj316.crimelog.backend.model.institutes.DepartmentUnit;
import io.github.aj316.crimelog.backend.model.types.ActiveStatus;
import io.github.aj316.crimelog.backend.model.types.UnitRole;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "officer_profiles")
public class OfficerProfile {

    @Id
    private Long userId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false, length = 20)
    private String badgeNumber;

    /* Scope gets too complicated with ranks
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rank_id", nullable = false)
    private Rank rank;*/

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UnitRole role = UnitRole.UNIT_OFFICER; // Officer will maintain app and make requests, Head will approve requests and manage unit

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "current_posting_unit_id", nullable = false)
    private DepartmentUnit currentPostingUnit;

    @Column(nullable = false)
    private LocalDate joiningDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 15)
    private ActiveStatus activeStatus = ActiveStatus.ACTIVE;
}
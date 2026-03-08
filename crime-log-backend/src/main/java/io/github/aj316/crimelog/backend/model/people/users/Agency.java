package io.github.aj316.crimelog.backend.model.people.users;

import io.github.aj316.crimelog.backend.model.types.AgencyType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name="agencies")
public class Agency {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long agencyId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_agency_id")
    private Agency parentAgency;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AgencyType agencyType;

    @Column(nullable = false, unique = true, length = 100)
    private String name; // eg (CITY - "Thane City Police"), (STATE - "Maharashtra Police"), (CENTRAL - "CBI")
}

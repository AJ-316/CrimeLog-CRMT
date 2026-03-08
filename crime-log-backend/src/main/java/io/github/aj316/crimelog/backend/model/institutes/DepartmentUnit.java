package io.github.aj316.crimelog.backend.model.institutes;

import io.github.aj316.crimelog.backend.model.Address;
import io.github.aj316.crimelog.backend.model.types.UnitType;
import io.github.aj316.crimelog.backend.validation.ValidAddressIfPhysical;
import io.github.aj316.crimelog.backend.validation.ValidUnitCode;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "department_units")
@ValidAddressIfPhysical
public class DepartmentUnit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ValidUnitCode
    @Column(nullable = false, unique = true)
    private String unitCode;

    @ManyToOne(optional = false)
    @JoinColumn(name = "agency_id", nullable = false)
    private Agency agency;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UnitType unitType;

    @Column(nullable = false, length = 150)
    private String name;

    @Embedded
    @Valid
    private Address address;
}

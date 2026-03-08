package io.github.aj316.crimelog.backend.model;

import io.github.aj316.crimelog.backend.model.institutes.DepartmentUnit;
import io.github.aj316.crimelog.backend.model.people.Person;
import io.github.aj316.crimelog.backend.model.people.users.OfficerProfile;
import io.github.aj316.crimelog.backend.model.types.FIR_Type;
import io.github.aj316.crimelog.backend.model.types.UnitType;
import io.github.aj316.crimelog.backend.validation.ValidFirRegisterDepartmentUnit;
import io.github.aj316.crimelog.backend.validation.ValidOfficerDepartmentUnit;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name="fir")
public class FIR {

    /// FIR details
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long firId;

    @Column(unique = true, nullable = false)
    private String firNumber;

    @Column(nullable = false)
    private LocalDateTime registrationDateTime;

    @CreationTimestamp
    @Column(nullable = false)
    private LocalDateTime createdDateTime;
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    /// Accused details
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    @Column(length = 50)
    private String accusedFirstName;
    @Column(length = 50)
    private String accusedMiddleName;
    @Column(length = 50)
    private String accusedLastName;
    @Pattern(regexp = Person.INTERNATIONAL_NUMBER_REGEX)
    private String accusedContact;
    @Embedded
    @Valid
    @AttributeOverrides({
        @AttributeOverride(name = "street", column = @Column(name = "accused_street")),
        @AttributeOverride(name = "city", column = @Column(name = "accused_city")),
        @AttributeOverride(name = "state", column = @Column(name = "accused_state")),
        @AttributeOverride(name = "postalCode", column = @Column(name = "accused_postal_code")),
        @AttributeOverride(name = "countryCode", column = @Column(name = "accused_country"))
    })
    private Address accusedAddress;
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    /// Officer/Department details
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    @ManyToOne(optional = false)
    @JoinColumn(name = "origin_unit_id")
    @ValidFirRegisterDepartmentUnit
    private DepartmentUnit originUnit;

    @ManyToOne
    @JoinColumn(name = "initial_investigating_unit_id")
    private DepartmentUnit initialInvestigatingUnit;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FIR_Type firType = FIR_Type.REGULAR;

    @ManyToOne
    @JoinColumn(name = "created_by")
    @ValidOfficerDepartmentUnit(unitType = UnitType.POLICE_STATION)
    private OfficerProfile createdBy;
    // private boolean is_locked; // This can be derived from whether an investigating unit is assigned or not, so we can omit this field and just check if investigatingUnit is null or not to determine if the FIR is locked.
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    /// Incident details
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // need nature of offense - theft, assault, fraud, cybercrime, etc.

    @Embedded
    @Valid
    @AttributeOverrides({
        @AttributeOverride(name = "street", column = @Column(name = "incident_street")),
        @AttributeOverride(name = "city", column = @Column(name = "incident_city")),
        @AttributeOverride(name = "state", column = @Column(name = "incident_state")),
        @AttributeOverride(name = "postalCode", column = @Column(name = "incident_postal_code")),
        @AttributeOverride(name = "countryCode", column = @Column(name = "incident_country"))
    })
    private Address incidentPlace;

    private LocalDateTime incidentDateTime;

    @Column(length = 1000)
    private String incidentDescription;
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}
package io.github.aj316.crimelog.backend.model.people.users;

import io.github.aj316.crimelog.backend.model.Address;
import io.github.aj316.crimelog.backend.model.people.Person;
import io.github.aj316.crimelog.backend.model.types.LawyerSpecialization;
import io.github.aj316.crimelog.backend.model.types.LicenseStatus;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "lawyer_profiles")
public class LawyerProfile {

    @Id
    private Long userId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false, unique = true, length = 20)
    private Long barCouncilId;

    @Column(nullable = false, unique = true, length = 20)
    private String barRegistrationNumber;

    @Column(nullable = false)
    private LocalDate enrollmentDate;

    @Column(nullable = false)
    private Integer yearsOfExperience;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LawyerSpecialization specialization;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LicenseStatus licenseStatus;

    @Column(nullable = false, length = 100)
    private String firmName;

    @Embedded
    @Valid
    @AttributeOverrides({
            @AttributeOverride(name = "street", column = @Column(name = "office_street")),
            @AttributeOverride(name = "city", column = @Column(name = "office_city")),
            @AttributeOverride(name = "state", column = @Column(name = "office_state")),
            @AttributeOverride(name = "postalCode", column = @Column(name = "office_postal_code")),
            @AttributeOverride(name = "countryCode", column = @Column(name = "office_country_code"))
    })
    private Address officeAddress;

    @Pattern(regexp = Person.INTERNATIONAL_NUMBER_REGEX)
    @Column(length = 15, nullable = false)
    private String officialContact;

    @Column(nullable = false)
    private Boolean isPublicDefender;
}
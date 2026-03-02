package io.github.aj316.crimelog.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
@Entity
public class Person {

    public static final String INTERNATIONAL_NUMBER_REGEX = "^\\+?[1-9]\\d{1,14}$";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long personId;

    @Column(length = 30, unique = true, nullable = false)
    private String nationalId;

    @Column(length = 50, nullable = false)
    private String firstName;

    @Column(length = 50)
    private String middleName;

    @Column(length = 50, nullable = false)
    private String lastName;

    @Column(length = 255, nullable = false)
    private String profilePhotoPath = "images/profiles/default-profile.png";

    @Column(nullable = false)
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Gender gender;

    @Column(nullable = false, length = 2)
    private String nationalityCode; // ISO 3166-1 alpha-2 country code

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "street",         column = @Column(name = "birth_street")),
            @AttributeOverride(name = "city",           column = @Column(name = "birth_city")),
            @AttributeOverride(name = "state",          column = @Column(name = "birth_state")),
            @AttributeOverride(name = "postalCode",     column = @Column(name = "birth_postal_code")),
            @AttributeOverride(name = "countryCode",    column = @Column(name = "birth_country_code"))
    })
    private Address birthPlace;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "street",         column = @Column(name = "permanent_address_street")),
            @AttributeOverride(name = "city",           column = @Column(name = "permanent_address_city")),
            @AttributeOverride(name = "state",          column = @Column(name = "permanent_address_state")),
            @AttributeOverride(name = "postalCode",     column = @Column(name = "permanent_address_postal_code")),
            @AttributeOverride(name = "countryCode",    column = @Column(name = "permanent_address_country_code"))
    })
    private Address permanentAddress;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "street",         column = @Column(name = "current_address_street")),
            @AttributeOverride(name = "city",           column = @Column(name = "current_address_city")),
            @AttributeOverride(name = "state",          column = @Column(name = "current_address_state")),
            @AttributeOverride(name = "postalCode",     column = @Column(name = "current_address_postal_code")),
            @AttributeOverride(name = "countryCode",    column = @Column(name = "current_address_country_code"))
    })
    private Address currentAddress;

    @Pattern(regexp = INTERNATIONAL_NUMBER_REGEX)
    @Column(length = 15, nullable = false)
    private String contactPrimary;

    @Pattern(regexp = INTERNATIONAL_NUMBER_REGEX)
    @Column(length = 15, nullable = false)
    private String contactSecondary;
}

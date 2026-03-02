package io.github.aj316.crimelog.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Embeddable
@Valid
public class Address {

    @NotBlank
    @Column(nullable = false)
    private String street;

    @NotBlank
    @Column(nullable = false)
    private String city;

    @NotBlank
    @Column(nullable = false)
    private String state;

    @NotBlank
    @Column(nullable = false)
    private String postalCode;

    @Pattern(regexp = "^[A-Z]{2}$")
    @Column(nullable = false, length = 2)
    private String countryCode; // ISO 3166-1 alpha-2 country code
}
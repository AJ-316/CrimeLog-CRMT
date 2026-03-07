package io.github.aj316.crimelog.backend.dto.auth;

import io.github.aj316.crimelog.backend.dto.AddressDto;
import io.github.aj316.crimelog.backend.dto.PersonDto;
import io.github.aj316.crimelog.backend.model.types.LawyerSpecialization;
import io.github.aj316.crimelog.backend.model.types.LicenseStatus;
import io.github.aj316.crimelog.backend.model.types.Role;

import java.time.LocalDate;

public record RegisterLawyerRequest(
        String email,
        String password,
        Role role,
        PersonDto personDto,

        Long barCouncilId,
        String barRegistrationNumber,
        LocalDate enrollmentDate,
        Integer yearsOfExperience,
        LawyerSpecialization specialization,
        LicenseStatus licenseStatus,
        String firmName,
        AddressDto officeAddress,
        String officialContact,
        Boolean isPublicDefender
) implements RegisterRequestDto {
}
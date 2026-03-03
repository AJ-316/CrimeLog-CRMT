package io.github.aj316.crimelog.backend.dto;

import io.github.aj316.crimelog.backend.model.types.ActiveStatus;
import io.github.aj316.crimelog.backend.model.types.Role;

import java.time.LocalDate;

public record RegisterOfficerRequest(
        String email,
        String password,
        Role role,
        PersonDto personDto,

        String badgeNumber,
        Long rankId,
        Long agencyId,
        Long departmentUnitId,
        LocalDate joiningDate,
        ActiveStatus activeStatus
) implements RegisterRequestDto {
}
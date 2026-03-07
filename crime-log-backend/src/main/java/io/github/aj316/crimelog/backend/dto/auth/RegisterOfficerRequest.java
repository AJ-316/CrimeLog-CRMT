package io.github.aj316.crimelog.backend.dto.auth;

import io.github.aj316.crimelog.backend.dto.PersonDto;
import io.github.aj316.crimelog.backend.model.types.ActiveStatus;
import io.github.aj316.crimelog.backend.model.types.Role;

import java.time.LocalDate;

public record RegisterOfficerRequest(
        String email,
        String password,
        Role role,
        PersonDto personDto,

        String badgeNumber,
        Long departmentUnitId,
        LocalDate joiningDate,
        ActiveStatus activeStatus
) implements RegisterRequestDto {
}
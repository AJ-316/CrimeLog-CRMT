package io.github.aj316.crimelog.backend.dto;

import io.github.aj316.crimelog.backend.model.institutes.DepartmentUnit;
import io.github.aj316.crimelog.backend.model.people.users.OfficerProfile;
import io.github.aj316.crimelog.backend.model.types.ActiveStatus;
import io.github.aj316.crimelog.backend.model.types.UnitRole;
import io.github.aj316.crimelog.backend.model.types.UnitType;

import java.time.LocalDate;

public record OfficerProfileDto(
        String badgeNumber,
        UnitRole role,
        Long agencyId,
        Long departmentUnitId,
        String unitCode,
        UnitType unitType,
        String departmentUnitName,
        LocalDate joiningDate,
        ActiveStatus activeStatus
) {

    public static OfficerProfileDto mapToDto(OfficerProfile profile) {
        return new OfficerProfileDto(
                profile.getBadgeNumber(),
                profile.getRole(),
                profile.getCurrentPostingUnit().getAgency().getAgencyId(),
                profile.getCurrentPostingUnit().getId(),
                profile.getCurrentPostingUnit().getUnitCode(),
                profile.getCurrentPostingUnit().getUnitType(),
                profile.getCurrentPostingUnit().getName(),
                profile.getJoiningDate(),
                profile.getActiveStatus()
        );
    }
}

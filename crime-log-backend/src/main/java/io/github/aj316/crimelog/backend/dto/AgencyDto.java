package io.github.aj316.crimelog.backend.dto;

import io.github.aj316.crimelog.backend.model.people.users.Agency;
import io.github.aj316.crimelog.backend.model.types.AgencyType;

public record AgencyDto(
        Long parentAgencyId,
        AgencyType agencyType,
        String name
) implements MapDto<Agency> {

    @Override
    public Agency mapToEntity() {
        Agency agency = new Agency();
        agency.setAgencyType(agencyType);
        agency.setName(name);
        return agency;
    }

    public static AgencyDto mapToDto(Agency agency) {
        if (agency == null) return null;
        return new AgencyDto(
                agency.getParentAgency() != null ? agency.getParentAgency().getAgencyId() : null,
                agency.getAgencyType(),
                agency.getName()
        );
    }
}

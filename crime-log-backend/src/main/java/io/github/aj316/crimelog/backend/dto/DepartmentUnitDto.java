package io.github.aj316.crimelog.backend.dto;

import io.github.aj316.crimelog.backend.model.institutes.DepartmentUnit;
import io.github.aj316.crimelog.backend.model.types.UnitType;

public record DepartmentUnitDto(
        String unitCode,
        AgencyDto agencyDto,
        UnitType unitType,
        String name,
        AddressDto addressDto
) implements MapDto<DepartmentUnit> {

    @Override
    public DepartmentUnit mapToEntity() {
        DepartmentUnit departmentUnit = new DepartmentUnit();
        departmentUnit.setUnitCode(unitCode);
        departmentUnit.setAgency(agencyDto.mapToEntity());
        departmentUnit.setUnitType(unitType);
        departmentUnit.setName(name);
        departmentUnit.setAddress(addressDto.mapToEntity());

        return departmentUnit;
    }
}

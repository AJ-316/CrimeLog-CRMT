package io.github.aj316.crimelog.backend.dto;

import io.github.aj316.crimelog.backend.model.institutes.DepartmentUnit;
import io.github.aj316.crimelog.backend.model.types.UnitType;

public record DepartmentUnitDto(
        String unitCode, // generate in backend using unitType, agencyCode, and a provided sequence number
        Long agencyId,
        UnitType unitType,
        String name,
        AddressDto addressDto
) implements MapDto<DepartmentUnit> {

    @Override
    public DepartmentUnit mapToEntity() {
        DepartmentUnit departmentUnit = new DepartmentUnit();
        departmentUnit.setUnitCode(unitCode);
        departmentUnit.setUnitType(unitType);
        departmentUnit.setName(name);
        departmentUnit.setAddress(addressDto.mapToEntity());

        return departmentUnit;
    }
}

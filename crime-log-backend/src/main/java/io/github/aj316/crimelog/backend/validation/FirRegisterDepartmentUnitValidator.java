package io.github.aj316.crimelog.backend.validation;

import io.github.aj316.crimelog.backend.model.institutes.DepartmentUnit;
import io.github.aj316.crimelog.backend.model.types.UnitType;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class FirRegisterDepartmentUnitValidator implements ConstraintValidator<ValidFirRegisterDepartmentUnit, DepartmentUnit> {

    @Override
    public boolean isValid(DepartmentUnit value, ConstraintValidatorContext context) {
        if (value == null)
            return false;

        return value.getUnitType() == UnitType.POLICE_STATION;
    }
}
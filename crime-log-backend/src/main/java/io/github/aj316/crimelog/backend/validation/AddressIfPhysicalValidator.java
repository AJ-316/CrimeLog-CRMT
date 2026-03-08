package io.github.aj316.crimelog.backend.validation;

import io.github.aj316.crimelog.backend.model.institutes.DepartmentUnit;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class AddressIfPhysicalValidator implements ConstraintValidator<ValidAddressIfPhysical, DepartmentUnit> {

    @Override
    public void initialize(ValidAddressIfPhysical constraintAnnotation) {
    }

    @Override
    public boolean isValid(DepartmentUnit departmentUnit, ConstraintValidatorContext context) {
        if (departmentUnit == null) {
            return true;
        }

        if (departmentUnit.getUnitType().isPhysicalLocation()) {
            return departmentUnit.getAddress() != null;
        }

        return true;
    }
}
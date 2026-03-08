package io.github.aj316.crimelog.backend.validation;

import io.github.aj316.crimelog.backend.model.people.users.OfficerProfile;
import io.github.aj316.crimelog.backend.model.types.UnitType;
import jakarta.validation.ConstraintValidator;

public class OfficerDepartmentUnitValidator implements ConstraintValidator<ValidOfficerDepartmentUnit, OfficerProfile> {

    private UnitType unitType;

    @Override
    public void initialize(ValidOfficerDepartmentUnit constraintAnnotation) {
        this.unitType = constraintAnnotation.unitType();
    }

    @Override
    public boolean isValid(OfficerProfile officerProfile, jakarta.validation.ConstraintValidatorContext context) {
        if (officerProfile == null || officerProfile.getCurrentPostingUnit() == null) {
            return true;
        }
        return officerProfile.getCurrentPostingUnit().getUnitType() == unitType;
    }
}

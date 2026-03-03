package io.github.aj316.crimelog.backend.validation;

import io.github.aj316.crimelog.backend.model.types.UnitType;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class UnitCodeValidator implements ConstraintValidator<ValidUnitCode, String> {

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) return false;

        String[] parts = value.split("-");

        if (parts.length != 3)
            return false;

        if (!parts[0].matches("[A-Z]{2,5}"))
            return false;

        if(!UnitType.isValidCode(parts[1]))
            return false;

        return parts[2].matches("\\d{2,4}");
    }
}
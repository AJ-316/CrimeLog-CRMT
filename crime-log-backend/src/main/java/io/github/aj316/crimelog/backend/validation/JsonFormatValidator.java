package io.github.aj316.crimelog.backend.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;

public class JsonFormatValidator implements ConstraintValidator<ValidJsonFormat, String> {

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isEmpty()) {
            return true;
        }

        try {
            new ObjectMapper().readTree(value);
            return true;
        } catch (JacksonException e) {
            return false;
        }
    }
}
package io.github.aj316.crimelog.backend.validation;

import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

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
package io.github.aj316.crimelog.backend.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = JsonFormatValidator.class)
public @interface ValidJsonFormat {

    String message() default "Invalid Json format";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

}
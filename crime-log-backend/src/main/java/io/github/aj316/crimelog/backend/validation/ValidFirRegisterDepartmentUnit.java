package io.github.aj316.crimelog.backend.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = FirRegisterDepartmentUnitValidator.class)
public @interface ValidFirRegisterDepartmentUnit {

    String message() default "FIR can only be registered at a police station";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};

}
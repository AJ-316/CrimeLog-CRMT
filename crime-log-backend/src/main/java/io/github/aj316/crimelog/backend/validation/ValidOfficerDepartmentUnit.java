package io.github.aj316.crimelog.backend.validation;

import io.github.aj316.crimelog.backend.model.types.UnitType;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = OfficerDepartmentUnitValidator.class)
public @interface ValidOfficerDepartmentUnit {

    String message() default "Officer's department UnitType mismatches required UnitType";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    UnitType unitType() default UnitType.POLICE_STATION;
}
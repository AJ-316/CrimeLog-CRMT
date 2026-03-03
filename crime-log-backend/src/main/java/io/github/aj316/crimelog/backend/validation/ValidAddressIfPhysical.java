package io.github.aj316.crimelog.backend.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = AddressIfPhysicalValidator.class)
public @interface ValidAddressIfPhysical {
    String message() default "Address is required when isPhysicalLocation is true";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
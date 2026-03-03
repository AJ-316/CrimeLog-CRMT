package io.github.aj316.crimelog.backend.dto;

import io.github.aj316.crimelog.backend.model.types.Role;

public record RegisterUserRequest(
        String email,
        String password,
        Role role,
        PersonDto personDto
) implements RegisterRequestDto {
}
package io.github.aj316.crimelog.backend.dto;

import io.github.aj316.crimelog.backend.model.Role;

public record RegisterRequest(
        String email,
        String password,
        Role role,
        PersonDto personDto
) {
}
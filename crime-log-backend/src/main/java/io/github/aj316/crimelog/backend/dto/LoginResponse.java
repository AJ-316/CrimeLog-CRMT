package io.github.aj316.crimelog.backend.dto;

import io.github.aj316.crimelog.backend.model.types.Role;

public record LoginResponse(
        String token,
        Long userId,
        Role role
) {
}

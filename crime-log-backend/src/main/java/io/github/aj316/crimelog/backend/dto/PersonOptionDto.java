package io.github.aj316.crimelog.backend.dto;

public record PersonOptionDto(
        Long personId,
        String fullName,
        String nationalId
) {
}


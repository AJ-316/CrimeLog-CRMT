package io.github.aj316.crimelog.backend.dto;

import io.github.aj316.crimelog.backend.model.types.AgencyType;

public record AgencyOptionDto(
        Long id,
        String name,
        AgencyType agencyType
) {
}


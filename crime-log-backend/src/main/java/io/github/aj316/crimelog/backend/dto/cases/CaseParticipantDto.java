package io.github.aj316.crimelog.backend.dto.cases;

import io.github.aj316.crimelog.backend.model.types.CasePersonType;

import java.time.LocalDate;

public record CaseParticipantDto(
        Long casePersonId,
        Long personId,
        String fullName,
        CasePersonType casePersonType,
        String contactPrimary,
        LocalDate addedOn
) {
}


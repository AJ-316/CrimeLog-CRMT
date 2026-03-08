package io.github.aj316.crimelog.backend.dto.cases;

import io.github.aj316.crimelog.backend.model.types.CasePersonType;

public record CaseParticipantCreateRequest(
        Long personId,
        CasePersonType casePersonType
) {
}


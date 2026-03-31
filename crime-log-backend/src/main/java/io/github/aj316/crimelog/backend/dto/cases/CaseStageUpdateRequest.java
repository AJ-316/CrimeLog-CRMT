package io.github.aj316.crimelog.backend.dto.cases;

import io.github.aj316.crimelog.backend.model.types.CaseStage;

import java.time.LocalDate;

public record CaseStageUpdateRequest(
        CaseStage stage,
        LocalDate closedOn
) {
}

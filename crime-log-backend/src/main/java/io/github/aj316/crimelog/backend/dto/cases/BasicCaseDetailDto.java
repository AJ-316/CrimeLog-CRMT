package io.github.aj316.crimelog.backend.dto.cases;

import io.github.aj316.crimelog.backend.model.institutes.Court;
import io.github.aj316.crimelog.backend.model.types.CaseStage;

import java.time.LocalDate;

public record BasicCaseDetailDto(
    String caseNumber,
    CaseStage caseStage,
    Court court,
    LocalDate openedOn
) {
}

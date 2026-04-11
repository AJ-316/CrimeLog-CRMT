package io.github.aj316.crimelog.backend.dto;

import io.github.aj316.crimelog.backend.model.types.CasePersonType;
import io.github.aj316.crimelog.backend.model.types.CaseStage;

import java.time.LocalDate;

public record PersonCaseInvolvementDto(
        Long caseId,
        String caseNumber,
        CaseStage caseStage,
        CasePersonType involvementType,
        LocalDate openedOn,
        LocalDate closedOn,
        String investigatingUnitName,
        String firNumber,
        LocalDate linkedOn
) {
}

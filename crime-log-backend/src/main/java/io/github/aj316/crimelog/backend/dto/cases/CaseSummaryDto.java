package io.github.aj316.crimelog.backend.dto.cases;

import io.github.aj316.crimelog.backend.model.types.CaseStage;

import java.time.LocalDate;

public record CaseSummaryDto(
        Long caseId,
        String caseNumber,
        CaseStage caseStage,
        String courtName,
        LocalDate openedOn,
        LocalDate closedOn,
        String currentInvestigatingUnitName,
        Long firId,
        String firNumber
) {
}


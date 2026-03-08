package io.github.aj316.crimelog.backend.dto.cases;

import io.github.aj316.crimelog.backend.model.types.CaseStage;

import java.time.LocalDate;
import java.util.List;

public record CaseDetailDto(
        Long caseId,
        String caseNumber,
        CaseStage caseStage,
        String courtName,
        LocalDate openedOn,
        LocalDate closedOn,
        String currentInvestigatingUnitName,
        FirSummaryDto fir,
        List<CaseParticipantDto> participants
) {
}


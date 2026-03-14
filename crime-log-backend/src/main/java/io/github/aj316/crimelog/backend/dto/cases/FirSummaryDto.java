package io.github.aj316.crimelog.backend.dto.cases;

import io.github.aj316.crimelog.backend.model.types.FIR_Type;

import java.time.LocalDateTime;

public record FirSummaryDto(
        Long firId,
        String firNumber,
        FIR_Type firType,
        LocalDateTime registrationDateTime,
        String accusedName,
        String originUnitName,
        Long initialInvestigatingUnitId,
        String initialInvestigatingUnitName,
        LocalDateTime incidentDateTime,
        String incidentCity,
        Long caseId,
        String caseNumber
) {
}

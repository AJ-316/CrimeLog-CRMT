package io.github.aj316.crimelog.backend.dto.cases;

public record CreateCaseRequest(
        String caseNumber,
        Long firId,
        Long currentInvestigatingUnitId
) {
}


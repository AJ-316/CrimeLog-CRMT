package io.github.aj316.crimelog.backend.dto;

import java.util.List;

public record PersonCriminalHistoryDto(
        Long personId,
        String fullName,
        String nationalId,
        long totalInvolvements,
        long activeCases,
        long closedCases,
        List<PersonCaseInvolvementDto> involvements
) {
}

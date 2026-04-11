package io.github.aj316.crimelog.backend.dto.reports;

import io.github.aj316.crimelog.backend.model.types.CrimeReportStatus;

import java.time.LocalDateTime;

public record CrimeReportSummaryDto(
        Long reportId,
        String title,
        String location,
        CrimeReportStatus status,
        Long reporterUserId,
        String reporterName,
        LocalDateTime incidentDateTime,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        LocalDateTime acknowledgedAt,
        Boolean publicBroadcasted
) {
}

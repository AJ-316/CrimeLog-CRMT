package io.github.aj316.crimelog.backend.dto.reports;

import io.github.aj316.crimelog.backend.model.types.CrimeReportStatus;

import java.time.LocalDateTime;
import java.util.List;

public record CrimeReportDetailDto(
        Long reportId,
        String title,
        String description,
        String location,
        CrimeReportStatus status,
        Long reporterUserId,
        String reporterName,
        LocalDateTime incidentDateTime,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        LocalDateTime acknowledgedAt,
        String acknowledgedByName,
        Boolean publicBroadcasted,
        LocalDateTime publicBroadcastedAt,
        String publicBroadcastedByName,
        List<CrimeReportTimelineDto> timeline
) {
}

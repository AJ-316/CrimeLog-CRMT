package io.github.aj316.crimelog.backend.dto.reports;

import io.github.aj316.crimelog.backend.model.CrimeReportTimelineEntry;
import io.github.aj316.crimelog.backend.model.types.CrimeReportStatus;
import io.github.aj316.crimelog.backend.model.types.Role;

import java.time.LocalDateTime;

public record CrimeReportTimelineDto(
        CrimeReportStatus status,
        String note,
        Long changedByUserId,
        String changedByName,
        Role changedByRole,
        LocalDateTime createdAt
) {
    public static CrimeReportTimelineDto from(CrimeReportTimelineEntry entry, String changedByName) {
        return new CrimeReportTimelineDto(
                entry.getStatus(),
                entry.getNote(),
                entry.getChangedByUserId(),
                changedByName,
                entry.getChangedByRole(),
                entry.getCreatedAt()
        );
    }
}

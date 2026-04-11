package io.github.aj316.crimelog.backend.dto.reports;

import io.github.aj316.crimelog.backend.model.types.AlertSeverity;

public record BroadcastCrimeReportRequest(
        String message,
        AlertSeverity severity
) {
}

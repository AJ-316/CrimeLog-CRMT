package io.github.aj316.crimelog.backend.dto.alerts;

import io.github.aj316.crimelog.backend.model.Alert;
import io.github.aj316.crimelog.backend.model.types.AlertSeverity;
import io.github.aj316.crimelog.backend.model.types.Role;

import java.time.LocalDateTime;

public record AlertDto(
        Long alertId,
        String message,
        AlertSeverity severity,
        Boolean active,
        Long createdByUserId,
    Long sourceReportId,
        Role createdByRole,
        LocalDateTime createdAt
) {
    public static AlertDto from(Alert alert) {
        return new AlertDto(
                alert.getAlertId(),
                alert.getMessage(),
                alert.getSeverity(),
                alert.getActive(),
                alert.getCreatedByUserId(),
        alert.getSourceReportId(),
                alert.getCreatedByRole(),
                alert.getCreatedAt()
        );
    }
}

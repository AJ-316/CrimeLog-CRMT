package io.github.aj316.crimelog.backend.dto.alerts;

import io.github.aj316.crimelog.backend.model.types.AlertSeverity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateAlertRequest(
        @NotBlank(message = "Alert message is required")
        String message,

        @NotNull(message = "Alert severity is required")
        AlertSeverity severity
) {
}

package io.github.aj316.crimelog.backend.dto.reports;

import io.github.aj316.crimelog.backend.model.types.CrimeReportStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateCrimeReportStatusRequest(
        @NotNull(message = "Report status is required")
        CrimeReportStatus status,

        String note
) {
}

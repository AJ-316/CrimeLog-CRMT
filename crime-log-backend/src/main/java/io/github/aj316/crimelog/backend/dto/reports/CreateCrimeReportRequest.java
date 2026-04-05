package io.github.aj316.crimelog.backend.dto.reports;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public record CreateCrimeReportRequest(
        @NotBlank(message = "Report title is required")
        @Size(max = 200, message = "Report title must be at most 200 characters")
        String title,

        @NotBlank(message = "Report description is required")
        @Size(max = 4000, message = "Report description must be at most 4000 characters")
        String description,

        @NotBlank(message = "Incident location is required")
        @Size(max = 255, message = "Incident location must be at most 255 characters")
        String location,

        LocalDateTime incidentDateTime
) {
}

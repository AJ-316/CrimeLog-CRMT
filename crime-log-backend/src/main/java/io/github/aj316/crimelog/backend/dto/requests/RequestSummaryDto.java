package io.github.aj316.crimelog.backend.dto.requests;

import io.github.aj316.crimelog.backend.model.types.RequestType;
import io.github.aj316.crimelog.backend.model.types.Status;

import java.time.LocalDateTime;

public record RequestSummaryDto(
        Long requestId,
        RequestType requestType,
        Long caseId,
        String caseNumber,
        Long firId,
        String requesterName,
        Status status,
        String reason,
        LocalDateTime createdAt,
        LocalDateTime reviewedAt,
        String targetLabel
) {
}


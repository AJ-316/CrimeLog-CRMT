package io.github.aj316.crimelog.backend.dto.requests;

import io.github.aj316.crimelog.backend.model.types.Status;

public record RequestReviewDto(
        Long reviewerUserId,
        Status status
) {
}


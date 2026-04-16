package io.github.aj316.crimelog.backend.dto.users;

import io.github.aj316.crimelog.backend.model.types.Status;

public record UserStatusUpdateDto(Status status) {
}
package io.github.aj316.crimelog.backend.dto;

import io.github.aj316.crimelog.backend.model.people.users.User;
import io.github.aj316.crimelog.backend.model.types.Role;
import io.github.aj316.crimelog.backend.model.types.Status;

public record UserSummaryDto(
        Long userId,
        String fullName,
        String email,
        Role role,
        Status accountStatus
) {
    public static UserSummaryDto mapToDto(User user) {
        String fullName = String.join(" ",
                user.getPerson().getFirstName(),
                user.getPerson().getMiddleName() == null ? "" : user.getPerson().getMiddleName(),
                user.getPerson().getLastName()).trim().replaceAll("\\s+", " ");

        return new UserSummaryDto(
                user.getUserId(),
                fullName,
                user.getEmail(),
                user.getRole(),
                user.getAccountStatus()
        );
    }
}
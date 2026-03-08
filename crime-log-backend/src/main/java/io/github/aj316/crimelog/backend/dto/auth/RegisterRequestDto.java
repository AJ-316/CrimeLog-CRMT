package io.github.aj316.crimelog.backend.dto.auth;

import io.github.aj316.crimelog.backend.dto.PersonDto;
import io.github.aj316.crimelog.backend.model.types.Role;

public interface RegisterRequestDto {
    String email();

    String password();

    Role role();

    PersonDto personDto();
}

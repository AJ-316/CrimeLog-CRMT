package io.github.aj316.crimelog.backend.dto;

import io.github.aj316.crimelog.backend.model.people.users.User;
import jakarta.validation.constraints.Email;

public record UserDto(
        @Email String email,
        String password,
        PersonDto personDto
) implements MapDto<User> {

    @Override
    public User mapToEntity() {
        User user = new User();
        user.setEmail(email);
        return user;
    }

    public static UserDto mapToDto(User user) {
        return new UserDto(user.getEmail(), null, PersonDto.mapToDto(user.getPerson()));
    }

}

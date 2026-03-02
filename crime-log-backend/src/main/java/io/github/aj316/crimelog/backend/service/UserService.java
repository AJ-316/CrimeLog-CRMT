package io.github.aj316.crimelog.backend.service;

import io.github.aj316.crimelog.backend.dto.ApiResponse;
import io.github.aj316.crimelog.backend.dto.PersonDto;
import io.github.aj316.crimelog.backend.dto.UserDto;
import io.github.aj316.crimelog.backend.exception.UserAlreadyExistsException;
import io.github.aj316.crimelog.backend.model.Person;
import io.github.aj316.crimelog.backend.model.Role;
import io.github.aj316.crimelog.backend.model.User;
import io.github.aj316.crimelog.backend.repository.UserRepository;
import jakarta.validation.constraints.Email;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User addUser(@Email String email, String password, Role role, Person person) {

        if(userRepository.existsByEmail(email)) {
            throw new UserAlreadyExistsException();
        }

        User user = new User();
        user.setPerson(person);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        return userRepository.save(user);
    }

}

package io.github.aj316.crimelog.backend.service;

import io.github.aj316.crimelog.backend.exception.UserAlreadyExistsException;
import io.github.aj316.crimelog.backend.model.people.Person;
import io.github.aj316.crimelog.backend.model.people.users.LawyerProfile;
import io.github.aj316.crimelog.backend.model.people.users.OfficerProfile;
import io.github.aj316.crimelog.backend.model.types.Role;
import io.github.aj316.crimelog.backend.model.people.users.User;
import io.github.aj316.crimelog.backend.repository.LawyerProfileRepository;
import io.github.aj316.crimelog.backend.repository.OfficerProfileRepository;
import io.github.aj316.crimelog.backend.repository.UserRepository;
import jakarta.validation.constraints.Email;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final LawyerProfileRepository lawyerProfileRepository;
    private final OfficerProfileRepository officerProfileRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, LawyerProfileRepository lawyerProfileRepository, OfficerProfileRepository officerProfileRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.lawyerProfileRepository = lawyerProfileRepository;
        this.officerProfileRepository = officerProfileRepository;
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

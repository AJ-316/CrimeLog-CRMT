package io.github.aj316.crimelog.backend.service;

import io.github.aj316.crimelog.backend.exception.UserAlreadyExistsException;
import io.github.aj316.crimelog.backend.model.people.Person;
import io.github.aj316.crimelog.backend.model.people.users.User;
import io.github.aj316.crimelog.backend.model.types.Role;
import io.github.aj316.crimelog.backend.model.types.Status;
import io.github.aj316.crimelog.backend.repository.UserRepository;
import jakarta.validation.constraints.Email;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User addUser(@Email String email, String password, Role role, Person person) {

        if (userRepository.existsByEmail(email)) {
            throw new UserAlreadyExistsException();
        }

        User user = new User();
        user.setPerson(person);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        return userRepository.save(user);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public List<PendingUserSummary> getPendingUsers() {
        return userRepository.findByAccountStatusOrderByUserIdDesc(Status.PENDING).stream()
                .map(PendingUserSummary::fromUser)
                .toList();
    }

    public String approveUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User does not exist"));

        if (user.getAccountStatus() == Status.APPROVED) {
            return "User(" + userId + ") is already approved";
        }

        user.setAccountStatus(Status.APPROVED);
        userRepository.save(user);
        return "User(" + userId + ") has been approved";
    }

    public record PendingUserSummary(
            Long userId,
            String fullName,
            String email,
            Role role,
            Status accountStatus
    ) {
        private static PendingUserSummary fromUser(User user) {
            String middleName = user.getPerson().getMiddleName();
            String fullName = String.join(" ",
                    user.getPerson().getFirstName(),
                    middleName == null ? "" : middleName,
                    user.getPerson().getLastName()).trim().replaceAll("\\s+", " ");

            return new PendingUserSummary(
                    user.getUserId(),
                    fullName,
                    user.getEmail(),
                    user.getRole(),
                    user.getAccountStatus()
            );
        }
    }

}

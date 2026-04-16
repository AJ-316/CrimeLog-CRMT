package io.github.aj316.crimelog.backend.service;

import io.github.aj316.crimelog.backend.exception.UserAlreadyExistsException;
import io.github.aj316.crimelog.backend.model.people.Person;
import io.github.aj316.crimelog.backend.model.people.users.User;
import io.github.aj316.crimelog.backend.model.types.Role;
import io.github.aj316.crimelog.backend.model.types.Status;
import io.github.aj316.crimelog.backend.repository.CasePersonRepository;
import io.github.aj316.crimelog.backend.repository.LawyerProfileRepository;
import io.github.aj316.crimelog.backend.repository.OfficerProfileRepository;
import io.github.aj316.crimelog.backend.repository.PersonRepository;
import io.github.aj316.crimelog.backend.repository.UserRepository;
import jakarta.validation.constraints.Email;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PersonRepository personRepository;
    private final CasePersonRepository casePersonRepository;
    private final OfficerProfileRepository officerProfileRepository;
    private final LawyerProfileRepository lawyerProfileRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       PersonRepository personRepository,
                       CasePersonRepository casePersonRepository,
                       OfficerProfileRepository officerProfileRepository,
                       LawyerProfileRepository lawyerProfileRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.personRepository = personRepository;
        this.casePersonRepository = casePersonRepository;
        this.officerProfileRepository = officerProfileRepository;
        this.lawyerProfileRepository = lawyerProfileRepository;
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

    public List<PendingUserSummary> getUsers() {
        return userRepository.findAllByOrderByUserIdDesc().stream()
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

    public String updateUserStatus(Long userId, Status accountStatus) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User does not exist"));

        if (accountStatus == null) {
            throw new IllegalArgumentException("Account status is required");
        }

        if (user.getAccountStatus() == accountStatus) {
            return "User(" + userId + ") is already " + accountStatus.name().toLowerCase();
        }

        user.setAccountStatus(accountStatus);
        userRepository.save(user);
        return "User(" + userId + ") status updated to " + accountStatus;
    }

    public String rejectUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User does not exist"));

        if (user.getAccountStatus() == Status.REJECTED) {
            return "User(" + userId + ") is already rejected";
        }

        if (user.getAccountStatus() == Status.APPROVED) {
            throw new IllegalStateException("Approved users cannot be rejected");
        }

        user.setAccountStatus(Status.REJECTED);
        userRepository.save(user);
        return "User(" + userId + ") has been rejected";
    }

    public String deletePendingUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User does not exist"));

        if (casePersonRepository.existsByPerson_PersonId(userId)) {
            throw new IllegalStateException("Cannot delete user because linked case records exist");
        }

        Person person = user.getPerson();
        officerProfileRepository.findById(userId).ifPresent(officerProfileRepository::delete);
        lawyerProfileRepository.findById(userId).ifPresent(lawyerProfileRepository::delete);
        userRepository.delete(user);
        personRepository.delete(person);
        return "User(" + userId + ") deleted successfully";
    }

    public record PendingUserSummary(
            Long userId,
            String fullName,
            String email,
            Role role,
            Status accountStatus
    ) {
        private static PendingUserSummary fromUser(User user) {
            Person person = user.getPerson();

            String firstName = person != null && person.getFirstName() != null ? person.getFirstName() : "Unknown";
            String middleName = person != null && person.getMiddleName() != null ? person.getMiddleName() : "";
            String lastName = person != null && person.getLastName() != null ? person.getLastName() : "User";

            String fullName = String.join(" ", firstName, middleName, lastName)
                .trim()
                .replaceAll("\\s+", " ");

            Role resolvedRole = user.getRole() != null ? user.getRole() : Role.PUBLIC;
            Status resolvedStatus = user.getAccountStatus() != null ? user.getAccountStatus() : Status.PENDING;
            String resolvedEmail = user.getEmail() != null ? user.getEmail() : "unknown@crimelog.in";

            return new PendingUserSummary(
                    user.getUserId(),
                    fullName,
                resolvedEmail,
                resolvedRole,
                resolvedStatus
            );
        }
    }

}

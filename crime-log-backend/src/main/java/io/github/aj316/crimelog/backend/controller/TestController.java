package io.github.aj316.crimelog.backend.controller;

import io.github.aj316.crimelog.backend.dto.ApiResponse;
import io.github.aj316.crimelog.backend.dto.UserDto;
import io.github.aj316.crimelog.backend.model.people.Person;
import io.github.aj316.crimelog.backend.repository.OfficerProfileRepository;
import io.github.aj316.crimelog.backend.repository.PersonRepository;
import io.github.aj316.crimelog.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api")
public class TestController {

    private final UserRepository userRepository;
    private final PersonRepository personRepository;
    private final OfficerProfileRepository officerProfileRepository;

    public TestController(UserRepository userRepository, PersonRepository personRepository, OfficerProfileRepository officerProfileRepository) {
        this.userRepository = userRepository;
        this.personRepository = personRepository;
        this.officerProfileRepository = officerProfileRepository;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/hello/admin")
    public String helloAdmin() {
        return "Backend is connected and accessible to admin login!";
    }

    @GetMapping("/hello/public")
    public String helloPublic() {
        return "Backend is connected and accessible to the public login!";
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/fetch/users")
    public ResponseEntity<ApiResponse<List<UserDto>>> getUsers() {
        return ResponseEntity.ok(ApiResponse.success(fetchAllUsers(), "Users retrieved successfully"));
    }

    public static record TestNameDTO(String firstName) {
    }

    @PreAuthorize("hasRole('OFFICER')")
    @PostMapping("/test/officer/update-name/{id}")
    public ResponseEntity<ApiResponse<String>> updateOfficerName(@PathVariable Long id, @RequestBody TestNameDTO testNameDTO) {
        Person person = personRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Officer not found"));
        person.setFirstName(testNameDTO.firstName);
        personRepository.save(person);
        return ResponseEntity.ok(ApiResponse.success("Officer name updated successfully", "Name update successful"));
    }

    private List<UserDto> fetchAllUsers() {
        return userRepository.findAll().stream().map(UserDto::mapToDto).toList();
    }
}
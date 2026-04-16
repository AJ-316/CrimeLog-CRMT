package io.github.aj316.crimelog.backend.controller;

import io.github.aj316.crimelog.backend.dto.ApiResponse;
import io.github.aj316.crimelog.backend.dto.PersonCriminalHistoryDto;
import io.github.aj316.crimelog.backend.dto.PersonDto;
import io.github.aj316.crimelog.backend.dto.PersonOptionDto;
import io.github.aj316.crimelog.backend.service.PersonService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping({"/api/persons", "/api/person"})
public class PersonController {

    private final PersonService personService;

    public PersonController(PersonService personService) {
        this.personService = personService;
    }

    @PreAuthorize("hasAnyRole('OFFICER','ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<String>> createPerson(@RequestBody PersonDto personDto) {
        personService.addPerson(personDto);
        return ResponseEntity.ok(ApiResponse.success("Person created", "Person added successfully"));
    }

    @PreAuthorize("hasAnyRole('OFFICER','ADMIN')")
    @PutMapping("/{personId:\\d+}")
    public ResponseEntity<ApiResponse<String>> updatePerson(@PathVariable Long personId, @RequestBody PersonDto personDto) {
        personService.updatePerson(personId, personDto);
        return ResponseEntity.ok(ApiResponse.success("Person updated", "Person updated successfully"));
    }

    @PreAuthorize("hasAnyRole('OFFICER','ADMIN')")
    @DeleteMapping("/{personId:\\d+}")
    public ResponseEntity<ApiResponse<String>> deletePerson(@PathVariable Long personId) {
        return ResponseEntity.ok(ApiResponse.success(personService.deletePerson(personId), "Person deleted successfully"));
    }

    @PreAuthorize("hasAnyRole('OFFICER','ADMIN')")
    @PostMapping("/{personId:\\d+}/delete")
    public ResponseEntity<ApiResponse<String>> deletePersonViaPost(@PathVariable Long personId) {
        return ResponseEntity.ok(ApiResponse.success(personService.deletePerson(personId), "Person deleted successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PersonOptionDto>>> getPeople() {
        return ResponseEntity.ok(ApiResponse.success(personService.getPeople(), "People retrieved successfully"));
    }

    @GetMapping("/{personId:\\d+}")
    public ResponseEntity<ApiResponse<PersonDto>> getPerson(@PathVariable Long personId) {
        return ResponseEntity.ok(ApiResponse.success(personService.getPerson(personId), "Person retrieved successfully"));
    }

    @GetMapping("/{personId:\\d+}/history")
    public ResponseEntity<ApiResponse<PersonCriminalHistoryDto>> getCriminalHistory(@PathVariable Long personId) {
        return ResponseEntity.ok(ApiResponse.success(
                personService.getCriminalHistory(personId),
                "Criminal history retrieved successfully"
        ));
    }

    @GetMapping("/{personId:\\d+}/history/suspect")
    public ResponseEntity<ApiResponse<PersonCriminalHistoryDto>> getSuspectHistory(@PathVariable Long personId) {
        return ResponseEntity.ok(ApiResponse.success(
                personService.getSuspectHistory(personId),
                "Suspect history retrieved successfully"
        ));
    }
}


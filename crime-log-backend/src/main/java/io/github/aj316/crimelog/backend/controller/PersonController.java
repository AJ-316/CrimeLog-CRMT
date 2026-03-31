package io.github.aj316.crimelog.backend.controller;

import io.github.aj316.crimelog.backend.dto.ApiResponse;
import io.github.aj316.crimelog.backend.dto.PersonCriminalHistoryDto;
import io.github.aj316.crimelog.backend.dto.PersonOptionDto;
import io.github.aj316.crimelog.backend.service.PersonService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

    @GetMapping
    public ResponseEntity<ApiResponse<List<PersonOptionDto>>> getPeople() {
        return ResponseEntity.ok(ApiResponse.success(personService.getPeople(), "People retrieved successfully"));
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


package io.github.aj316.crimelog.backend.controller;

import io.github.aj316.crimelog.backend.dto.ApiResponse;
import io.github.aj316.crimelog.backend.dto.PublicFirDto;
import io.github.aj316.crimelog.backend.model.cases.FIR;
import io.github.aj316.crimelog.backend.repository.FirRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public")
public class PublicCaseController {

    private final FirRepository firRepository;

    public PublicCaseController(FirRepository firRepository) {
        this.firRepository = firRepository;
    }

    @GetMapping("/cases")
    public ResponseEntity<ApiResponse<List<PublicFirDto>>> getAllCases() {
        List<PublicFirDto> cases = firRepository.findAllByOrderByRegistrationDateTimeDesc().stream()
                .map(PublicFirDto::from)
                .toList();
        return ResponseEntity.ok(ApiResponse.success(cases, "All cases retrieved successfully"));
    }

    @GetMapping("/cases/search")
    public ResponseEntity<ApiResponse<List<PublicFirDto>>> searchCases(
            @RequestParam(required = false) String firNumber,
            @RequestParam(required = false) String accusedName) {

        List<FIR> cases;

        if (firNumber != null && !firNumber.isEmpty()) {
            cases = firRepository.findByFirNumberContainingIgnoreCase(firNumber);
        } else if (accusedName != null && !accusedName.isEmpty()) {
            cases = firRepository.findByAccusedFirstNameContainingIgnoreCaseOrAccusedLastNameContainingIgnoreCase(accusedName, accusedName);
        } else {
            cases = firRepository.findAllByOrderByRegistrationDateTimeDesc();
        }

        List<PublicFirDto> response = cases.stream().map(PublicFirDto::from).toList();
        return ResponseEntity.ok(ApiResponse.success(response, "Cases searched successfully"));
    }

    @GetMapping("/cases/{firNumber}")
        public ResponseEntity<ApiResponse<PublicFirDto>> getCaseDetails(@PathVariable String firNumber) {
        return firRepository.findByFirNumber(firNumber)
                .map(fir -> ResponseEntity.ok(ApiResponse.success(
                PublicFirDto.from(fir),
                        "Case details retrieved successfully"
                )))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}

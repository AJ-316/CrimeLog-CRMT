package io.github.aj316.crimelog.backend.controller;

import io.github.aj316.crimelog.backend.dto.ApiResponse;
import io.github.aj316.crimelog.backend.dto.cases.FirDetailDto;
import io.github.aj316.crimelog.backend.dto.cases.FirRegisterRequest;
import io.github.aj316.crimelog.backend.dto.cases.FirSummaryDto;
import io.github.aj316.crimelog.backend.model.types.FIR_Type;
import io.github.aj316.crimelog.backend.service.AuthenticatedUserService;
import io.github.aj316.crimelog.backend.service.FirService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/fir")
public class FirController {

    private final FirService firService;
    private final AuthenticatedUserService authenticatedUserService;

    public FirController(FirService firService, AuthenticatedUserService authenticatedUserService) {
        this.firService = firService;
        this.authenticatedUserService = authenticatedUserService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FirSummaryDto>>> getFirs() {
        return ResponseEntity.ok(ApiResponse.success(firService.getFirs(), "FIRs retrieved successfully"));
    }

    @GetMapping({"/search", "/_search"})
    public ResponseEntity<ApiResponse<List<FirSummaryDto>>> searchFirs(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) FIR_Type firType,
            @RequestParam(required = false) Boolean linkedToCase,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime registeredFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime registeredTo
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                firService.searchFirs(query, firType, linkedToCase, registeredFrom, registeredTo),
                "Filtered FIRs retrieved successfully"
        ));
    }

    @GetMapping("/{firId:\\d+}")
    public ResponseEntity<ApiResponse<FirDetailDto>> getFir(@PathVariable Long firId) {
        return ResponseEntity.ok(ApiResponse.success(firService.getFir(firId), "FIR retrieved successfully"));
    }

    @PreAuthorize("hasRole('OFFICER')")
    @PostMapping
    public ResponseEntity<ApiResponse<String>> createFIR(@RequestBody FirRegisterRequest firRegisterRequest) {
        Long authenticatedOfficerUserId = authenticatedUserService.getCurrentUserId();
        FirRegisterRequest normalizedRequest = new FirRegisterRequest(
                firRegisterRequest.firNumber(),
                firRegisterRequest.firType(),
                firRegisterRequest.registrationDateTime(),
                firRegisterRequest.accusedFirstName(),
                firRegisterRequest.accusedMiddleName(),
                firRegisterRequest.accusedLastName(),
                firRegisterRequest.accusedContact(),
                firRegisterRequest.accusedDescription(),
                firRegisterRequest.accusedAddress(),
                firRegisterRequest.initialInvestigatingUnitId(),
                authenticatedOfficerUserId,
                firRegisterRequest.incidentPlace(),
                firRegisterRequest.incidentDateTime(),
                firRegisterRequest.incidentDescription()
        );

        return ResponseEntity.ok(ApiResponse.success(firService.createFir(normalizedRequest), "FIR registered successfully"));
    }
}

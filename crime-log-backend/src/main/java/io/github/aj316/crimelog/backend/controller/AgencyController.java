package io.github.aj316.crimelog.backend.controller;

import io.github.aj316.crimelog.backend.dto.AgencyDto;
import io.github.aj316.crimelog.backend.dto.AgencyOptionDto;
import io.github.aj316.crimelog.backend.dto.ApiResponse;
import io.github.aj316.crimelog.backend.service.AgencyService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/agency", "/api/agencies"})
public class AgencyController {

    private final AgencyService agencyService;

    public AgencyController(AgencyService agencyService) {
        this.agencyService = agencyService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AgencyOptionDto>>> getAgencies() {
        return ResponseEntity.ok(ApiResponse.success(agencyService.getAgencies(), "Agencies retrieved successfully"));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<String>> createAgency(@RequestBody AgencyDto agencyDto) {
        return ResponseEntity.ok(ApiResponse.success(agencyService.createAgency(agencyDto), "Agency created successfully"));
    }
}

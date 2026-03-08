package io.github.aj316.crimelog.backend.controller;

import io.github.aj316.crimelog.backend.dto.ApiResponse;
import io.github.aj316.crimelog.backend.dto.cases.*;
import io.github.aj316.crimelog.backend.service.CaseService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/case", "/api/cases"})
public class CaseController {

    private final CaseService caseService;

    public CaseController(CaseService caseService) {
        this.caseService = caseService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CaseSummaryDto>>> getCases() {
        return ResponseEntity.ok(ApiResponse.success(caseService.getCaseSummaries(), "Case details retrieved successfully"));
    }

    @GetMapping("/basic")
    public ResponseEntity<ApiResponse<List<BasicCaseDetailDto>>> getBasicCaseDetails() {
        List<BasicCaseDetailDto> caseDetails = caseService.getBasicCaseDetails();
        return ResponseEntity.ok(ApiResponse.success(caseDetails, "Basic case details retrieved successfully"));
    }

    @GetMapping("/{caseId}")
    public ResponseEntity<ApiResponse<CaseDetailDto>> getCase(@PathVariable Long caseId) {
        return ResponseEntity.ok(ApiResponse.success(caseService.getCaseDetail(caseId), "Case retrieved successfully"));
    }

    @PreAuthorize("hasRole('OFFICER')")
    @PostMapping
    public ResponseEntity<ApiResponse<CaseSummaryDto>> createCase(@RequestBody CreateCaseRequest request) {
        return ResponseEntity.ok(ApiResponse.success(caseService.createCase(request), "Case created successfully"));
    }

    @GetMapping("/{caseId}/persons")
    public ResponseEntity<ApiResponse<List<CaseParticipantDto>>> getCaseParticipants(@PathVariable Long caseId) {
        return ResponseEntity.ok(ApiResponse.success(caseService.getCaseParticipants(caseId), "Case participants retrieved successfully"));
    }

    @PreAuthorize("hasRole('OFFICER')")
    @PostMapping("/{caseId}/persons")
    public ResponseEntity<ApiResponse<CaseParticipantDto>> addCaseParticipant(@PathVariable Long caseId, @RequestBody CaseParticipantCreateRequest request) {
        return ResponseEntity.ok(ApiResponse.success(caseService.addParticipant(caseId, request), "Case participant added successfully"));
    }

    @PreAuthorize("hasRole('LAWYER')")
    @GetMapping("/assigned")
    public ResponseEntity<ApiResponse<List<CaseSummaryDto>>> getAssignedCases(@RequestParam Long lawyerUserId) {
        return ResponseEntity.ok(ApiResponse.success(caseService.getCasesForLawyer(lawyerUserId), "Assigned cases retrieved successfully"));
    }
}

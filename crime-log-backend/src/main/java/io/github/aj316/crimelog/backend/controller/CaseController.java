package io.github.aj316.crimelog.backend.controller;

import io.github.aj316.crimelog.backend.dto.ApiResponse;
import io.github.aj316.crimelog.backend.dto.cases.BasicCaseDetailDto;
import io.github.aj316.crimelog.backend.service.CaseService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/case")
public class CaseController {

    private final CaseService caseService;

    public CaseController(CaseService caseService) {
        this.caseService = caseService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<BasicCaseDetailDto>>> getBasicCaseDetails() {
        List<BasicCaseDetailDto> caseDetails = caseService.getBasicCaseDetails();
        return ResponseEntity.ok(ApiResponse.success(caseDetails, "Basic case details retrieved successfully"));
    }
}

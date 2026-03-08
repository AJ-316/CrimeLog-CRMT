package io.github.aj316.crimelog.backend.controller;

import io.github.aj316.crimelog.backend.dto.ApiResponse;
import io.github.aj316.crimelog.backend.dto.cases.FirDetailDto;
import io.github.aj316.crimelog.backend.dto.cases.FirRegisterRequest;
import io.github.aj316.crimelog.backend.dto.cases.FirSummaryDto;
import io.github.aj316.crimelog.backend.service.FirService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fir")
public class FirController {

    private final FirService firService;

    public FirController(FirService firService) {
        this.firService = firService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FirSummaryDto>>> getFirs() {
        return ResponseEntity.ok(ApiResponse.success(firService.getFirs(), "FIRs retrieved successfully"));
    }

    @GetMapping("/{firId}")
    public ResponseEntity<ApiResponse<FirDetailDto>> getFir(@PathVariable Long firId) {
        return ResponseEntity.ok(ApiResponse.success(firService.getFir(firId), "FIR retrieved successfully"));
    }

    @PreAuthorize("hasRole('OFFICER')")
    @PostMapping
    public ResponseEntity<ApiResponse<String>> createFIR(@RequestBody FirRegisterRequest firRegisterRequest) {
        return ResponseEntity.ok(ApiResponse.success(firService.createFir(firRegisterRequest), "FIR registered successfully"));
    }
}

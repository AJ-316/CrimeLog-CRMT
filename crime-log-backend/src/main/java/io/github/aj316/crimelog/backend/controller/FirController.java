package io.github.aj316.crimelog.backend.controller;

import io.github.aj316.crimelog.backend.dto.ApiResponse;
import io.github.aj316.crimelog.backend.dto.FirRegisterRequest;
import io.github.aj316.crimelog.backend.service.FirService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/fir")
public class FirController {

    private final FirService firService;

    public FirController(FirService firService) {
        this.firService = firService;
    }

    @PreAuthorize("hasRole('OFFICER')")
    @PostMapping
    public ResponseEntity<ApiResponse<String>> createFIR(@RequestBody FirRegisterRequest firRegisterRequest) {
        return ResponseEntity.ok(ApiResponse.success(firService.createFir(firRegisterRequest), "FIR registered successfully"));
    }
}

package io.github.aj316.crimelog.backend.controller;

import io.github.aj316.crimelog.backend.dto.ApiResponse;
import io.github.aj316.crimelog.backend.dto.alerts.AlertDto;
import io.github.aj316.crimelog.backend.dto.alerts.CreateAlertRequest;
import io.github.aj316.crimelog.backend.service.AlertService;
import io.github.aj316.crimelog.backend.service.AuthenticatedUserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {

    private final AlertService alertService;
    private final AuthenticatedUserService authenticatedUserService;

    public AlertController(AlertService alertService, AuthenticatedUserService authenticatedUserService) {
        this.alertService = alertService;
        this.authenticatedUserService = authenticatedUserService;
    }

    @PreAuthorize("hasAnyRole('PUBLIC','OFFICER','ADMIN')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<AlertDto>>> getAlerts() {
        return ResponseEntity.ok(ApiResponse.success(alertService.getActiveAlerts(), "Alerts retrieved successfully"));
    }

    @PreAuthorize("hasAnyRole('OFFICER','ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<AlertDto>> createAlert(@Valid @RequestBody CreateAlertRequest request) {
        Long userId = authenticatedUserService.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(
                alertService.createAlert(request, userId, authenticatedUserService.getCurrentUserRole()),
                "Alert created successfully"
        ));
    }
}

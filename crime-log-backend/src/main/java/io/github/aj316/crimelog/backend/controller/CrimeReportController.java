package io.github.aj316.crimelog.backend.controller;

import io.github.aj316.crimelog.backend.dto.ApiResponse;
import io.github.aj316.crimelog.backend.dto.reports.BroadcastCrimeReportRequest;
import io.github.aj316.crimelog.backend.dto.reports.CrimeReportDetailDto;
import io.github.aj316.crimelog.backend.dto.reports.CrimeReportSummaryDto;
import io.github.aj316.crimelog.backend.dto.reports.UpdateCrimeReportStatusRequest;
import io.github.aj316.crimelog.backend.service.AuthenticatedUserService;
import io.github.aj316.crimelog.backend.service.CrimeReportService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/crime-reports")
public class CrimeReportController {

    private final CrimeReportService crimeReportService;
    private final AuthenticatedUserService authenticatedUserService;

    public CrimeReportController(CrimeReportService crimeReportService, AuthenticatedUserService authenticatedUserService) {
        this.crimeReportService = crimeReportService;
        this.authenticatedUserService = authenticatedUserService;
    }

    @PreAuthorize("hasRole('PUBLIC')")
    @PostMapping
    public ResponseEntity<ApiResponse<io.github.aj316.crimelog.backend.dto.reports.CrimeReportDetailDto>> submitReport(@RequestBody Map<String, Object> request) {
        Long reporterUserId = authenticatedUserService.getCurrentUserId();
        String title = stringValue(request, "title");
        String description = stringValue(request, "description");
        String location = stringValue(request, "location");
        LocalDateTime incidentDateTime = parseDateTime(request.get("incidentDateTime"));
        return ResponseEntity.ok(ApiResponse.success(
                crimeReportService.submitReport(title, description, location, incidentDateTime, reporterUserId, authenticatedUserService.getCurrentUserRole()),
                "Crime report submitted successfully"
        ));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/mine")
    public ResponseEntity<ApiResponse<List<CrimeReportSummaryDto>>> getMyReports() {
        Long userId = authenticatedUserService.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(crimeReportService.getReportsForUser(userId), "Crime reports retrieved successfully"));
    }

    @PreAuthorize("hasAnyRole('ADMIN','OFFICER')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<CrimeReportSummaryDto>>> getAllReports() {
        return ResponseEntity.ok(ApiResponse.success(crimeReportService.getAllReports(), "Crime reports retrieved successfully"));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{reportId:\\d+}")
    public ResponseEntity<ApiResponse<CrimeReportDetailDto>> getReport(@PathVariable Long reportId) {
        Long viewerUserId = authenticatedUserService.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(
                crimeReportService.getReport(reportId, viewerUserId, authenticatedUserService.getCurrentUserRole()),
                "Crime report retrieved successfully"
        ));
    }

    @PreAuthorize("hasAnyRole('ADMIN','OFFICER')")
    @PatchMapping("/{reportId:\\d+}/status")
    public ResponseEntity<ApiResponse<CrimeReportDetailDto>> updateStatus(@PathVariable Long reportId, @Valid @RequestBody UpdateCrimeReportStatusRequest request) {
        Long actorUserId = authenticatedUserService.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(
                crimeReportService.updateStatus(reportId, actorUserId, authenticatedUserService.getCurrentUserRole(), request),
                "Crime report status updated successfully"
        ));
    }

    @PreAuthorize("hasAnyRole('ADMIN','OFFICER')")
    @PostMapping("/{reportId:\\d+}/broadcast")
    public ResponseEntity<ApiResponse<CrimeReportDetailDto>> broadcastReport(@PathVariable Long reportId, @RequestBody BroadcastCrimeReportRequest request) {
        Long actorUserId = authenticatedUserService.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(
                crimeReportService.broadcastReport(reportId, actorUserId, authenticatedUserService.getCurrentUserRole(), request),
                "Crime report broadcasted successfully"
        ));
    }

    private static String stringValue(Map<String, Object> request, String key) {
        Object value = request.get(key);
        return value instanceof String string ? string : "";
    }

    private static LocalDateTime parseDateTime(Object value) {
        if (value instanceof String string && !string.isBlank()) {
            return LocalDateTime.parse(string);
        }

        return null;
    }
}

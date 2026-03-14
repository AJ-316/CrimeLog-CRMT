package io.github.aj316.crimelog.backend.controller;

import io.github.aj316.crimelog.backend.dto.ApiResponse;
import io.github.aj316.crimelog.backend.dto.OfficerProfileDto;
import io.github.aj316.crimelog.backend.dto.requests.RequestDto;
import io.github.aj316.crimelog.backend.model.types.Status;
import io.github.aj316.crimelog.backend.service.OfficerService;
import io.github.aj316.crimelog.backend.service.jwt.CustomUserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/officer")
@PreAuthorize("hasAnyRole('OFFICER','ADMIN')")
public class OfficerController {

    private final OfficerService officerService;

    public OfficerController(OfficerService officerService) {
        this.officerService = officerService;
    }

    @PreAuthorize("hasRole('OFFICER')")
    @PostMapping("/request")
    public ResponseEntity<ApiResponse<String>> sendRequest(@RequestBody RequestDto request) {
        String result = officerService.addRequest(request);
        return ResponseEntity.ok(ApiResponse.success(result, "Officer action processed successfully"));
    }

    @PostMapping("/request/{requestId}")
    public ResponseEntity<ApiResponse<String>> updateRequest(@PathVariable Long requestId, @RequestParam(name = "d") Long userId, @RequestParam Status status) {
        String result = officerService.updateRequest(userId, requestId, status);

        return ResponseEntity.ok(ApiResponse.success(result, "Officer action status updated successfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<OfficerProfileDto>> getOfficerProfile(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(ApiResponse.success(officerService.getOfficerProfile(user.getUid()), "Officer profile retrieved successfully"));
    }


}

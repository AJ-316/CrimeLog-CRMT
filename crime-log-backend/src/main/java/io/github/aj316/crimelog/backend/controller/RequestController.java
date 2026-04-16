package io.github.aj316.crimelog.backend.controller;

import io.github.aj316.crimelog.backend.dto.ApiResponse;
import io.github.aj316.crimelog.backend.dto.requests.RequestReviewDto;
import io.github.aj316.crimelog.backend.dto.requests.RequestSummaryDto;
import io.github.aj316.crimelog.backend.service.AuthenticatedUserService;
import io.github.aj316.crimelog.backend.service.OfficerService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class RequestController {

    private final OfficerService officerService;
    private final AuthenticatedUserService authenticatedUserService;

    public RequestController(OfficerService officerService, AuthenticatedUserService authenticatedUserService) {
        this.officerService = officerService;
        this.authenticatedUserService = authenticatedUserService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/pending")
    public ResponseEntity<ApiResponse<List<RequestSummaryDto>>> getPendingRequests() {
        return ResponseEntity.ok(ApiResponse.success(officerService.getPendingRequests(), "Pending requests retrieved successfully"));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/mine")
    public ResponseEntity<ApiResponse<List<RequestSummaryDto>>> getMyRequests() {
        Long userId = authenticatedUserService.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(officerService.getRequestsForUser(userId), "Requests retrieved successfully"));
    }

    @PreAuthorize("hasAnyRole('ADMIN','OFFICER')")
    @PatchMapping("/{requestId}")
    public ResponseEntity<ApiResponse<String>> updateRequest(@PathVariable Long requestId, @RequestBody RequestReviewDto review) {
        Long reviewerUserId = authenticatedUserService.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(
            officerService.updateRequest(reviewerUserId, requestId, review.status()),
                "Request updated successfully"
        ));
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{requestId}")
    public ResponseEntity<ApiResponse<String>> deleteRequest(@PathVariable Long requestId) {
        Long actorUserId = authenticatedUserService.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(
                officerService.deleteRequest(actorUserId, authenticatedUserService.getCurrentUserRole(), requestId),
                "Request deleted successfully"
        ));
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{requestId}/delete")
    public ResponseEntity<ApiResponse<String>> deleteRequestViaPost(@PathVariable Long requestId) {
        Long actorUserId = authenticatedUserService.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(
                officerService.deleteRequest(actorUserId, authenticatedUserService.getCurrentUserRole(), requestId),
                "Request deleted successfully"
        ));
    }
}


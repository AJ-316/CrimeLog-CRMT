package io.github.aj316.crimelog.backend.controller;

import io.github.aj316.crimelog.backend.dto.ApiResponse;
import io.github.aj316.crimelog.backend.dto.requests.RequestReviewDto;
import io.github.aj316.crimelog.backend.dto.requests.RequestSummaryDto;
import io.github.aj316.crimelog.backend.service.OfficerService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class RequestController {

    private final OfficerService officerService;

    public RequestController(OfficerService officerService) {
        this.officerService = officerService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/pending")
    public ResponseEntity<ApiResponse<List<RequestSummaryDto>>> getPendingRequests() {
        return ResponseEntity.ok(ApiResponse.success(officerService.getPendingRequests(), "Pending requests retrieved successfully"));
    }

    @GetMapping("/mine")
    public ResponseEntity<ApiResponse<List<RequestSummaryDto>>> getMyRequests(@RequestParam Long userId) {
        return ResponseEntity.ok(ApiResponse.success(officerService.getRequestsForUser(userId), "Requests retrieved successfully"));
    }

    @PreAuthorize("hasAnyRole('ADMIN','OFFICER')")
    @PatchMapping("/{requestId}")
    public ResponseEntity<ApiResponse<String>> updateRequest(@PathVariable Long requestId, @RequestBody RequestReviewDto review) {
        return ResponseEntity.ok(ApiResponse.success(
                officerService.updateRequest(review.reviewerUserId(), requestId, review.status()),
                "Request updated successfully"
        ));
    }
}


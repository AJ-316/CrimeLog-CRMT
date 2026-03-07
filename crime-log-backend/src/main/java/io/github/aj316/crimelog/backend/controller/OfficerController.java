package io.github.aj316.crimelog.backend.controller;

import io.github.aj316.crimelog.backend.dto.ApiResponse;
import io.github.aj316.crimelog.backend.dto.OfficerActionRequestDto;
import io.github.aj316.crimelog.backend.service.OfficerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/officer")
public class OfficerController {

    private final OfficerService officerService;

    public OfficerController(OfficerService officerService) {
        this.officerService = officerService;

    }

    @PostMapping("/action/request")
    public ResponseEntity<ApiResponse<String>> requestOfficerAction(@RequestBody OfficerActionRequestDto request) {
        String result = officerService.addOfficerActionRequest(request);
        return ResponseEntity.ok(ApiResponse.success(result, "Officer action processed successfully"));
    }

    @PostMapping("/action/status/{requestId}")
    public ResponseEntity<ApiResponse<String>> setOfficerActionStatus(@PathVariable Long requestId, @RequestParam boolean isApproved) {
        String result = officerService.setOfficerActionRequestStatus(requestId, isApproved);
        return ResponseEntity.ok(ApiResponse.success(result, "Officer action status updated successfully"));
    }
}

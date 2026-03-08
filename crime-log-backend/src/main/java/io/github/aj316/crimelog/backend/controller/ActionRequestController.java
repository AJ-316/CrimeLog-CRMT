package io.github.aj316.crimelog.backend.controller;

import io.github.aj316.crimelog.backend.dto.ApiResponse;
import io.github.aj316.crimelog.backend.dto.requests.RequestDto;
import io.github.aj316.crimelog.backend.service.OfficerService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/action")
public class ActionRequestController {

    private final OfficerService officerService;

    public ActionRequestController(OfficerService officerService) {
        this.officerService = officerService;
    }

    @PreAuthorize("hasAnyRole('OFFICER','LAWYER')")
    @PostMapping("/request")
    public ResponseEntity<ApiResponse<String>> createRequest(@RequestBody RequestDto requestDto) {
        return ResponseEntity.ok(ApiResponse.success(
                officerService.addRequest(requestDto),
                "Request submitted successfully"
        ));
    }
}


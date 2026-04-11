package io.github.aj316.crimelog.backend.controller;

import io.github.aj316.crimelog.backend.dto.ApiResponse;
import io.github.aj316.crimelog.backend.service.UserService;
import io.github.aj316.crimelog.backend.service.UserService.PendingUserSummary;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/pending")
    public ResponseEntity<ApiResponse<List<PendingUserSummary>>> getPendingUsers() {
        return ResponseEntity.ok(ApiResponse.success(userService.getPendingUsers(), "Pending users retrieved successfully"));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{userId}/approve")
    public ResponseEntity<ApiResponse<String>> approveUser(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success(userService.approveUser(userId), "User approved successfully"));
    }
}
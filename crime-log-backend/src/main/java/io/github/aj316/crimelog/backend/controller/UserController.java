package io.github.aj316.crimelog.backend.controller;

import io.github.aj316.crimelog.backend.dto.ApiResponse;
import io.github.aj316.crimelog.backend.dto.users.UserStatusUpdateDto;
import io.github.aj316.crimelog.backend.service.UserService;
import io.github.aj316.crimelog.backend.service.UserService.PendingUserSummary;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMethod;
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
    @GetMapping
    public ResponseEntity<ApiResponse<List<PendingUserSummary>>> getUsers() {
        return ResponseEntity.ok(ApiResponse.success(userService.getUsers(), "Users retrieved successfully"));
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

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{userId}/reject")
    public ResponseEntity<ApiResponse<String>> rejectUser(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success(userService.rejectUser(userId), "User rejected successfully"));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @RequestMapping(value = "/{userId}/status", method = {RequestMethod.PATCH, RequestMethod.POST, RequestMethod.PUT})
    public ResponseEntity<ApiResponse<String>> updateUserStatus(@PathVariable Long userId, @org.springframework.web.bind.annotation.RequestBody UserStatusUpdateDto request) {
        return ResponseEntity.ok(ApiResponse.success(userService.updateUserStatus(userId, request.status()), "User status updated successfully"));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{userId}")
    public ResponseEntity<ApiResponse<String>> deletePendingUser(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success(userService.deletePendingUser(userId), "User deleted successfully"));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{userId}/delete")
    public ResponseEntity<ApiResponse<String>> deletePendingUserViaPost(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success(userService.deletePendingUser(userId), "User deleted successfully"));
    }
}
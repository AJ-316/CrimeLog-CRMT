package io.github.aj316.crimelog.backend.controller;

import io.github.aj316.crimelog.backend.dto.*;
import io.github.aj316.crimelog.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<String>> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(ApiResponse.success(authService.login(request), "Login successful"));
    }

    @PostMapping("/register/public")
    public ResponseEntity<ApiResponse<String>> registerPublic(@RequestBody RegisterUserRequest request) {
        return ResponseEntity.ok(ApiResponse.success(authService.register(request) + " Registered", "User added successfully"));
    }

    @PostMapping("/register/admin")
    public ResponseEntity<ApiResponse<String>> registerAdmin(@RequestBody RegisterUserRequest request) {
        return ResponseEntity.ok(ApiResponse.success(authService.register(request) + " Registered", "Admin added successfully"));
    }

    @PostMapping("/register/lawyer")
    public ResponseEntity<ApiResponse<String>> registerLawyer(@RequestBody RegisterLawyerRequest request) {
        return ResponseEntity.ok(ApiResponse.success(authService.register(request) + " Registered", "Lawyer added successfully"));
    }

    @PostMapping("/register/officer")
    public ResponseEntity<ApiResponse<String>> registerOfficer(@RequestBody RegisterOfficerRequest request) {
        return ResponseEntity.ok(ApiResponse.success(authService.register(request) + " Registered", "Officer added successfully"));
    }

}

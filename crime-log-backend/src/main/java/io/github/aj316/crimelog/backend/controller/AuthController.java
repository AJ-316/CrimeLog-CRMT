package io.github.aj316.crimelog.backend.controller;

import io.github.aj316.crimelog.backend.dto.ApiResponse;
import io.github.aj316.crimelog.backend.dto.TokenDto;
import io.github.aj316.crimelog.backend.dto.auth.LoginRequest;
import io.github.aj316.crimelog.backend.dto.auth.RegisterLawyerRequest;
import io.github.aj316.crimelog.backend.dto.auth.RegisterOfficerRequest;
import io.github.aj316.crimelog.backend.dto.auth.RegisterUserRequest;
import io.github.aj316.crimelog.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<TokenDto>> login(@RequestBody LoginRequest request) {
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

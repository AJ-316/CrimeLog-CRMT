package io.github.aj316.crimelog.backend.controller;

import io.github.aj316.crimelog.backend.dto.ApiResponse;
import io.github.aj316.crimelog.backend.dto.TokenDto;
import io.github.aj316.crimelog.backend.dto.auth.LoginRequest;
import io.github.aj316.crimelog.backend.dto.auth.RegisterLawyerRequest;
import io.github.aj316.crimelog.backend.dto.auth.RegisterOfficerRequest;
import io.github.aj316.crimelog.backend.dto.auth.RegisterUserRequest;
import io.github.aj316.crimelog.backend.model.types.Role;
import io.github.aj316.crimelog.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
        RegisterUserRequest normalizedRequest = new RegisterUserRequest(
                request.email(),
                request.password(),
                Role.PUBLIC,
                request.personDto()
        );
        return ResponseEntity.ok(ApiResponse.success(authService.register(normalizedRequest) + " Registered", "User added successfully"));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/register/admin")
    public ResponseEntity<ApiResponse<String>> registerAdmin(@RequestBody RegisterUserRequest request) {
        RegisterUserRequest normalizedRequest = new RegisterUserRequest(
                request.email(),
                request.password(),
                Role.ADMIN,
                request.personDto()
        );
        return ResponseEntity.ok(ApiResponse.success(authService.register(normalizedRequest) + " Registered", "Admin added successfully"));
    }

    @PostMapping("/register/lawyer")
    public ResponseEntity<ApiResponse<String>> registerLawyer(@RequestBody RegisterLawyerRequest request) {
        RegisterLawyerRequest normalizedRequest = new RegisterLawyerRequest(
                request.email(),
                request.password(),
                Role.LAWYER,
                request.personDto(),
                request.barCouncilId(),
                request.barRegistrationNumber(),
                request.enrollmentDate(),
                request.yearsOfExperience(),
                request.specialization(),
                request.licenseStatus(),
                request.firmName(),
                request.officeAddress(),
                request.officialContact(),
                request.isPublicDefender()
        );
        return ResponseEntity.ok(ApiResponse.success(authService.register(normalizedRequest) + " Registered", "Lawyer added successfully"));
    }

    @PostMapping("/register/officer")
    public ResponseEntity<ApiResponse<String>> registerOfficer(@RequestBody RegisterOfficerRequest request) {
        RegisterOfficerRequest normalizedRequest = new RegisterOfficerRequest(
                request.email(),
                request.password(),
                Role.OFFICER,
                request.personDto(),
                request.badgeNumber(),
                request.departmentUnitId(),
                request.joiningDate(),
                request.activeStatus()
        );
        return ResponseEntity.ok(ApiResponse.success(authService.register(normalizedRequest) + " Registered", "Officer added successfully"));
    }
}

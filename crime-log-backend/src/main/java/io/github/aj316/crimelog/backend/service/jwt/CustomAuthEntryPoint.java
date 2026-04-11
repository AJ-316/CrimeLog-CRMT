package io.github.aj316.crimelog.backend.service.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.aj316.crimelog.backend.dto.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomAuthEntryPoint implements AuthenticationEntryPoint {

    private static final Logger log = LoggerFactory.getLogger(CustomAuthEntryPoint.class);

    private final ObjectMapper objectMapper;

    public CustomAuthEntryPoint(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void commence(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException
    ) throws IOException {

        String message = "Authentication failed";

        Object jwtAuthError = request.getAttribute(JwtAuthenticationFilter.JWT_AUTH_ERROR_ATTRIBUTE);
        if (jwtAuthError instanceof String jwtMessage && !jwtMessage.isBlank()) {
            message = "Session expired. Please sign in again.";
        } else if (authException instanceof DisabledException) {
            message = "Account not approved yet. Wait for admin to approve your account.";
        } else if (authException instanceof LockedException) {
            message = "Account suspended";
        } else if (authException instanceof BadCredentialsException) {
            message = authException.getMessage() != null ? authException.getMessage() : message;
        }

        log.warn("Authentication failed: {}", message);

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");

        ApiResponse<String> apiResponse = ApiResponse.failure(message);

        objectMapper.writeValue(response.getOutputStream(), apiResponse);
    }
}
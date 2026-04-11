package io.github.aj316.crimelog.backend.service;

import io.github.aj316.crimelog.backend.model.people.users.User;
import io.github.aj316.crimelog.backend.model.types.Role;
import io.github.aj316.crimelog.backend.repository.UserRepository;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class AuthenticatedUserService {

    private final UserRepository userRepository;

    public AuthenticatedUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Long getCurrentUserId() {
        return getCurrentUser().getUserId();
    }

    public Role getCurrentUserRole() {
        return getCurrentUser().getRole();
    }

    private User getCurrentUser() {
        String email = getCurrentUserEmail();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Authenticated user account not found"));
    }

    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication instanceof AnonymousAuthenticationToken) {
            throw new IllegalArgumentException("Authentication required");
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails userDetails) {
            return userDetails.getUsername();
        }

        if (principal instanceof String principalName && !principalName.isBlank() && !"anonymousUser".equals(principalName)) {
            return principalName;
        }

        throw new IllegalArgumentException("Unable to resolve authenticated user");
    }
}

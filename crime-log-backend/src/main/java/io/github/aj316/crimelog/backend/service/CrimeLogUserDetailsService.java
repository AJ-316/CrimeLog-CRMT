package io.github.aj316.crimelog.backend.service;

import io.github.aj316.crimelog.backend.model.types.AccountStatus;
import io.github.aj316.crimelog.backend.model.people.users.User;
import io.github.aj316.crimelog.backend.repository.UserRepository;
import org.jspecify.annotations.NullMarked;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CrimeLogUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CrimeLogUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @NullMarked
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .disabled(user.getAccountStatus() != AccountStatus.APPROVED)
                .build();
    }
}


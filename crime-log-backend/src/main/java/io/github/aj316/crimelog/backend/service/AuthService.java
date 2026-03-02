package io.github.aj316.crimelog.backend.service;

import io.github.aj316.crimelog.backend.dto.*;
import io.github.aj316.crimelog.backend.model.Person;
import io.github.aj316.crimelog.backend.model.User;
import io.github.aj316.crimelog.backend.service.jwt.JwtService;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.Email;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserService userService;
    private final PersonService personService;

    public AuthService(AuthenticationManager authenticationManager, JwtService jwtService, UserService userService, PersonService personService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userService = userService;
        this.personService = personService;
    }

    public String login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        return jwtService.generateToken(userDetails.getUsername());
    }

    @Transactional
    public @Email String register(RegisterRequest request) {
        Person person = personService.addPerson(request.personDto());
        User user = userService.addUser(request.email(), request.password(), request.role(), person);

        return user.getEmail();
    }

}

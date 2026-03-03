package io.github.aj316.crimelog.backend.service;

import io.github.aj316.crimelog.backend.dto.*;
import io.github.aj316.crimelog.backend.model.people.Person;
import io.github.aj316.crimelog.backend.model.people.users.LawyerProfile;
import io.github.aj316.crimelog.backend.model.people.users.OfficerProfile;
import io.github.aj316.crimelog.backend.model.people.users.User;
import io.github.aj316.crimelog.backend.model.types.*;
import io.github.aj316.crimelog.backend.service.jwt.JwtService;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.Email;
import org.jspecify.annotations.NonNull;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserService userService;
    private final PersonService personService;
    private final OfficerService officerService;
    private final LawyerService lawyerService;

    public AuthService(AuthenticationManager authenticationManager, JwtService jwtService, UserService userService,
                       PersonService personService, OfficerService officerService, LawyerService lawyerService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userService = userService;
        this.personService = personService;
        this.officerService = officerService;
        this.lawyerService = lawyerService;
    }

    public String login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        return jwtService.generateToken(userDetails.getUsername());
    }

    @Transactional
    public @Email String register(RegisterRequestDto requestDto) {
        Person person = personService.addPerson(requestDto.personDto());
        User user = userService.addUser(requestDto.email(), requestDto.password(), requestDto.role(), person);

        // todo : temporary auto approval for admin
        if(requestDto.role().equals(Role.ADMIN)){
            user.setAccountStatus(AccountStatus.APPROVED);
        }

        if(requestDto instanceof RegisterLawyerRequest request) {
            lawyerService.registerProfile(user.getUserId(), request);
        } else if(requestDto instanceof RegisterOfficerRequest request) {
            officerService.registerProfile(user.getUserId(), request);
        }

        return user.getEmail();
    }



}

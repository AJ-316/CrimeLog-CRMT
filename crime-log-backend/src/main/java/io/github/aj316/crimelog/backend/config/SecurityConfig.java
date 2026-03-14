package io.github.aj316.crimelog.backend.config;

import io.github.aj316.crimelog.backend.model.people.Person;
import io.github.aj316.crimelog.backend.model.people.users.User;
import io.github.aj316.crimelog.backend.model.types.Status;
import io.github.aj316.crimelog.backend.model.types.Gender;
import io.github.aj316.crimelog.backend.model.types.Role;
import io.github.aj316.crimelog.backend.repository.PersonRepository;
import io.github.aj316.crimelog.backend.repository.UserRepository;
import io.github.aj316.crimelog.backend.service.jwt.CustomAuthEntryPoint;
import io.github.aj316.crimelog.backend.service.jwt.CustomUserDetailsService;
import io.github.aj316.crimelog.backend.service.jwt.JwtAuthenticationFilter;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.time.LocalDate;

@EnableMethodSecurity
@Configuration
public class SecurityConfig {

    private final CustomAuthEntryPoint customAuthEntryPoint;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(CustomAuthEntryPoint customAuthEntryPoint, JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.customAuthEntryPoint = customAuthEntryPoint;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, DaoAuthenticationProvider provider) {
        http.csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .anyRequest().authenticated()
                ).exceptionHandling(exception ->
                        exception.authenticationEntryPoint(customAuthEntryPoint)
                ).sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                ).addFilterBefore(jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class)
                .authenticationProvider(provider);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) {
        return config.getAuthenticationManager();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider(CustomUserDetailsService userDetailsService, PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder);

        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    CommandLineRunner seedAdmin(UserRepository userRepo,
                                PersonRepository personRepo,
                                PasswordEncoder encoder) {

        return args -> {

            if (!userRepo.existsByEmail("admin@crimelog.com")) {

                Person person = new Person();
                person.setFirstName("System");
                person.setLastName("Administrator");
                person.setGender(Gender.OTHER);
                person.setNationalityCode("IN");
                person.setDateOfBirth(LocalDate.now());
                person.setContactPrimary("100000000");
                person.setContactSecondary("100000000");
                person.setNationalId("000000000000");

                personRepo.save(person);

                User admin = new User();
                admin.setPerson(person);   // IMPORTANT
                admin.setEmail("admin@crimelog.com");
                admin.setPassword(encoder.encode("admin123"));
                admin.setRole(Role.ADMIN);
                admin.setAccountStatus(Status.APPROVED);
                userRepo.save(admin);
            }
        };
    }
}
package io.github.aj316.crimelog.backend.service.jwt;

import io.github.aj316.crimelog.backend.model.people.users.User;
import io.github.aj316.crimelog.backend.model.types.Role;
import jakarta.validation.constraints.Email;
import lombok.Getter;
import org.jspecify.annotations.NullMarked;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Getter
public class CustomUserDetails implements UserDetails {

    private final @Email String email;
    private final Long uid;
    private final Role role;
    private final String password;

    public CustomUserDetails(User user) {
        this.email = user.getEmail();
        this.uid = user.getUserId();
        this.role = user.getRole();
        this.password = user.getPassword();
    }

    @Override
    @NullMarked
    public String getUsername() {
        return getEmail();
    }

    @Override
    @NullMarked
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public @Nullable String getPassword() {
        return password;
    }
}
package io.github.aj316.crimelog.backend.service.jwt;

import io.github.aj316.crimelog.backend.model.types.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey secretKey;

    public JwtService(@Value("${jwt.secret}") String secret) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(String email, Role role, Long uid) {
        return Jwts.builder()
                .subject(email)
                .claim("role", role.name())
                .claim("uid", uid)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1 hour
                .signWith(secretKey)
                .compact();
    }

    private Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    public Role extractRole(String token) {
        return Role.valueOf(extractClaims(token).get("role", String.class));
    }

    public Long extractUid(String token) {
        return extractClaims(token).get("uid", Number.class).longValue();
    }

    public boolean isTokenExpired(String token) {
        return extractClaims(token).getExpiration().before(new Date());
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        Long uid = extractUid(token);
        Role role = extractRole(token);

        if (!(userDetails instanceof CustomUserDetails user))
            return false;

        return username.equals(user.getUsername())
                && uid.equals(user.getUid())
                && role.equals(user.getRole())
                && !isTokenExpired(token);

        /*String username = extractUsername(token);

        return username.equals(userDetails.getUsername());*/
    }
}
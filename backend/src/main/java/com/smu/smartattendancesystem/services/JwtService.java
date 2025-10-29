package com.smu.smartattendancesystem.services;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.smu.smartattendancesystem.models.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import static io.jsonwebtoken.Jwts.SIG.HS256;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

@Service
public class JwtService {
    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private int expirationMs;

    private SecretKey key;

    // Initializes the key after the class is instantiated and the jwtSecret is
    // injected,
    // preventing the repeated creation of the key and enhancing performance
    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    // Generate JWT token
    public String generateToken(User user) {

        long currentTime = System.currentTimeMillis();

        return Jwts.builder()
                .subject(user.getEmail())
                .claim("name", user.getName())
                .claim("perm", user.getPermissionLevel())
                .claim("studentId", user.getLinkedStudentId())
                .issuedAt(new Date(currentTime))
                .expiration(new Date(currentTime + expirationMs))
                .signWith(key, HS256)
                .compact();

    }

    // Refresh JWT token
    public String refreshToken(String oldToken) {
        Claims claims = getClaims(oldToken);
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .subject(claims.getSubject())
                .claims(claims)
                .issuedAt(new Date(now))
                .expiration(new Date(now + expirationMs))
                .signWith(key, HS256)
                .compact();
    }

    // Validate JWT token
    public boolean validateJwtToken(String token) {
        try {
            @SuppressWarnings("unused")
            Jws<Claims> claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (SecurityException e) {
            System.out.println("Invalid JWT signature: " + e.getMessage());
        } catch (MalformedJwtException e) {
            System.out.println("Invalid JWT token: " + e.getMessage());
        } catch (ExpiredJwtException e) {
            System.out.println("JWT token is expired: " + e.getMessage());
        } catch (UnsupportedJwtException e) {
            System.out.println("JWT token is unsupported: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            System.out.println("JWT claims string is empty: " + e.getMessage());
        }
        return false;
    }

    // Extract payload from JWT token
    public Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // Extract email from JWT token
    public String getSubject(String token) {
        return getClaims(token).getSubject();
    }

    // Extract permission level from JWT token
    public Integer getPermissionLevel(String token) {
        return getClaims(token).get("perm", Integer.class);
    }

    // Get expiration time
    public long getExpirationMs() {
        return expirationMs;
    }
}

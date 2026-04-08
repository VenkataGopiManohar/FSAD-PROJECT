package com.edulib.backend.service;

import com.edulib.backend.config.JwtService;
import com.edulib.backend.dto.AuthLoginRequest;
import com.edulib.backend.dto.AuthRegisterRequest;
import com.edulib.backend.dto.AuthResponse;
import com.edulib.backend.model.AppUser;
import com.edulib.backend.repository.AppUserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AuthService {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(AppUserRepository appUserRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse register(AuthRegisterRequest request) {
        if (appUserRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }
        if (!"user".equals(request.getRole()) && !"admin".equals(request.getRole())) {
            throw new IllegalArgumentException("role must be user or admin");
        }

        AppUser user = new AppUser();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setStatus("active");
        AppUser saved = appUserRepository.save(user);

        return buildAuthResponse(saved);
    }

    public AuthResponse login(AuthLoginRequest request) {
        AppUser user = appUserRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        if (!user.getRole().equals(request.getRole())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        if (!"active".equals(user.getStatus())) {
            throw new IllegalArgumentException("Account is suspended");
        }

        return buildAuthResponse(user);
    }

    public AuthResponse me(String email) {
        AppUser user = appUserRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        AuthResponse response = new AuthResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setJoinedAt(user.getJoinedAt());
        response.setStatus(user.getStatus());
        return response;
    }

    private AuthResponse buildAuthResponse(AppUser user) {
        String token = jwtService.generateToken(
                org.springframework.security.core.userdetails.User
                        .withUsername(user.getEmail())
                        .password(user.getPassword())
                        .authorities("ROLE_" + user.getRole().toUpperCase())
                        .build(),
                Map.of("role", user.getRole(), "id", user.getId())
        );

        AuthResponse response = new AuthResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setJoinedAt(user.getJoinedAt());
        response.setStatus(user.getStatus());
        response.setToken(token);
        return response;
    }
}

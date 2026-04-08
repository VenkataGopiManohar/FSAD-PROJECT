package com.edulib.backend.service;

import com.edulib.backend.model.AppUser;
import com.edulib.backend.repository.AppUserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class AuthorizationService {

    private final AppUserRepository appUserRepository;

    public AuthorizationService(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

    public AppUser currentUser(Authentication authentication) {
        String email = authentication.getName();
        return appUserRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public void assertSelfOrAdmin(String targetUserId, Authentication authentication) {
        AppUser current = currentUser(authentication);
        boolean admin = "admin".equalsIgnoreCase(current.getRole());
        if (!admin && !current.getId().equals(targetUserId)) {
            throw new org.springframework.security.access.AccessDeniedException("Forbidden");
        }
    }

    public void assertAdmin(Authentication authentication) {
        AppUser current = currentUser(authentication);
        if (!"admin".equalsIgnoreCase(current.getRole())) {
            throw new org.springframework.security.access.AccessDeniedException("Forbidden");
        }
    }
}
